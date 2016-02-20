requirejs([
    'Config',
    'PhaserGame',
    'states/InitialState'
], function (Config, PhaserGame, InitialState) {
    var config = Config.getConfig();
    var game = new PhaserGame(config.width, config.height, config.containerId);
    game.state.add('InitialState', InitialState);
    game.state.start('InitialState');
});
