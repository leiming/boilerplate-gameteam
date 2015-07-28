'use strict';

module.exports = function (karma) {
  karma.set({

    frameworks: ['jasmine', 'browserify'],

    files: [
      'test/**/*Spec.js'
    ],

    // possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
    reporters: ['progress'],

    preprocessors: {
      'src/**/*.js': ['browserify'],
      'test/**/*Spec.js': ['browserify']
    },

    browsers: ['Chrome'],

    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: 'LOG_DEBUG',

    //singleRun: true,
    autoWatch: true,

    // browserify configuration
    browserify: {
      debug    : true,
      extensions: ["js", "hbs"],
      transform: [['hbsfy', {"extensions": "hbs"}], 'brfs', 'browserify-shim']
    }
  });
};
