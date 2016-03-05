define([
    'Phaser',
    'modules/Utils',
    'modules/Collisions',
    'modules/Selection'
], function (Phaser, Utils, Collisions, Selection) {

    var BaseStage = function () {};

    BaseStage.prototype = {
        constructor: BaseStage,
        preload: function () {
            this.game.scale.setGameSize(window.innerWidth, window.innerHeight);
            this.game.scale.setResizeCallback(function () {
                this.game.scale.setGameSize(window.innerWidth, window.innerHeight);
            }, this);
            this.game.gameConfig = this.game.cache.getJSON('config')['gameConfig'];
        },
        create: function () {
            // Create game
            this.game.world.setBounds(0, 0, this.game.gameConfig.worldHeight, this.game.gameConfig.worldWidth);
            this.game.physics.startSystem(Phaser.Physics.ARCADE);
            this.game.starfield = this.game.add.sprite(0, 0, 'space');
            this.game.starfield.inputEnabled = true;
            this.game.selectedUnits = [];

            // Create playerCharacters group
            this.game.playerCharacters = this.game.add.physicsGroup();

            // TODO: create a `PlayerCharacters` class and implement this there.
            var _this = this;
            this.game.playerCharacters.notifyActiveChildrenOfArrival = function () {
                _this.game.playerCharacters.forEach(function (child) {
                    child.arriveToDestination(false);
                }, _this);
            };

            // Create some power ups
            this.powerUps = Utils.spawnPowerUps(this.game, this.game.gameConfig);

            // Create some aliens
            this.aliens = Utils.spawnAliensInGame(this.game, this.game.gameConfig);

            // Initialise the Selection module
            this.selection = new Selection(this.game, this.game.playerCharacters);
            // Initialise the collisions module
            this.collisions = new Collisions(this.game, this.aliens, this.game.playerCharacters, this.powerUps);
            // Initialise the cursors
            this.cursors = this.game.input.keyboard.createCursorKeys();
        },
        update: function () {
            this.game.playerCharacters.forEach(function (spaceship) {
                spaceship.update();
            }, this);

            // Update the collisions
            this.collisions.update();

            // Move the camera
            if (this.cursors.up.isDown) {
                this.game.camera.y -= 12;
            } else if (this.cursors.down.isDown) {
                this.game.camera.y += 12;
            }
            if (this.cursors.left.isDown) {
                this.game.camera.x -= 12;
            } else if (this.cursors.right.isDown) {
                this.game.camera.x += 12;
            }

            if (this.game.input.activePointer.position.x > this.game.width - 70) {
                this.game.camera.x = this.game.camera.x + 12;
            } else if (this.game.input.activePointer.position.x < 70) {
                this.game.camera.x = this.game.camera.x - 12;
            }
            if (this.game.input.activePointer.position.y > this.game.height - 70) {
                this.game.camera.y = this.game.camera.y + 12;
            } else if (this.game.input.activePointer.position.y < 70) {
                this.game.camera.y = this.game.camera.y - 12;
            }
        },
        render: function () {
            this.game.debug.text('FPS: ' + this.game.time.fps || '--', 12, 20, "#00ff00");
            this.game.debug.text('Selected units: ' + Utils.getSelectedUnitsSummary(this.game.selectedUnits), 12, 40, "#00ff00");
            // Render status of all selected units.
            var healthPosition = 60;
            this.game.playerCharacters.forEach(function (spaceship) {
                this.game.debug.text(
                    'Health: ' + spaceship.getHealth(),
                    12,
                    healthPosition,
                    Utils.getColourForValue(spaceship.getHealth())
                );
                healthPosition += 20;
            }, this);
        }
    };

    Phaser.BaseStage = BaseStage;
});
