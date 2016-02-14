(function () {
    var platforms,
        player,
        cursors,
        bullets = [],
        ground;

    var mission = {
        src: 'img/metal_slug/mission-1.png',
        width: 8088,
        height: 636
    };

    var config = {
        width: 640,
        height: 480
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
        game.load.image('mission1', mission.src);
        game.load.image('ground', 'img/metal_slug/platform2.png');
        game.load.image('bullet', 'img/metal_slug/bullet.gif');
        game.load.atlasXML('marco', 'img/metal_slug/marco.png', 'img/metal_slug//marco.xml');
    }

    /**
     * Create
     */
    function create () {
        createGame();
        createPlayer();

        // Add cursors
        cursors = game.input.keyboard.createCursorKeys();
        cursors.jump = game.input.keyboard.addKey(Phaser.Keyboard.D);
        cursors.fire = game.input.keyboard.addKey(Phaser.Keyboard.A);
    }

    /**
     * Initialize the game, ground and platforms.
     */
    function createGame () {
        game.world.setBounds(0, 0, mission.width, config.height);
        //We're going to be using physics, so enable the Arcade Physics system
        game.physics.startSystem(Phaser.Physics.ARCADE);
        var bg = game.add.sprite(0, -200, 'mission1');
        bg.scale.setTo(2, 2);

        // Platforms, ground and ledges.
        platforms = game.add.group();
        platforms.enableBody = true;

        ground = platforms.create(0, game.world.height - 60, 'ground');
        ground.width = mission.width;
        ground.body.immovable = true;

        LEDGES.forEach(function(l){
            var ledge = platforms.create(l.x, l.y, 'ground');
            ledge.body.immovable = true;
            ledge.width = l.width;
        });
    }

    /**
     * Initialize the player and its properties
     */
    function createPlayer () {
        player = game.add.sprite(250, game.world.height - 270, 'marco');
        player.anchor.setTo(.5,.5);
        player.scale.setTo(2, 2);
        game.camera.follow(player);
        game.physics.arcade.enable(player);

        player.body.bounce.y = 0.2;
        player.body.gravity.y = 700;
        player.body.collideWorldBounds = true;

        player.animations.add('walk', [0,1,2,3,4,5,6,7,8,9], 10);
        player.animations.add('lookingUp', [13,12,11,10], 10, false);
    }

    /**
     * Update.
     */
    function update () {
        game.physics.arcade.collide(player, platforms);
        //Reset the players velocity (movement)
        player.body.velocity.x = 0;

        // Update the bullets position.
        updateBullets();

        updatePlayer();
    }

    function updateBullets (){
        var position;
        var speed = 10;

        bullets.forEach(function(bullet) {
            if (bullet.direction === 'up') {
                bullet.sprite.y -= speed;
            } else {
                position = bullet.direction === 'right' ? speed : -speed;
                bullet.sprite.position.x += position;
            }
        });

        var now = new Date().getTime();
        var lastBullet = bullets[bullets.length - 1];
        var lastDate = lastBullet ? lastBullet.date + 100 : 0;
        var canFire = lastDate < now;

        if (cursors.fire.isDown && canFire) {
            var x, sprite, y, direction;
            var date = new Date().getTime();

            // If the player is looking up, the bullet spawns in a different place.
            if (cursors.up.isDown) {
                x = player.position.x + (isPlayerLookingForwards() ? 10 : -20);
                y = player.position.y - (player.height / 2);
                direction = 'up';
            } else {
                x = (player.width / 2) + player.position.x;
                y = player.position.y - 5;
                direction = isPlayerLookingForwards() ? 'right' : 'left';
            }

            sprite = game.add.sprite(x, y, 'bullet');
            sprite.scale.setTo(2, 2);

            if (direction === 'left') {
                sprite.scale.x = -1;
            } else if (direction === 'up') {
                sprite.rotation = 4.7;
            }

            bullets.push({
                direction: direction,
                sprite: sprite,
                date: date
            });
        }
    }

    function updatePlayer () {
        //Cursor keys
        if (cursors.left.isDown) {
            //Set left direction
            if (player.scale.x != -2) {
                player.scale.x = -2;
            }
            player.body.velocity.x = -300;
            player.animations.play('walk');
        } else if (cursors.right.isDown) {
            //Set right direction
            if (player.scale.x != 2) {
                player.scale.x = 2;
            }
            player.body.velocity.x = 300;
            player.animations.play('walk');
        } else if (cursors.up.isDown) {
            if (player.animations.currentFrame.index === 10) {
                player.animations.stop('lookingUp');
            } else {
                player.animations.play('lookingUp');
            }
        } else if (cursors.down.isDown) {
            // Look down?
        } else {
            player.animations.stop();
            player.frame = 7;
        }

        //Allow the player to jump if they are touching the ground.
        if (cursors.jump.isDown && player.body.touching.down) {
            player.body.velocity.y = -400;
        }

        //console.log(player.position.x, player.position.y);
    }

    function isPlayerLookingForwards () {
        return player.scale.x > 0;
    }

})();
