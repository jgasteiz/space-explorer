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
        update: Phaser.BaseStage.prototype.update,
        render: Phaser.BaseStage.prototype.render
    };

    return StageOne;
});
