define([
    'modules/Utils'
], function (Utils) {

    function Collisions (game, aliens, playerCharacters, powerUps) {
        this.game = game;
        this.aliens = aliens;
        this.playerCharacters = playerCharacters;
        this.powerUps = powerUps;
    }

    Collisions.prototype.update = function () {
        // When a bullet overlaps an alien, damage the alien.
        this.playerCharacters.forEach(function(spaceship) {
            this.game.physics.arcade.overlap(spaceship.bulletsGroup, this.aliens, function (bullet, alien) {
                if (alien.isAlive()) {
                    bullet.kill();
                    alien.addDamage(spaceship.getAttackValue());
                }
            }, null, this);
        }, this);

        this.game.physics.arcade.collide(this.playerCharacters, this.playerCharacters);

        // When an alien overlaps the spaceship, damage the spaceship.
        this.game.physics.arcade.overlap(this.playerCharacters, this.aliens, function (spaceship, alien) {
            if (alien.isAlive()) {
                spaceship.addDamage(alien.getAttackValue());
            }
        }, null, this);

        // When the spaceship overlaps a powerup, grab it.
        this.game.physics.arcade.overlap(this.playerCharacters, this.powerUps, function (spaceship, powerUp) {
            spaceship.addPowerUp(powerUp);
            powerUp.kill();
        }, null, this);
    };

    return Collisions;
});
