define(function () {
    return {
        getConfig: function () {
            return {
                debug: true,
                containerId: 'container',
                width: 980,
                height: 720,
                worldHeight: 2048,
                worldWidth: 2048,
                bulletSpeed: 8,
                fireDelay: 400,
                fireSpeed: 600,
                numAliens: 6
            }
        }
    };
});