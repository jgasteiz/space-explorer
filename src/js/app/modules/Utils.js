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

        getRgbColourFromValue: function (value) {
            var hexColour = this.getColourForValue(value),
                result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hexColour);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        },

        getSelectedUnitsSummary: function (selectedUnits) {
            return selectedUnits.map(function (item, whatever, lel, lol) {
                return item.getCharacterName();
            });
        },

        /**
         * Calculate the new angle a sprite needs to have to look at a position x y.
         * @param sprite
         * @param x
         * @param y
         */
        getFinalAngle: function (sprite, x, y) {
            // Calculate the angle between the two points and the Y axis.
            var angle = (Math.atan2(y - sprite.y, x - sprite.x) * 180 / Math.PI) + 90;

            // If the angle is negative, turn it into 360 based.
            if (angle < 0) {
                angle = 360 + angle;
            }

            return angle;
        },

        /**
         * Calculate how much a sprite has to rotate to look at a position x, y.
         * @param sprite
         * @param x
         * @param y
         * @returns {string}
         */
        getRotationAngle: function (sprite, x, y) {
            var angle = this.getFinalAngle(sprite, x, y);

            // Calculate the angle to rotate.
            var rotationAngle = parseInt(angle - sprite.angle, 10) % 360;

            // If we're going to turn more than 180 degrees, turn anti-clockwise.
            if (rotationAngle > 180) {
                rotationAngle = -(360 - rotationAngle);
            }

            // Format it to a string with either `+` or `-`.
            rotationAngle = rotationAngle > 0 ? '+' + String(rotationAngle) : '-' + String(Math.abs(rotationAngle));

            return String(rotationAngle);
        },

        /**
         * Spawn a number of aliens in the given game.
         * @param game - Phaser.Game instance
         * @param config - {object}
         */
        spawnAliensInGame: function (game, config) {
            var aliens = game.add.group();
            aliens.enableBody = true;
            // Spawn `numAliens` number of aliens.
            for (var i = 0; i < config.numAliens; i++) {
                var alien = new Phaser.Alien(
                    game,
                    game.rnd.integerInRange(100, config.worldWidth - 100),
                    game.rnd.integerInRange(100, config.worldHeight - 100)
                );

                aliens.add(alien);

                // Move the alien
                alien.moveAroundWorld();
            }
            return aliens;
        },

        /**
         * Spawn a single Alien that won't move in a given position.
         * This method is mainly for debugging purposes.
         * @param game - Phaser.Game instance
         * @param group - Phaser.Group instance
         * @param x
         * @param y
         */
        spawnSingleStaticAlien: function (game, group, x, y) {
            var aliens = game.add.group();
            aliens.enableBody = true;
            var alien = new Phaser.Alien(
                game,
                x,
                y,
                'alien'
            );
            aliens.add(alien);
            return aliens;
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
