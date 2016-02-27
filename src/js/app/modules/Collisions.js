define([
    'modules/Config'
], function (Config) {

    function Collisions (game, aliens, spaceship, powerUps) {
        this.game = game;
        this.aliens = aliens;
        this.spaceship = spaceship;
        this.powerUps = powerUps;
    }

    Collisions.prototype.update = function () {
        // When a bullet overlaps an alien, damage the alien.
        this.game.physics.arcade.overlap(this.spaceship.bulletsGroup, this.aliens, function (bullet, alien) {
            if (alien.isAlive()) {
                bullet.kill();
                alien.addDamage(this.spaceship.getAttackValue());
            }
        }, null, this);

        // When an alien overlaps the spaceship, damage the spaceship.
        this.game.physics.arcade.overlap(this.spaceship, this.aliens, function (spaceship, alien) {
            if (alien.isAlive()) {
                spaceship.addDamage(alien.getAttackValue());
            }
        }, null, this);

        // When the spaceship overlaps a powerup, grab it.
        this.game.physics.arcade.overlap(this.spaceship, this.powerUps, function (spaceship, powerUp) {
            spaceship.addPowerUp(powerUp);
            powerUp.kill();
        }, null, this);
    };

    return Collisions;
});
