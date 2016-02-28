define([
    'Phaser',
    'modules/Config',
    'modules/Print',
    'modules/Utils',
    'modules/Collisions',
    'modules/Selection'
], function (Phaser, Config, Print, Utils, Collisions, Selection) {

    var game,
        config,
        collisions,
        selection,
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
            game.starfield.inputEnabled = true;
            game.selectedUnits = [];

            // Create spaceship
            spaceship = new Phaser.Spaceship(
                game,
                game.rnd.integerInRange(100, config.worldWidth - 100),
                game.rnd.integerInRange(100, config.worldHeight - 100),
                'spaceship',
                0);
            game.camera.focusOn(spaceship);

            // Create some power ups
            powerUps = Utils.spawnPowerUps(game, powerUps, config);

            // Create some aliens
            aliens = Utils.spawnAliensInGame(game, aliens, config);

            // Initialise the Selection module
            selection = new Selection(game, spaceship);
            // Initialise the collisions module
            collisions = new Collisions(game, aliens, spaceship, powerUps);
            // Initialise the cursors
            cursors = game.input.keyboard.createCursorKeys();
        },
        update: function () {
            spaceship.update();
            collisions.update();

            // Move the camera
            if (cursors.up.isDown) {
                game.camera.y -= 12;
            } else if (cursors.down.isDown) {
                game.camera.y += 12;
            } if (cursors.left.isDown) {
                game.camera.x -= 12;
            } else if (cursors.right.isDown) {
                game.camera.x += 12;
            }

            if (game.input.activePointer.position.x > game.width - 70) {
                game.camera.x = game.camera.x + 12;
            } else if (game.input.activePointer.position.x < 70) {
                game.camera.x = game.camera.x - 12;
            }
            if (game.input.activePointer.position.y > game.height - 70) {
                game.camera.y = game.camera.y + 12;
            } else if (game.input.activePointer.position.y < 70) {
                game.camera.y = game.camera.y - 12;
            }
        },
        render: function () {
            game.debug.text(
                'Health: ' + spaceship.getHealth(),
                12,
                20,
                Utils.getColourForValue(spaceship.getHealth())
            );
            game.debug.text('FPS: ' + game.time.fps || '--', 12, 40, "#00ff00");
            game.debug.text('Selected units: ' + Utils.getSelectedUnitsSummary(game.selectedUnits), 12, 60, "#00ff00");
            // game.debug.body(spaceship);
        }
    };

    return StageOne;
});
