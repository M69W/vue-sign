// see http://vuejs-templates.github.io/webpack for documentation.
var path = require("path");
var proxyAddr = {
    // dev: "http://wxdev.i-yin.com.cn", // 开发环境（以后开发走这个）
    // dev: "http://192.168.51.218:6089", //开发环境
    // dev: "http://192.168.51.218:6116", //测试环
    // dev: "http://192.168.51.218:6382", //开发环境
    dev: "http://sign.oa.com", //测试环境
    //  dev: "http://sign.oa.com", //测试环境
    // dev: "http://10.9.2.146:8008", //测试环境
    wsdev: "ws://192.168.51.218:6381", //开发环境ws
    // dev: 'http://192.168.51.218:6245' //开发环境新uc
    // dev: "http://172.31.1.61:10301", //liufeng
    // dev: "http://172.31.1.176:8601", //刘志
    // dev: "http://172.31.1.101:8601", //达剑
    // dev: "http://172.31.1.195:8601",
};
module.exports = {
    build: {
        env: require("./prod.env"),
        index: path.resolve(__dirname, "../dist/index.html"),
        assetsRoot: path.resolve(__dirname, "../dist"),
        assetsSubDirectory: "static",
        assetsPublicPath: "./",
        // productionSourceMap: true,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ["js", "css"],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report,
    },
    dev: {
        env: require("./dev.env"),
        port: 9040,
        autoOpenBrowser: true,
        assetsSubDirectory: "static",
        assetsPublicPath: "/",
        proxyTable: {
            // '/user': {
            //     target: proxyAddr.dev
            // },
            // '/seal': {
            //     target: proxyAddr.dev
            // },
            // '/compact': {
            //     target: proxyAddr.dev
            // },
            "/api": {
                target: proxyAddr.dev,
                secure: false,
                changeOrigin: true,
                ws: true,
                //本地联调
                // pathRewrite: {  //有些有api有些没有，
                //     "^/api": ""
                // }
            },
            "/zuul": {
                target: proxyAddr.dev,
                secure: false,
                changeOrigin: true,
                ws: true,
            },
            "/compact/file/page": {
                target: proxyAddr.dev,
                secure: false,
                changeOrigin: true,
                ws: true,
            },
            "/file/preview": {
                target: proxyAddr.dev,
                secure: false,
                changeOrigin: true,
                ws: true,
            },
            "/compact/auth": {
                target: proxyAddr.dev,
                secure: false,
                changeOrigin: true,
                ws: true,
            },
            "/wsdev": {
                target: proxyAddr.wsdev,
                secure: false,
                changeOrigin: true,
                ws: true,
            },
        },
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false,
        after: require("../mock/mock-server.js"), //模拟数据应用
    },
};
