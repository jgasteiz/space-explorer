// (function () {
    var player,
        invaders,
        cursors,
        bulletsGroup,
        bullets = [];

    var config = {
        width: 800,
        height: 600,
        bulletSpeed: 8,
        fireDelay: 300,
        numInvaders: 8
    };

    // Tween for storing the player animation
    var playerTween;
    var playerRotationTween;

    var starfield;

    var game = new Phaser.Game(config.width, config.height, Phaser.WEB_GL, 'container', {
        preload: preload,
        create: create,
        update: update
    });

    /**
     * Preload
     */
    function preload () {
        game.load.image('space', 'img/space_invaders/space.png');
        game.load.image('bullet', 'img/space_invaders/bullet.gif');
        game.load.image('spaceship', 'img/space_invaders/spaceship.png');
        game.load.image('invader', 'img/space_invaders/invader.png');
    }

    /**
     * Create
     */
    function create () {
        createGame();
        createPlayer();
        createBullets();
        createInvaders();

        // Add cursors
        cursors = game.input.keyboard.createCursorKeys();
        cursors.fire = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    }

    /**
     * Initialize the game, ground and platforms.
     */
    function createGame () {
        game.world.setBounds(0, 0, config.width, config.height);
        //We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);

        starfield = game.add.tileSprite(0, 0, 800, 600, 'space');
    }

    /**
     * Initialize the player and its properties
     */
    function createPlayer () {
        player = game.add.sprite(config.width / 2, config.height - 60, 'spaceship');
        player.anchor.setTo(.5,.5);
        game.physics.arcade.enable(player);

        player.body.collideWorldBounds = true;

        game.input.onDown.add(moveSpaceship, this);
    }

    function moveSpaceship(pointer) {
        if (playerTween && playerTween.isRunning) {
            playerTween.stop();
        }

        if (playerRotationTween && playerRotationTween.isRunning) {
            playerRotationTween.stop();
        }

        var duration = (game.physics.arcade.distanceToXY(player, pointer.x, pointer.y) / 300) * 1000;

        playerTween = game.add.tween(player).to({
            x: pointer.x,
            y: pointer.y,
        }, duration, Phaser.Easing.Sinusoidal.InOut, true);

        // Calculate the angle between the two points and the Y axis.
        var angle = (Math.atan2(pointer.y - player.y, pointer.x - player.x) * 180 / Math.PI) + 90

        // If the angle is negative, turn it into 360 based.
        if (angle < 0) {
            angle = 360 + angle;
        }

        // Calculate the angle to rotate.
        var diffAngle = parseInt(angle - player.angle, 10) % 360;

        // If we're going to turn more than 180 degrees, turn anti-clockwise.
        if (diffAngle > 180) {
            diffAngle = -(360 - diffAngle);
        }

        // Format it to a string with either `+` or `-`.
        diffAngle = diffAngle > 0 ? '+' + String(diffAngle) : '-' + String(Math.abs(diffAngle));

        // Rotate the player.
        playerRotationTween = game.add.tween(player).to({angle: diffAngle}, 300, Phaser.Easing.Linear.None, true, 100);
    }

    function createBullets () {
        bulletsGroup = game.add.group();
        bulletsGroup.enableBody = true;
    }

    function createInvaders () {
        var spawnWidth = config.width - 100;

        invaders = game.add.group();
        invaders.enableBody = true;

        for (var i = 0; i < config.numInvaders; i++) {
            var initialX = i * spawnWidth / config.numInvaders + 50,
                invader = invaders.create(initialX + 30, 80, 'invader');

            invader.anchor.setTo(.5, .5);
            game.physics.arcade.enable(invader);
            invader.body.collideWorldBounds = true;
        }
    }

    /**
     * Update.
     */
    function update () {
        starfield.tilePosition.y += 2;

        // Update the bullets position.
        // updateBullets();
        if (cursors.fire.isDown) {
            fire();
        }

        // Update the player position
        updatePlayer();

        // Update the invaders position
        updateInvaders();
    }

    function fire () {
        // bullets.forEach(function(bullet) {
        //     bullet.sprite.y -= config.bulletSpeed;
        // });

        var lastBullet = bullets[bullets.length - 1];
        var lastDate = lastBullet ? lastBullet.date + config.fireDelay : 0;

        if (lastDate < new Date().getTime()) {
            var bullet = bulletsGroup.create(player.position.x, player.position.y, 'bullet');
            bullet.scale.setTo(2, 2);
            bullet.rotation = player.rotation;

            bullets.push({
                sprite: bullet,
                angle: player.angle,
                date: new Date().getTime()
            });

            bullet.body.velocity.x = Math.cos(bullet.rotation + 4.7) * 300;
            bullet.body.velocity.y = Math.sin(bullet.rotation + 4.7) * 300;
        }
    }

    function updatePlayer () {
        player.body.velocity.x = 0;
        if (cursors.left.isDown) {
            player.body.velocity.x = -300;
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 300;
        } else {
            player.animations.stop();
        }
    }

    function updateInvaders () {
        game.physics.arcade.overlap(bulletsGroup, invaders, function (bullet, invader) {
            invader.kill();
        }, null, this);
    }

// })();
