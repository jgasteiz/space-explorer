define([
    'Phaser',
    'modules/Utils',
    'states/BaseStage'
], function (Phaser, Utils) {

    var StageTwo = function (_game) {
        Phaser.BaseStage.call(this, _game);
    };

    StageTwo.prototype = Object.create(Phaser.BaseStage.prototype);

    StageTwo.prototype = {
        constructor: StageTwo,
        preload: function () {
            Phaser.BaseStage.prototype.preload.call(this);
            this.stageConfig = this.game.cache.getJSON('config')['stageConfig']['stageTwo'];
        },
        create: function () {
            Phaser.BaseStage.prototype.create.call(this);

            // Spawn a Marine
            this.game.playerCharacters.add(new Phaser.Marine(this.game, 100, 200));
            this.game.camera.focusOn(this.game.playerCharacters.getAt(0));
        },
        update: function () {
            Phaser.BaseStage.prototype.update.call(this);
        },
        render: function () {
            Phaser.BaseStage.prototype.render.call(this);
        }
    };

    return StageTwo;
});
