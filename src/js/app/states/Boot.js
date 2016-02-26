define([], function () {

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
            game.load.image('alien', 'img/invader.png');
            game.load.spritesheet('death', 'img/explode.png', 128, 128);
            game.load.spritesheet('impact', 'img/impact.png', 32, 32);
            game.time.advancedTiming = true;
        },
        create: function () {
            // Start stage one
            game.state.start('StageOne');
        }
    };

    return Boot;
});
