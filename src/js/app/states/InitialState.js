define([
    'Phaser',
    'modules/Config',
    'modules/Print',
    'modules/Utils',
    'modules/Collisions'
], function (Phaser, Config, Print, Utils, Collisions) {

    var game,
        config,
        collisions,
        spaceship,
        aliens;

    var InitialState = function (_game) {
        game = _game;
        config = Config.getConfig();
    };

    InitialState.prototype = {
        constructor: InitialState,
        preload: function () {
            game.load.image('space', 'img/starcraft-map.png');
            game.load.image('bullet', 'img/bullet.png');
            game.load.spritesheet('spaceship', 'img/spaceship_animation.png', 50, 70, 4);
            game.load.image('alien', 'img/invader.png');
            game.load.spritesheet('death', 'img/explode.png', 128, 128);
            game.time.advancedTiming = true;
        },
        create: function () {
            // Create game
            game.world.setBounds(0, 0, config.worldHeight, config.worldWidth);
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.starfield = game.add.sprite(0, 0, 'space');

            // Create spaceship
            spaceship = new Phaser.Spaceship(game, config.width / 2, config.height - 60, 'spaceship', 0);

            // Create some aliens
            aliens = game.add.group();
            aliens.enableBody = true;

            // Spawn the aliens
            Utils.spawnAliensInGame(game, aliens, config);

            // The camera should follow the spaceship
            game.camera.follow(spaceship);

            // Initialise the collisions module
            collisions = new Collisions(game, aliens, spaceship);
        },
        update: function () {
            if (!spaceship.isAlive()) {
                // TODO: Game over
                return;
            }

            spaceship.update();
            collisions.update();
        },
        render: function () {
            game.debug.text(game.time.fps || '--', config.width - 24, 14, "#00ff00");
            game.debug.text('Health: ' + spaceship.health, 12, 20, "#00ff00");
            // game.debug.body(spaceship);
        }
    };

    return InitialState;
});
