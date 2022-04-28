import Phaser from "phaser";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private direction: number = 1;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
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

    this.direction = Number(rightDown) - Number(leftDown);
    if (!cursorKeys) {
      return;
    }

    if (this.direction !== 0) {
      this.flipX = this.direction < 0;
      this.anims.play("walk", true);
      this.setVelocityX(this.direction * 100);
    } else {
      this.anims.play("idle", true);
      this.setVelocityX(0);
    }

    // Jump
    if (cursorKeys.space.isDown && this.body.onFloor()) {
      this.setVelocityY(-150);
      this.anims.play("jump", true);
    }

    if (this.body.y > 128) {
      this.body.y = 0;
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
