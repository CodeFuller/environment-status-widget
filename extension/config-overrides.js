const path = require('path');

module.exports = {
    paths: function (paths, env) {
        paths.appIndexJs = path.resolve(__dirname, 'src/EnvironmentStatusWidget/environment-status-widget.tsx');
        paths.appHtml = path.resolve(__dirname, 'src/EnvironmentStatusWidget/environment-status-widget.html');
        return paths;
    },
}
