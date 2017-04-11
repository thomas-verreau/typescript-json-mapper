
module.exports = function (config) {

    config.set({

        basePath: '.',

        files: [
            "./src/**/*.ts"
        ],

        autoWatch: true,

        frameworks: ["jasmine", "karma-typescript"],

        browsers: ["Chrome", "Firefox"],

        plugins: [
            "karma-chrome-launcher",
            "karma-firefox-launcher",
            "karma-jasmine",
            "karma-typescript"
        ],

        junitReporter: {
            outputFile: "test_out/unit.xml",
            suite: 'unit'
        },

        preprocessors: {
            '**/*.ts': ['karma-typescript']
        }

    });

};