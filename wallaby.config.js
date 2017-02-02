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

      var config = {
        app_db_host: 'localhost',
        app_db_name: 'app',
        app_db_user: 'appuser',
        app_db_password: 'apppass'
      }

      require(wallaby.projectCacheDir + '/src/test/wallaby-setup.js').Setup(wallaby, config);  

    },
    teardown: function(wallaby) {


    }
  };
};
