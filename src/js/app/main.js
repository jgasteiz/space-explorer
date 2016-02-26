requirejs([
    'modules/Config',
    'PhaserGame',
    'states/Boot',
    'states/StageOne'
], function (Config, PhaserGame, Boot, StageOne) {
    var game = new PhaserGame();
    game.state.add('Boot', Boot);
    game.state.add('StageOne', StageOne);
    game.state.start('Boot');
});
