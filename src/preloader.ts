import Phaser from "phaser";
import tileset from "../assets/sprites/sprite.png";
import monster1 from "../assets/sprites/monster1.png";
import player from "../assets/sprites/player.png";
import scene1 from "../assets/tilesets/scene1.json";


export default class Preloader extends Phaser.Scene{
    constructor(){
        super('preloader')
    }

    preload(){
        this.load.image('tileset', tileset);
        this.load.spritesheet('monster1', monster1, {frameWidth: 8, frameHeight: 8});
        this.load.spritesheet('player', player, {frameWidth: 8, frameHeight: 8});
        this.load.tilemapTiledJSON('scene1', scene1);
    }

    create(){
        this.scene.start('game-scene');
    }
}