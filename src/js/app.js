requirejs.config({
    baseUrl: 'js/app',
    paths: {
        Phaser: '../phaser.min'
    }
});

requirejs(['main']);
