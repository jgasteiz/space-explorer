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
        powerUps,
        aliens;

    var StageOne = function (_game) {
        game = _game;
        config = Config.getConfig();
    };

    StageOne.prototype = {
        constructor: StageOne,
        preload: function () {
            game.scale.setGameSize(window.innerWidth, window.innerHeight);
            game.scale.setResizeCallback(function () {
                game.scale.setGameSize(window.innerWidth, window.innerHeight);
            }, game);
        },
        create: function () {
            // Create game
            game.world.setBounds(0, 0, config.worldHeight, config.worldWidth);
            game.physics.startSystem(Phaser.Physics.ARCADE);
            game.starfield = game.add.sprite(0, 0, 'space');

            // Create spaceship
            spaceship = new Phaser.Spaceship(
                game,
                game.rnd.integerInRange(100, config.worldWidth - 100),
                game.rnd.integerInRange(100, config.worldHeight - 100),
                'spaceship',
                0);

            // Create some aliens
            aliens = game.add.group();
            aliens.enableBody = true;

            // Create some power ups
            powerUps = game.add.group();
            powerUps.enableBody = true;

            Utils.spawnPowerUps(game, powerUps, config);

            // Spawn the aliens
            Utils.spawnAliensInGame(game, aliens, config);

            // The camera should follow the spaceship
            game.camera.follow(spaceship);

            // Initialise the collisions module
            collisions = new Collisions(game, aliens, spaceship, powerUps);
        },
        update: function () {
            spaceship.update();
            collisions.update();
        },
        render: function () {
            game.debug.text('FPS: ' + game.time.fps || '--', 12, 40, "#00ff00");
            game.debug.text(
                'Health: ' + spaceship.getHealth(),
                12,
                20,
                Utils.getColourForValue(spaceship.getHealth())
            );
            // game.debug.body(spaceship);
        }
    };

    return StageOne;
});
