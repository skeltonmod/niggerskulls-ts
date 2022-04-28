import Phaser from "phaser";
enum STATE {
  MOVE,
  JUMP,
  IDLE,
  CARRY,
}
export default class Player extends Phaser.Physics.Arcade.Sprite {
  private direction: number = 1;
  private currentState: STATE = STATE.IDLE;
  private carriedObject!: Phaser.Physics.Arcade.Sprite | null;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
  }

  public getDirection() {
    return this.direction;
  }

  public setCarriedObject(object: Phaser.Physics.Arcade.Sprite | null) {
    if (!this.carriedObject && object) {
      this.carriedObject = object;
      console.log(this.carriedObject);
      this.carriedObject.flipY = true;
    }

    if(this.carriedObject && !object){
      this.carriedObject = null;
    }
  }

  create() {
    this.anims.create({
      key: "walk",
      frames: this.anims.generateFrameNumbers("player", { frames: [0, 1] }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player", { frames: [0] }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: "jump",
      frames: this.anims.generateFrameNumbers("player", { frames: [2, 3] }),
      frameRate: 10,
    });
    this.anims.play("idle");
    this.setBounce(0.2);
  }

  update(cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys) {
    const leftDown = cursorKeys.left?.isDown;
    const rightDown = cursorKeys.right?.isDown;

    const direction = Number(rightDown) - Number(leftDown);
    if (!cursorKeys) {
      return;
    }

    if (this.carriedObject) {
      this.carriedObject.body.reset(this.x, this.y - 8);
    }

    if (direction !== 0) {
      this.currentState = STATE.MOVE;
    } else {
      this.currentState = STATE.IDLE;
    }
    // Jump
    if (cursorKeys.space.isDown && this.body.onFloor()) {
      this.currentState = STATE.JUMP;
    }

    if (this.body.y > 128) {
      this.body.y = 0;
    }

    switch (this.currentState) {
      case STATE.MOVE:
        this.setVelocityX(this.direction * 100);
        this.setFlipX(this.direction < 0);
        this.anims.play("walk", true);
        this.direction = direction;
        break;
      case STATE.JUMP:
        this.setVelocityY(-150);
        this.anims.play("jump", true);
        if (this.carriedObject) {
          // Throw the carried object in a direction
          this.carriedObject.body.reset(this.carriedObject.body.x + 16 * this.direction, this.carriedObject.body.y - 8);
          this.carriedObject.body.gameObject.setDirection(this.direction);
          this.carriedObject.setFlipX(this.direction < 0);
          this.carriedObject.flipY = false;

          // Clean the carried object
          this.setCarriedObject(null);
        }
        break;
      case STATE.IDLE:
        this.setVelocityX(0);
        this.anims.play("idle", true);
        break;
    }
  }
}

Phaser.GameObjects.GameObjectFactory.register(
  "player",
  function (
    this: Phaser.GameObjects.GameObjectFactory,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    const sprite = new Player(this.scene, x, y, texture, frame);

    this.displayList.add(sprite);
    this.updateList.add(sprite);

    this.scene.physics.world.enableBody(sprite);
    return sprite;
  }
);
