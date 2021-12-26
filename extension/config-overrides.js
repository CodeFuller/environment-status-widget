const path = require('path');

module.exports = {
    paths: function (paths, env) {
        paths.appIndexJs = path.resolve(__dirname, 'src/EnvironmentStatusWidget/EnvironmentStatusWidget.tsx');
        paths.appHtml = path.resolve(__dirname, 'src/EnvironmentStatusWidget/EnvironmentStatusWidget.html');
        return paths;
    },
}
