define([
    'Phaser',
    'modules/Utils',
    'states/BaseStage'
], function (Phaser, Utils) {

    var StageOne = function (_game) {
        Phaser.BaseStage.call(this, _game);
    };

    StageOne.prototype = Object.create(Phaser.BaseStage.prototype);

    StageOne.prototype = {
        constructor: StageOne,
        preload: function () {
            Phaser.BaseStage.prototype.preload.call(this);
            this.stageConfig = this.game.cache.getJSON('config')['stageConfig']['stageOne'];
        },
        create: function () {
            Phaser.BaseStage.prototype.create.call(this);

            // Spawn as many spaceships as it's specified in the config.
            for (var i = 0; i < this.stageConfig.numSpaceships; i++) {
                this.game.playerCharacters.add(new Phaser.Spaceship(this.game, 100 * i + 300, 200));
            }
            this.game.camera.focusOn(this.game.playerCharacters.getAt(0));
        },
        update: function () {
            Phaser.BaseStage.prototype.update.call(this);

            if (!this.aliens.getFirstAlive()) {
                this.game.state.start('StageTwo');
            }
        },
        render: function () {
            Phaser.BaseStage.prototype.render.call(this);
        }
    };

    return StageOne;
});
