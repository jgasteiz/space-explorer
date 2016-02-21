requirejs([
    'utils/Config',
    'PhaserGame',
    'states/InitialState'
], function (Config, PhaserGame, InitialState) {
    var game = new PhaserGame();
    game.state.add('InitialState', InitialState);
    game.state.start('InitialState');
});
