define([
    'Phaser',
    'states/BaseStage'
], function (Phaser) {

    var StageOne = function (_game) {
        this.stageName = 'stageOne';
        Phaser.BaseStage.call(this, _game);
    };

    StageOne.prototype = Object.create(Phaser.BaseStage.prototype);

    StageOne.prototype = {
        constructor: StageOne,
        preload: Phaser.BaseStage.prototype.preload,
        create: Phaser.BaseStage.prototype.create,
        update: function () {
            Phaser.BaseStage.prototype.update.call(this);

            if (this.aliens.countLiving() === 0) {
                this.game.state.start('StageTwo');
            }
        },
        render: Phaser.BaseStage.prototype.render
    };

    return StageOne;
});
