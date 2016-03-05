requirejs([
    'PhaserGame',
    'states/Boot',
    'states/StageOne'
], function (PhaserGame, Boot, StageOne) {
    var game = new PhaserGame();
    game.state.add('Boot', Boot);
    game.state.add('StageOne', StageOne);
    game.state.start('Boot');
});
