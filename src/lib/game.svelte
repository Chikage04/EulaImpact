<script>
import { onMount } from 'svelte';
let game;
let Phaser;

onMount(async () => {
  Phaser = await import('phaser');

  // Variables de scène globales
  let player;
  let cursors;
  let skyGroup;
  let groundGroup;

  const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { y: 1500 }, // La gravité pousse les objets vers le bas
        debug: false
      }
    },
    scene: {
      preload,
      create,
      update
    },
    scale: {
      mode: Phaser.Scale.RESIZE, // Ajuste automatiquement la taille du jeu
      autoCenter: Phaser.Scale.CENTER_BOTH
    }
  };

  game = new Phaser.Game(config);
function preload() {
    this.load.image('sky', 'https://media.discordapp.net/attachments/980876597987004446/1265359022748467261/image.png?ex=66a138ec&is=669fe76c&hm=c2537cbca43545b3918bc10fe0c3ff0c63b8869957b9e20b0b489aec9a0c6082&=&format=webp&quality=lossless&width=653&height=643');
    this.load.image('ground', 'https://media.discordapp.net/attachments/980876597987004446/1265319390388424754/Chalk_crookedbullet.png?ex=66a11403&is=669fc283&hm=706f9cf73f67a1229405c4ac738c1c55ce7f60abfc8c50074195823a40a2f4dc&=&format=webp&quality=lossless&width=905&height=905');
    this.load.image('dude', 'https://media.discordapp.net/attachments/980876597987004446/1265271316228079689/jack_head.png?ex=66a18ffd&is=66a03e7d&hm=cc7937218e8440885385e4f5a0603839acf73313e1a2cbd1a496a4a57580803a&=&format=webp&quality=lossless&width=905&height=905');
  }

  function create() {
    // Create groups for the sky and ground tiles
    skyGroup = this.add.group();
    groundGroup = this.physics.add.staticGroup();

    // Add multiple instances of the sky and ground tiles to the groups
    for (let i = 0; i < 30; i++) {
      const sky = this.add.image(i * this.sys.game.config.width, 0, 'sky');
      sky.setOrigin(0, 0);
      sky.setDisplaySize(this.sys.game.config.width, this.sys.game.config.height);
      skyGroup.add(sky);

      const ground = groundGroup.create(i * 1700, this.sys.game.config.height/2, 'ground').setOrigin(0, 0).setScale(2).refreshBody();
      ground.setDisplaySize(1700, this.sys.game.config.height/2);
    }

    player = this.physics.add.sprite(100, this.sys.game.config.height - 1650, 'dude');
    player.setBounce(0.3);
    player.setCollideWorldBounds(false);
    player.setScale(0.4);
    player.body.setSize(32, 48, true);

    this.physics.add.collider(player, groundGroup);

    cursors = this.input.keyboard.createCursorKeys();

    // Set up the camera to follow the player
    this.cameras.main.startFollow(player);
    this.cameras.main.setBounds(0, 0, Number.MAX_SAFE_INTEGER, this.sys.game.config.height);
  }

  function update() {
    if (!player || !cursors) return;

    // Déplacement horizontal
    if (cursors.left.isDown) {
      player.setVelocityX(-1000);
    } else if (cursors.right.isDown) {
      player.setVelocityX(1000); // Réduisez la vitesse à 160 pour voir si cela résout le problème
    } else {
      player.setVelocityX(0);
    }

    // Saut
    if (cursors.up.isDown && player.body.touching.down) {
      player.setVelocityY(-830);
    }

    // Debugging: Afficher la position du joueur
    console.log(`Player position: x=${player.x}, y=${player.y}`);

    // Update the position of the sky and ground tiles based on the player's position
    const tileWidth = 1900;
    const playerTileX = Math.floor(player.x / tileWidth);

    skyGroup.getChildren().forEach((sky) => {
      const skyTileX = Math.floor(sky.x / tileWidth);
      if (skyTileX < playerTileX - 1) {
        sky.x += tileWidth * 1;
      }
    });

    groundGroup.getChildren().forEach((ground) => {
      const groundTileX = Math.floor(ground.x / tileWidth);
      if (groundTileX < playerTileX - 1) {
        ground.x += tileWidth * 1;
      }
    });
  }
});
</script>


<style>
canvas {
  display: block;
  margin: auto;
  background: #000;
}
</style>
