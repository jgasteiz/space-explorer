define([
    'Phaser',
    'modules/Utils',
    'extensions/Character'
], function (Phaser, Utils) {

    /**
     * Marine constructor method.
     * Initialise the sprite, the bullets and add the sprite to the game.
     * @param game
     * @param x
     * @param y
     * @constructor
     */
    var Marine = function (game, x, y) {
        Phaser.Character.call(this, game, x, y, 'spacemarine');
        Phaser.Character.prototype.initializeConfig.call(this, game.cache.getJSON('config')['spacemarineConfig']);

        this.anchor.setTo(0.5, 0.4);

        // Setup bullets
        this.bullets = [];
        this.bulletsGroup = this.game.add.group();
        this.bulletsGroup.enableBody = true;
        this.bulletsGroup.physicsBodyType = Phaser.Physics.ARCADE;

        // Setup the fire key.
        this.firekey = this.game.input.keyboard.addKey(Phaser.Keyboard.F);

        // Setup animations
        this.animations.add('up-standby', [0]);
        this.animations.add('up', [8, 9]);
        this.animations.add('right-standby', [1]);
        this.animations.add('right', [10, 11]);
        this.animations.add('down-standby', [2]);
        this.animations.add('down', [12, 13]);
        this.animations.add('left-standby', [3]);
        this.animations.add('left', [14, 15]);
        this.animations.add('upright-standby', [4]);
        this.animations.add('upright', [16, 17]);
        this.animations.add('rightdown-standby', [5]);
        this.animations.add('rightdown', [18, 19]);
        this.animations.add('downleft-standby', [6]);
        this.animations.add('downleft', [20, 21]);
        this.animations.add('leftup-standby', [7]);
        this.animations.add('leftup', [22, 23]);

        // Set initial animation and rotation
        this.direction = 'rightdown-standby';
        this.animations.play(this.direction, 0, true);
        this._rotation = 3 * Math.PI / 4;
    };

    Marine.prototype = Object.create(Phaser.Character.prototype);
    Marine.prototype.constructor = Marine;

    /**
     * Fire a bullet towards the given pointer.
     * @param x
     * @param y
     */
    Marine.prototype.attack = function (x, y) {
        if (!this.isAlive()) {
            return;
        }

        var lastBullet = this.bullets[this.bullets.length - 1];
        var lastDate = lastBullet ? lastBullet.date + this.fireDelay : 0;

        if (lastDate < new Date().getTime()) {
            // The bullet should spawn in the front of the spaceship..
            var headPosition = this.getHeadPosition(),
                bullet = this.bulletsGroup.create(headPosition.x, headPosition.y, 'smallbullet');

            bullet.anchor.x = 0.5;
            bullet.anchor.y = 1;
            bullet.outOfBoundsKill = true;
            bullet.checkWorldBounds = true;

            this.bullets.push({
                sprite: bullet,
                date: new Date().getTime()
            });

            bullet.rotation = this.game.physics.arcade.moveToXY(bullet, x, y, this.fireSpeed) + (Math.PI / 2);
            this.game.world.bringToTop(this);
        }
    };

    /**
     * Marine's update method.
     */
    Marine.prototype.update = function () {
        Phaser.Character.prototype.update.call(this);

        if (!this.isAlive()) {
            // TODO: Game over
            return;
        }

        // Fire if the key is pressed and the spaceship is selected.
        if (this.firekey.isDown) {
            if (!this.isSelected) {
                return;
            }
            this.attack(this.game.input.activePointer.worldX, this.game.input.activePointer.worldY);
        }

        this.healthBar.y = Math.floor(this.y - this.height);
    };

    Marine.prototype.playAnimationAndSetDirection = function (direction, withAnimation) {
        // Set the animation frame.
        if (withAnimation) {
            this.animations.play(direction, 5, true);
        } else {
            this.animations.play(direction + '-standby', 0, true);
        }
        this.direction = direction;
    };

    Marine.prototype.onCompleteMovement = function () {
        this.animations.play(this.direction + '-standby', 0, true);
    };

    Phaser.Marine = Marine;
});
