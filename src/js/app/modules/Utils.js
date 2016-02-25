define([], function () {

    return {
        /**
         * Given a value, returns a colour.
         * The higher the value, the more green;
         * The lower the value, the more red.
         * @param value
         * @returns {*}
         */
        getColourForValue: function (value) {
            if (value > 75) {
                return '#0f0';
            } else if (value > 50) {
                return '#ffe500';
            } else if (value > 25) {
                return '#ff9e00';
            }
            return '#f00';
        },

        /**
         * Helper function to return a random set of coordinates based in the world
         * size.
         * @param worldWidth
         * @param worldHeight
         * @returns {{x: number, y: number}}
         */
        getRandomWorldCoordinates: function (worldWidth, worldHeight) {
            return {
                x: 120 + (Math.random() * worldWidth - 120),
                y: 120 + (Math.random() * worldHeight - 120)
            }
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
         * @param group - Phaser.Group instance
         * @param config
         */
        spawnAliensInGame: function (game, group, config) {
            // Spawn `numAliens` number of aliens.
            for (var i = 0; i < config.numAliens; i++) {
                var randomXY = this.getRandomWorldCoordinates(config.worldWidth, config.worldHeight);

                var alien = new Phaser.Alien(game, randomXY.x, randomXY.y, 'alien');

                // If a group was specified, add the alien to the group.
                if (group) {
                    group.add(alien);
                }

                // Move the alien
                alien.moveAroundWorld();
            }
        }
    };
});