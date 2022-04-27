import Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private monster!: Phaser.Physics.Arcade.Sprite;
  private direction: number = 1;
  private monster_direction: number = 1;
  private cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
  constructor() {
    super("game-scene");
  }

  preload() {
    this.cursorKeys = this.input.keyboard.createCursorKeys();
  }

  create() {
    const map = this.make.tilemap({ key: "scene1" });
    const tileset = map.addTilesetImage("world", "tileset");

    map.createLayer("foreground", tileset, 64, 64);
    const background = map.createLayer("background", tileset, 64, 64);
    background.setCollisionByProperty({ collides: true });

    /*
     * PLAYER CODE
     */
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

    this.player = this.physics.add.sprite(128, 128, "player");
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.physics.add.collider(this.player, background);

    this.anims.create({
      key: "move",
      frames: this.anims.generateFrameNumbers("monster1", { frames: [0, 1] }),
      frameRate: 10,
      repeat: -1,
    });

    this.monster = this.physics.add.sprite(87, 128, "monster1");
    this.monster.play("move");
    this.physics.add.collider(this.monster, background);
  }

  update() {
    this.direction =
      Number(this.cursorKeys.right.isDown) -
      Number(this.cursorKeys.left.isDown);
    if (!this.cursorKeys || !this.player) {
      return;
    }

    if (this.direction !== 0) {
      this.player.flipX = this.direction < 0;
      this.player.anims.play("walk", true);
      this.player.body.velocity.x = this.direction * 100;
    } else {
      this.player.anims.play("idle", true);
      this.player.body.velocity.x = 0;
    }

    // Jump
    if (this.cursorKeys.space.isDown && this.player.body.onFloor()) {
      this.player.setVelocityY(-200);
      this.player.anims.play("jump", true);
    }

    if (this.player.body.y > 256) {
      this.player.body.y = 0;
    }
    // console.log(this.player.body.touching)
    /*
     * ENEMY CODE
     */

    // Move the enemy randomly and change direction if it hits a wall
    if (this.monster.body.onWall()) {
      this.monster_direction *= -1;
      this.monster.flipX = this.monster_direction < 0;
    }

    // destroy the monster if it touches the player
    if (this.monster.body.checkWorldBounds()) {
      console.log("monster is dead");
      this.monster.disableBody(true, true);
    }
    this.monster.body.velocity.x = this.monster_direction * 30;
  }
}
