module.exports = function (w) {

  return {
    files: [
      {pattern: 'src/**/*.ts', load: false },
      {pattern: 'src/**/*.test.ts', ignore: true}
    ],
    tests: [
      {pattern: 'src/**/*.test.ts', load: true}
    ],
    testFramework: 'mocha',
    env: {
      type: 'node'
    },
    compilers: {
      "**/*.ts": w.compilers.typeScript({ module: 'commonjs' })
    },
    workers: {
      initial: 5,
      regular: 2,
      recycle: false
    },
    setup: function(wallaby) {

      var worker = require(wallaby.projectCacheDir + '/src/wallaby-actions/worker.js');

      var workerManager = require('wallaby-worker-manager');
      
      workerManager.Setup(wallaby, worker.Worker);

    },
    teardown: function(wallaby) {


    }
  };
};
