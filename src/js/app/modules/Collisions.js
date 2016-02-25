define([
    'modules/Config'
], function (Config) {

    function Collisions (game, aliens, spaceship) {
        this.game = game;
        this.aliens = aliens;
        this.spaceship = spaceship;
    }

    Collisions.prototype.update = function () {
        var self = this;

        // When a bullet overlaps an alien, kill both sprites.
        self.game.physics.arcade.overlap(self.spaceship.bulletsGroup, self.aliens, function (bullet, alien) {
            if (alien.alive) {
                bullet.kill();
                alien.loseHealth(25);
            }
        }, null, this);
    };

    return Collisions;
});