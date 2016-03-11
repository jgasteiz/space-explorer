define(['Phaser'], function (Phaser) {

    var Boot = function (_game) {
        this.game = _game;
    };

    Boot.prototype = {
        constructor: Boot,
        preload: function () {
            this.game.add.text(100, 100, 'Loading assets...', {font: '18px \'Share Tech Mono\'', align: 'center', fill: '#00ff00'});
            this.game.time.advancedTiming = true;

            // Load sprites
            this.loadSprites();

            // Load json configs
            this.loadJsonConfigs();
        },
        create: function () {
            var index = 0,
                yPosition = 120,
                _this = this;

            var loadingMessages = [
                'Assets loaded',
                'Destroying Earth...',
                'Rebuilding Earth...',
                'Advancing technology...',
                'Randomizing AI...',
                'Advancing time...',
                'Randomizing technology...'
            ];

            var instructionMessages = [
                'Left click for selecting units',
                'Right click on world to move',
                'Right click on enemy to attack',
                'Click now to start the game'
            ];

            this.loadingId = window.setInterval(function () {
                _this.game.add.text(100, yPosition, loadingMessages[index], {font: '18px \'Share Tech Mono\'', align: 'center', fill: '#00ff00'});
                yPosition = yPosition + 20;
                index++;
            }, 500);

            this.instructionsTimeoutId = window.setTimeout(function () {
                window.clearInterval(_this.loadingId);
                index = 0;
                yPosition = yPosition + 80;
                _this.instructionsId = window.setInterval(function () {
                    _this.game.add.text(100, yPosition, instructionMessages[index], {font: '24px \'Share Tech Mono\'', align: 'center', fill: '#00ff00'});
                    yPosition = yPosition + 26;
                    index++;
                }, 100);
            }, loadingMessages.length * 500 + 500);

            window.setTimeout(function () {
                window.clearInterval(_this.instructionsId);
            }, loadingMessages.length * 500 + 500 + instructionMessages * 100);
        },
        update: function () {
            if (this.game.input.activePointer.isDown) {
                window.clearInterval(this.loadingId);
                window.clearTimeout(this.instructionsTimeoutId);
                window.clearInterval(this.instructionsId);

                // Start stage one
                this.game.state.start('StageOne');
            }
        },
        loadSprites: function () {
            this.game.load.image('space', 'img/starcraft-map.png');
            this.game.load.image('bullet', 'img/bullet.png');
            this.game.load.image('smallbullet', 'img/small-bullet.png');
            this.game.load.image('medkit', 'img/medkit.png');
            this.game.load.spritesheet('marine', 'img/spacemarine.png', 26, 27, 24);
            this.game.load.spritesheet('spaceship', 'img/battlecruiser.png', 96, 76, 8);
            this.game.load.image('alien', 'img/invader.png');
            this.game.load.spritesheet('death', 'img/explode.png', 128, 128);
            this.game.load.spritesheet('impact', 'img/impact.png', 32, 32);
        },
        loadJsonConfigs: function () {
            // Game config
            this.game.load.json('gameConfig', 'config/gameConfig.json');

            // Character and character extensions
            this.game.load.json('character', 'config/character.json');
            this.game.load.json('alien', 'config/alien.json');
            this.game.load.json('spaceship', 'config/spaceship.json');
            this.game.load.json('marine', 'config/marine.json');

            // Other sprite extensions
            this.game.load.json('powerups', 'config/powerups.json');

            // Stages
            this.game.load.json('stageOne', 'config/stageOne.json');
            this.game.load.json('stageTwo', 'config/stageTwo.json');
        }
    };

    return Boot;
});
