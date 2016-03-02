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
        playerCharacters,
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

            // Create spaceships
            playerCharacters = game.add.physicsGroup();

            // Spawn as many spaceships as it's specified in the config.
            for (var i = 0; i < config.numSpacehips; i++) {
                playerCharacters.add(new Phaser.Spaceship(
                    game,
                    100 * i + 300,
                    200,
                    'battlecruiser',
                    0));
            }

            // TODO: create a `PlayerCharacters` class and implement this there.
            playerCharacters.notifyActiveChildrenOfArrival = function () {
                playerCharacters.forEach(function (child) {
                    child.arriveToDestination(false);
                }, this);
            };
            game.camera.focusOn(playerCharacters.getAt(0));

            // Create some power ups
            powerUps = Utils.spawnPowerUps(game, powerUps, config);

            // Create some aliens
            aliens = Utils.spawnAliensInGame(game, aliens, config);

            // Initialise the Selection module
            selection = new Selection(game, playerCharacters);
            // Initialise the collisions module
            collisions = new Collisions(game, aliens, playerCharacters, powerUps);
            // Initialise the cursors
            cursors = game.input.keyboard.createCursorKeys();
        },
        update: function () {
            playerCharacters.forEach(function (spaceship) {
                spaceship.update();
            }, this);
            collisions.update();

            // Move the camera
            if (cursors.up.isDown) {
                game.camera.y -= 12;
            } else if (cursors.down.isDown) {
                game.camera.y += 12;
            }
            if (cursors.left.isDown) {
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
            game.debug.text('FPS: ' + game.time.fps || '--', 12, 20, "#00ff00");
            game.debug.text('Selected units: ' + Utils.getSelectedUnitsSummary(game.selectedUnits), 12, 40, "#00ff00");
            // Render status of all selected units.
            var healthPosition = 60;
            playerCharacters.forEach(function (spaceship) {
                game.debug.text(
                    'Health: ' + spaceship.getHealth(),
                    12,
                    healthPosition,
                    Utils.getColourForValue(spaceship.getHealth())
                );
                healthPosition += 20;
            }, this);
        }
    };

    return StageOne;
});
