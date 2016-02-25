define([
    'modules/Config'
], function (Config) {

    var config = Config.getConfig();

    return {
        log: function (message) {
            if (config.debug) {
                window.console.log(message);
            }
        },
        info: function (message) {
            if (config.debug) {
                window.console.info(message);
            }
        },
        warn: function (message) {
            if (config.debug) {
                window.console.warn(message);
            }
        },
        error: function (message) {
            if (config.debug) {
                window.console.error(message);
            }
        }
    };
});