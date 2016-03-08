define(['Phaser'], function (Phaser) {

    var game,
        loadingId,
        instructionsTimeoutId,
        instructionsId;

    var Boot = function (_game) {
        game = _game;
    };

    Boot.prototype = {
        constructor: Boot,
        preload: function () {
            game.add.text(100, 100, 'Loading assets...', {font: '18px \'Share Tech Mono\'', align: 'center', fill: '#00ff00'});

            game.load.image('space', 'img/starcraft-map.png');
            game.load.image('bullet', 'img/bullet.png');
            game.load.image('smallbullet', 'img/small-bullet.png');
            game.load.image('medkit', 'img/medkit.png');
            game.load.spritesheet('spaceship', 'img/spaceship_animation.png', 50, 70, 4);
            game.load.spritesheet('spacemarine', 'img/spacemarine.png', 26, 27, 24);
            game.load.spritesheet('battlecruiser', 'img/battlecruiser.png', 96, 76, 8);
            game.load.image('alien', 'img/invader.png');
            game.load.spritesheet('death', 'img/explode.png', 128, 128);
            game.load.spritesheet('impact', 'img/impact.png', 32, 32);

            game.load.json('config', 'json/config.json');

            game.time.advancedTiming = true;

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

            var index = 0,
                yPosition = 120;

            loadingId = window.setInterval(function () {
                game.add.text(100, yPosition, loadingMessages[index], {font: '18px \'Share Tech Mono\'', align: 'center', fill: '#00ff00'});
                yPosition = yPosition + 20;
                index++;
            }, 500);

            instructionsTimeoutId = window.setTimeout(function () {
                window.clearInterval(loadingId);
                index = 0;
                yPosition = yPosition + 80;
                instructionsId = window.setInterval(function () {
                    game.add.text(100, yPosition, instructionMessages[index], {font: '24px \'Share Tech Mono\'', align: 'center', fill: '#00ff00'});
                    yPosition = yPosition + 26;
                    index++;
                }, 100);
            }, loadingMessages.length * 500 + 500);

            window.setTimeout(function () {
                window.clearInterval(instructionsId);
            }, loadingMessages.length * 500 + 500 + instructionMessages * 100);
        },
        update: function () {
            if (game.input.activePointer.isDown) {
                window.clearInterval(loadingId);
                window.clearTimeout(instructionsTimeoutId);
                window.clearInterval(instructionsId);

                // Start stage one
                game.state.start('StageOne');
                //game.state.start('StageTwo');
            }
        }
    };

    return Boot;
});
