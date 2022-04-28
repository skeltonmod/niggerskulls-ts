import Phaser from "phaser";

export default class Monster extends Phaser.Physics.Arcade.Sprite {
  private direction: number = 1;
  private speed = 30;
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    frame?: string | number
  ) {
    super(scene, x, y, texture, frame);
  }

  public setDirection(direction: number) {
    this.direction = direction;
  }

  create() {
    this.anims.create({
      key: "move",
      frames: this.anims.generateFrameNumbers("monster1", { frames: [0, 1] }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.play("move");
    // Set collision box
    this.setSize(8, 8);
  }

  destroy(fromScene?: boolean | undefined): void {
    super.destroy(fromScene);
  }

  // Set the monster's speed
  public setSpeed(speed: number) {
    this.speed = speed;
  }

  update() {
    if (this.body.onWall()) {
      this.direction *= -1;
      this.flipX = this.direction < 0;
    }

    this.body.velocity.x = this.direction * this.speed;

    // Get colliding objects


    // destroy the monster if it touches the
    if (this.body.y > 256) {
      this.destroy();
    }
  }
}
