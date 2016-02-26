define(function () {
    return {
        getConfig: function () {
            return {
                debug: true,
                containerId: 'container',
                width: 980,
                height: 720,
                worldHeight: 2048,
                worldWidth: 2048,
                bulletSpeed: 8,
                numAliens: 16
            };
        },
        getCharacterConfig: function () {
            return {
                speed: 200,
                maxHealth: 100,
                health: 100,
                attackValue: 20,
                strength: 1,
                resistance: 1,
                fireDelay: 100,
                fireSpeed: 600
            }
        },
        getAlienConfig: function () {
            return {
                speed: 60,
                attackValue: 1
            };
        },
        getSpaceshipConfig: function () {
            return {
                speed: 300,
                strength: 1.2
            };
        },
        getPowerUps: function () {
            return {
                health: 100,
                radioactive: -25
            }
        },
        getPowerUpValue: function (powerUpType) {
            return this.getPowerUps()[powerUpType];
        }
    };
});