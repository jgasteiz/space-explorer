requirejs([
    'PhaserGame',
    'states/Boot',
    'states/StageOne',
    'states/StageTwo'
], function (PhaserGame, Boot, StageOne, StageTwo) {
    var game = new PhaserGame();
    game.state.add('Boot', Boot);
    game.state.add('StageOne', StageOne);
    game.state.add('StageTwo', StageTwo);
    game.state.start('Boot');
});
