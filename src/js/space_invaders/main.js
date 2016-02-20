window.SI = window.SI || {};

(function () {

    function initialize () {
        SI.config = {
            width: 800,
            height: 600,
            bulletSpeed: 8,
            fireDelay: 300,
            numInvaders: 8
        };

        SI.game = new Phaser.Game(SI.config.width, SI.config.height, Phaser.AUTO, 'container', {
            preload: preload,
            create: create,
            update: update,
            render: render
        });
    }

    initialize();

    /**
     * Preload
     */
    function preload () {
        SI.game.load.image('space', 'img/space_invaders/space.png');
        SI.game.load.image('bullet', 'img/space_invaders/bullet.gif');
        SI.game.load.image('spaceship', 'img/space_invaders/spaceship.png');
        SI.game.load.image('invader', 'img/space_invaders/invader.png');
        SI.game.time.advancedTiming = true;
    }

    /**
     * Create
     */
    function create () {
        // Create game
        SI.game.world.setBounds(0, 0, SI.config.width, SI.config.height);
        SI.game.physics.startSystem(Phaser.Physics.ARCADE);
        SI.game.starfield = SI.game.add.tileSprite(0, 0, 800, 600, 'space');

        // Create spaceship
        SI.spaceship = SI.game.add.sprite(SI.config.width / 2, SI.config.height - 60, 'spaceship');
        SI.spaceship.anchor.setTo(0.5);
        SI.game.physics.arcade.enable(SI.spaceship);
        SI.spaceship.body.collideWorldBounds = true;
        SI.spaceship.initializeSpaceship();

        // Create some invaders
        var spawnWidth = SI.config.width - 100;
        SI.game.invaders = SI.game.add.group();
        SI.game.invaders.enableBody = true;
        for (var i = 0; i < SI.config.numInvaders; i++) {
            var initialX = i * spawnWidth / SI.config.numInvaders + 50,
                invader = SI.game.invaders.create(initialX + 30, 80, 'invader');

            invader.anchor.setTo(.5, .5);
            SI.game.physics.arcade.enable(invader);
            invader.body.collideWorldBounds = true;
        }
    }

    /**
     * Update.
     */
    function update () {
        // Move the starfield
        SI.game.starfield.tilePosition.y += 0.5;

        // Listen for mouse input and update the spaceship.
        if (SI.game.input.activePointer.isDown && SI.game.input.activePointer.isMouse) {
            var mousePointer = SI.game.input.mousePointer;
            if (SI.game.input.activePointer.button == Phaser.Mouse.RIGHT_BUTTON) {
                SI.spaceship.fireToPointer(mousePointer);
            } else if (SI.game.input.activePointer.button == Phaser.Mouse.LEFT_BUTTON) {
                SI.spaceship.moveToPointer(mousePointer);
            }
        }

        // Update the invaders.
        SI.game.physics.arcade.overlap(SI.spaceship.bulletsGroup, SI.game.invaders, function (bullet, invader) {
            invader.kill();
        }, null, this);
    }

    function render () {
        SI.game.debug.text(SI.game.time.fps || '--', 2, 14, "#00ff00");
        SI.game.debug.text(Phaser.VERSION, SI.game.world.width - 55, 14, "#ffff00");
    }

})();
