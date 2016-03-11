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
            this.game.gameConfig = this.game.cache.getJSON('gameConfig');

            this.stageConfig = this.game.cache.getJSON(this.stageName);

            this.PlayerCharacterClass = Phaser[this.stageConfig.characterClass];

            // Initialise victory and defeat triggers
            this.victoryTriggers = this.stageConfig.triggers.victory;
            this.defeatTriggers = this.stageConfig.triggers.defeat;
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
            for (var i = 0; i < this.stageConfig.numPlayerCharacters; i++) {
                this.game.playerCharacters.add(new this.PlayerCharacterClass(this.game, 100 * i + 300, 200));
            }
            this.game.camera.focusOn(this.game.playerCharacters.getAt(0));

            // Create some power ups
            this.powerUps = Utils.spawnPowerUps(this.game, this.game.gameConfig);

            // Create some enemis
            this.game.enemies = this.game.add.group();
            Utils.spawnAliensInGame(this.game, this.game.enemies, this.game.gameConfig, this.stageConfig.numEnemies);

            // Initialise the Selection module
            this.selection = new Selection(this.game, this.game.playerCharacters);
            // Initialise the collisions module
            this.collisions = new Collisions(this.game, this.game.enemies, this.game.playerCharacters, this.powerUps);
            // Initialise the cursors
            this.cursors = this.game.input.keyboard.createCursorKeys();
        },
        update: function () {
            if (!this.game.playerCharacters) {
                return;
            }
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

            // Check triggers
            if (this.victoryTriggers) {
                if (this.victoryTriggers.hasOwnProperty('numEnemies')) {
                    if (this.game.enemies.countLiving() === this.victoryTriggers.numEnemies) {
                        this.game.state.start(this.victoryTriggers.nextStage);
                    }
                }
            }
            if (this.defeatTriggers) {
                if (this.defeatTriggers.hasOwnProperty('numPlayerCharacters')) {
                    if (this.game.playerCharacters.countLiving() === this.defeatTriggers.numPlayerCharacters) {
                        this.game.state.start(this.defeatTriggers.nextStage);
                    }
                }
            }
        },
        render: function () {
            this.game.debug.text('FPS: ' + this.game.time.fps || '--', 12, 20, '#00ff00');
            this.game.debug.text('Selected units: ' + Utils.getSelectedUnitsSummary(this.game.selectedUnits), 12, 40, "#00ff00");
            // Render status of all selected units.
            var newLineYPosition = 60;
            this.game.playerCharacters.forEach(function (spaceship) {
                this.game.debug.text(
                    'Health: ' + spaceship.getHealth(),
                    12,
                    newLineYPosition,
                    Utils.getColourForValue(spaceship.getHealth())
                );
                newLineYPosition += 20;
            }, this);

            this.game.debug.text(
                'Enemies: ' + this.game.enemies.countLiving() + ' / ' + this.game.enemies.length,
                12,
                newLineYPosition,
                '#00ff00'
            );
        }
    };

    Phaser.BaseStage = BaseStage;
});
