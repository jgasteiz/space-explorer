(function () {
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

    var game = new Phaser.Game(config.width, config.height, Phaser.AUTO, '', {
        preload: preload,
        create: create,
        update: update
    });

    /**
     * Preload
     */
    function preload () {
        game.load.image('bullet', 'img/metal_slug/bullet.gif');
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
    }

    /**
     * Initialize the player and its properties
     */
    function createPlayer () {
        player = game.add.sprite(config.width / 2, config.height - 60, 'spaceship');
        player.anchor.setTo(.5,.5);
        game.physics.arcade.enable(player);

        player.body.collideWorldBounds = true;
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
        //game.physics.arcade.collide(player, platforms);

        // Update the bullets position.
        updateBullets();

        // Update the player position
        updatePlayer();

        // Update the invaders position
        updateInvaders();
    }

    function updateBullets (){
        bullets.forEach(function(bullet) {
            bullet.sprite.y -= config.bulletSpeed;
        });

        var now = new Date().getTime();
        var lastBullet = bullets[bullets.length - 1];
        var lastDate = lastBullet ? lastBullet.date + config.fireDelay : 0;
        var canFire = lastDate < now;

        if (cursors.fire.isDown && canFire) {
            var bullet = bulletsGroup.create(player.position.x, player.position.y - (player.height / 2), 'bullet');
            bullet.scale.setTo(2, 2);
            bullet.rotation = 4.7;

            bullets.push({
                sprite: bullet,
                date: new Date().getTime()
            });
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

})();
