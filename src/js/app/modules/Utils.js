define(['Phaser'], function (Phaser) {

    return {
        /**
         * Given a value, returns a colour.
         * The higher the value, the more green;
         * The lower the value, the more red.
         * @param value
         * @returns {*}
         */
        getColourForValue: function (value) {
            if (value > 80) {
                return '#00ff00';
            } else if (value > 60) {
                return '#ffe500';
            } else if (value > 40) {
                return '#ffc000';
            } else if (value > 25) {
                return '#ff9e00';
            }
            return '#ff0000';
        },

        /**
         * Return an RGB colour depending on the given value, between green
         * and red for the range 100-0.
         * @param value
         * @returns {*}
         */
        getRgbColourFromValue: function (value) {
            var hexColour = this.getColourForValue(value),
                result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColour);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        /**
         * Return a summary of the selected units.
         * @param selectedUnits
         * @returns {*}
         */
        getSelectedUnitsSummary: function (selectedUnits) {
            return selectedUnits.map(function (item) {
                return item.getCharacterName();
            });
        },

        /**
         * Spawn a number of enemies in the given game.
         * @param game - Phaser.Game instance
         * @param enemiesGroup - Phaser.Group instance
         * @param config - {object}
         * @param numAliens - {Integer}
         */
        spawnAliensInGame: function (game, enemiesGroup, config, numAliens) {
            enemiesGroup.enableBody = true;
            // Spawn `numAliens` number of enemies.
            for (var i = 0; i < numAliens; i++) {
                var enemy = new Phaser.Alien(
                    game,
                    game.rnd.integerInRange(100, config.worldWidth - 100),
                    game.rnd.integerInRange(100, config.worldHeight - 100)
                );

                enemiesGroup.add(enemy);

                // Move the enemy
                enemy.moveAroundWorld();
            }
        },

        /**
         * Spawn powerups randomly.
         * @param game
         * @param config
         * @returns {*}
         */
        spawnPowerUps: function (game, config) {
            var powerUps = game.add.group();
            powerUps.enableBody = true;
            for (var i = 0; i < 5; i++) {
                powerUps.add(new Phaser.PowerUp(
                    game,
                    game.rnd.integerInRange(100, config.worldWidth - 100),
                    game.rnd.integerInRange(100, config.worldHeight - 100),
                    'medkit',
                    Phaser.PowerUp.HEALTH)
                );
            }
            return powerUps;
        },

        Print: {
            log: function (message) {
                window.console.log(message);
            },
            info: function (message) {
                window.console.info(message);
            },
            warn: function (message) {
                window.console.warn(message);
            },
            error: function (message) {
                window.console.error(message);
            }
        }
    };
});
