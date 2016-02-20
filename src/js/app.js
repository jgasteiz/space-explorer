requirejs.config({
    baseUrl: 'js/app',
    paths: {
        Phaser: '../../vendor/phaser/build/phaser'
    }
});

requirejs(['main']);
