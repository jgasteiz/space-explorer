define(['Phaser', 'Config'], function (Phaser, Config) {

    var game,
        config,
        spaceship;

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
        game.load.image('bullet', 'img/bullet.gif');
        game.load.image('spaceship', 'img/spaceship.png');
        game.load.image('invader', 'img/invader.png');
        game.time.advancedTiming = true;
    }

    /**
     * Create
     */
    function create () {
        // Create game
        game.world.setBounds(0, 0, config.width, config.height);
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.starfield = game.add.tileSprite(0, 0, 800, 600, 'space');

        // Create spaceship
        spaceship = new Phaser.Spaceship(game, config.width / 2, config.height - 60, 'spaceship', 0);
        spaceship.anchor.setTo(0.5);
        game.physics.arcade.enable(spaceship);
        spaceship.body.collideWorldBounds = true;

        // Create some invaders
        var spawnWidth = config.width - 100;
        game.invaders = game.add.group();
        game.invaders.enableBody = true;

        for (var i = 0; i < config.numInvaders; i++) {
            var initialX = i * spawnWidth / config.numInvaders + 50,
                invader = game.invaders.create(initialX + 30, 80, 'invader');

            invader.anchor.setTo(.5, .5);
            game.physics.arcade.enable(invader);
            invader.body.collideWorldBounds = true;
        }
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

        // Update the invaders.
        game.physics.arcade.overlap(spaceship.bulletsGroup, game.invaders, function (bullet, invader) {
            invader.kill();
        }, null, this);
    }

    function render () {
        game.debug.text(game.time.fps || '--', 2, 14, "#00ff00");
        game.debug.text(Phaser.VERSION, game.world.width - 55, 14, "#ffff00");
    }
});