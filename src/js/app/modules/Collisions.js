define([
    'modules/Config'
], function (Config) {

    function Collisions (game, aliens, spaceship) {
        this.game = game;
        this.aliens = aliens;
        this.spaceship = spaceship;
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
        this.game.physics.arcade.overlap(this.spaceship, this.aliens, function (bullet, alien) {
            if (alien.isAlive()) {
                this.spaceship.addDamage(alien.getAttackValue());
            }
        }, null, this);
    };

    return Collisions;
});