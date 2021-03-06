define(['Phaser'], function (Phaser) {
    function Selection (game, playerCharacters) {
        var isSelecting = false,
            rectangle;

        game.starfield.events.onInputDown.add(function (sprite, pointer) {
            if (pointer.button === Phaser.Mouse.RIGHT_BUTTON) {
                return;
            }
            playerCharacters.forEach(function(spaceship) {
                spaceship.deselectCharacter();
            }, this);
            game.selectedUnits = [];

            isSelecting = true;

            var bmd = game.add.bitmapData(1, 1);
            bmd.ctx.beginPath();
            bmd.ctx.rect(0, 0, 1, 1);
            bmd.ctx.fillStyle = 'rgba(0, 255, 0, 0.3)';
            bmd.ctx.fill();
            rectangle = game.add.sprite(pointer.worldX, pointer.worldY, bmd);
            game.physics.arcade.enable(this);
            game.world.bringToTop(rectangle);
        });

        game.input.addMoveCallback(function (pointer) {
            if (isSelecting) {
                rectangle.width = pointer.worldX - rectangle.position.x;
                rectangle.height = pointer.worldY - rectangle.position.y;
            }
        });

        game.starfield.events.onInputUp.add(function (sprite, pointer) {
            if (pointer.button === Phaser.Mouse.RIGHT_BUTTON) {
                return;
            }
            isSelecting = false;

            // Select all the things within the rectangle.
            var rectangleAreaX = rectangle.position.x,
                rectangleAreaY = rectangle.position.y;
            if (rectangle.width < 0) {
                rectangleAreaX = rectangle.position.x + rectangle.width;
            }
            if (rectangle.height < 0) {
                rectangleAreaY = rectangle.position.y + rectangle.height;
            }
            var rectangleArea = new Phaser.Rectangle(rectangleAreaX, rectangleAreaY, Math.abs(rectangle.width), Math.abs(rectangle.height));

            playerCharacters.forEach(function(spaceship) {
                if (rectangleArea.contains(spaceship.position.x, spaceship.position.y)) {
                    spaceship.selectCharacter();
                    game.selectedUnits.push(spaceship);
                }
            }, this);

            rectangle.kill();
        });
    }

    return Selection;
});
