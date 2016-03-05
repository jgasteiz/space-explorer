define([
    'Phaser',
    'states/BaseStage'
], function (Phaser) {

    var StageOne = function (_game) {
        Phaser.BaseStage.call(this, _game);
    };

    StageOne.prototype = Object.create(Phaser.BaseStage.prototype);

    StageOne.prototype = {
        constructor: StageOne,
        preload: function () {
            Phaser.BaseStage.prototype.preload.call(this);
        },
        create: function () {
            Phaser.BaseStage.prototype.create.call(this);

            // Spawn as many spaceships as it's specified in the config.
            for (var i = 0; i < this.game.gameConfig.numSpacehips; i++) {
                this.game.playerCharacters.add(new Phaser.Spaceship(
                    this.game,
                    100 * i + 300,
                    200,
                    'battlecruiser',
                    0));
            }
            this.game.camera.focusOn(this.game.playerCharacters.getAt(0));
        },
        update: function () {
            Phaser.BaseStage.prototype.update.call(this);
        },
        render: function () {
            Phaser.BaseStage.prototype.render.call(this);
        }
    };

    return StageOne;
});
