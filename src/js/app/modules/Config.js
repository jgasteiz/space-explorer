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
                numAliens: 16,
                numSpacehips: 4
            };
        },
        getCharacterConfig: function () {
            return {
                characterName: 'Character',
                speed: 200,
                maxHealth: 100,
                health: 100,
                attackValue: 6,
                strength: 1,
                resistance: 1,
                fireDelay: 400,
                fireSpeed: 900,
                // Flag to determine whether the character is an enemy or not.
                enemy: false,
                // Flag to determine whether the character can be selected or not.
                isSelectable: false,
                // Flag to determine whether the character is selected or not.
                isSelected: false,
                // Active target to determine whether the unit should be attacking or not.
                activeTarget: null,
                // It's important to keep these animations counterclockwise
                // for the `setFrameForRotation` method to work correctly.
                animationFrames: [
                    'up',
                    'leftup',
                    'left',
                    'downleft',
                    'down',
                    'rightdown',
                    'right',
                    'upright'
                ]
            }
        },
        getAlienConfig: function () {
            return {
                characterName: 'Alien',
                isSelectable: false,
                enemy: true,
                speed: 60,
                attackValue: 1
            };
        },
        getSpaceshipConfig: function () {
            return {
                characterName: 'Spaceship',
                isSelectable: true,
                enemy: false,
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
