import Phaser from "phaser";
import './Player';
import Player from "./Player";

import Monster from "./Monster";

export default class GameScene extends Phaser.Scene {
  private player!: Player;
  private monsters!: Phaser.Physics.Arcade.Group;
  private cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys;
  private container!: Phaser.GameObjects.Container;


  private lastMonsterTime = 0;
  constructor() {
    super("game-scene");
  }

  preload() {
    this.cursorKeys = this.input.keyboard.createCursorKeys();
  }

  create() {
    const map = this.make.tilemap({ key: "scene1" });
    const tileset = map.addTilesetImage("world", "tileset");

    map.createLayer("foreground", tileset, 0, 0);
    const background = map.createLayer("background", tileset, 0, 0);
    background.setCollisionByProperty({ collides: true });

    /*
     * PLAYER CODE
     */
    this.player = this.add.player(32, 32, "player");
    this.player.create();
    this.physics.add.collider(this.player, background);

    this.monsters = this.physics.add.group({classType: Monster, runChildUpdate: true});
    this.physics.add.collider(this.monsters, background);
    this.container = this.add.container(this.player.body.x, this.player.body.y)
    
  }


  update() {
    // Move the enemy randomly and change direction if it hits a wall
    this.player.update(this.cursorKeys);

    // Spawn monster every 5 seconds
    if (this.time.now > this.lastMonsterTime + 1000) {
      const monster = this.monsters.get() as Monster;
      monster.create();
      this.lastMonsterTime = this.time.now;
      console.log("spawned monster", this.monsters.getChildren());
    }

    // Check if player is touching monster
    this.monsters.getChildren().forEach(monster => {
      if(monster){
        if (this.physics.overlap(this.player, monster)) {
          // monster.destroy();
          monster.y = this.player.body.y-4
          monster.x = this.player.body.x + 3
          monster.body.velocity.x = 0
          monster.body.velocity.y = 0
          monster.flipY = true
        }else{
          monster.flipY = false
        }
      }
    });
  }
}
