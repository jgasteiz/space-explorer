define([
    'Phaser',
    'states/BaseStage'
], function (Phaser) {

    var StageTwo = function (_game) {
        this.stageName = 'stageTwo';
        Phaser.BaseStage.call(this, _game);
    };

    StageTwo.prototype = Object.create(Phaser.BaseStage.prototype);

    StageTwo.prototype = {
        constructor: StageTwo,
        preload: Phaser.BaseStage.prototype.preload,
        create: Phaser.BaseStage.prototype.create,
        update: Phaser.BaseStage.prototype.update,
        render: Phaser.BaseStage.prototype.render
    };

    return StageTwo;
});
