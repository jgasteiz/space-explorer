define(['Phaser'], function (Phaser) {

    var game;

    var Boot = function (_game) {
        game = _game;
    };

    Boot.prototype = {
        constructor: Boot,
        preload: function () {
            game.add.text(100, 100, 'Loading assets...', {font: '18px Arial', align: 'center', fill: '#00ff00'});

            game.load.image('space', 'img/starcraft-map.png');
            game.load.image('bullet', 'img/bullet.png');
            game.load.image('medkit', 'img/medkit.png');
            game.load.spritesheet('spaceship', 'img/spaceship_animation.png', 50, 70, 4);
            game.load.spritesheet('battlecruiser', 'img/battlecruiser.png', 96, 76, 8);
            game.load.image('alien', 'img/invader.png');
            game.load.spritesheet('death', 'img/explode.png', 128, 128);
            game.load.spritesheet('impact', 'img/impact.png', 32, 32);
            game.time.advancedTiming = true;
        },
        create: function () {

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
                'Right click on enemy to attack'
            ];

            var index = 0,
                yPosition = 120;
            var loadingId = window.setInterval(function () {
                game.add.text(100, yPosition, loadingMessages[index], {font: '18px Arial', align: 'center', fill: '#00ff00'});
                yPosition = yPosition + 20;
                index++;
            }, 500);

            window.setTimeout(function () {
                window.clearInterval(loadingId);
                index = 0;
                window.setInterval(function () {
                    game.add.text(100, yPosition, instructionMessages[index], {font: '18px Arial', align: 'center', fill: '#00ff00'});
                    yPosition = yPosition + 20;
                    index++;
                }, 100);

                window.setTimeout(function () {
                    // Start stage one
                    game.state.start('StageOne');
                }, instructionMessages.length * 100 + 1000);
            }, loadingMessages.length * 500 + 500);
        }
    };

    return Boot;
});
