define(['Phaser', 'Config'], function (Phaser, Config) {

    var game,
        config,
        spaceship,
        aliens,
        explosions;

    var InitialState = function (_game) {
        game = _game;
        config = Config.getConfig();
    };

    InitialState.prototype = {
        constructor: InitialState,
        preload: preload,
        create: create,
        update: update,
        render: render
    };

    return InitialState;

    /**
     * Preload
     */
    function preload () {
        game.load.image('space', 'img/space.png');
        game.load.image('bullet', 'img/bullet.png');
        game.load.spritesheet('spaceship', 'img/spaceship_animation.png', 64, 90, 4);
        game.load.image('alien', 'img/invader.png');
        game.load.spritesheet('explosion', 'img/explode.png', 128, 128);
        game.time.advancedTiming = true;
    }

    /**
     * Create
     */
    function create () {
        // Create game
        game.world.setBounds(0, 0, config.width, config.height);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.starfield = game.add.tileSprite(0, 0, config.width, config.height, 'space');

        // Create spaceship
        spaceship = new Phaser.Spaceship(game, config.width / 2, config.height - 60, 'spaceship', 0);

        // Create some aliens
        aliens = game.add.group();
        explosions = game.add.group();
        aliens.enableBody = true;

        // Spawn the aliens
        Phaser.Alien.spawnAliensInGame(game, aliens, explosions);
    }

    /**
     * Update.
     */
    function update () {
        // Move the starfield
        game.starfield.tilePosition.y += 0.5;

        // Listen for mouse input and update the spaceship.
        if (game.input.activePointer.isDown && game.input.activePointer.isMouse) {
            var mousePointer = game.input.mousePointer;
            if (game.input.activePointer.button == Phaser.Mouse.RIGHT_BUTTON) {
                spaceship.fireToPointer(mousePointer);
            } else if (game.input.activePointer.button == Phaser.Mouse.LEFT_BUTTON) {
                spaceship.moveToPointer(mousePointer);
            }
        }

        // When a bullet overlaps an alien, kill both sprites.
        game.physics.arcade.overlap(spaceship.bulletsGroup, aliens, function (bullet, alien) {
            bullet.kill();
            alien.destroy();
        }, null, this);
    }

    function render () {
        game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
        game.debug.text(Phaser.VERSION, game.world.width - 55, 14, "#ffff00");
    }
});