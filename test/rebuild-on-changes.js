var chokidar = require('chokidar');
var runAll = require("npm-run-all");
var log = console.log.bind(console);
var rebuildScripts = ["build"];
var clientRebuildScripts = ["babel:client"];


/**
 * Run an npm script in parallel to whatever
 * is already running, so that it does not block
 * anything.
 */
function run(scripts, why) {
  log(`[[CHOKIDAR]] ${why}`);

  runAll(scripts, {
    stdout: process.stdout,
    parallel: false
  })
  .then(() => {
      console.log("done!");
  })
  .catch(err => {
      console.log("failed!", err);
  });
}


function monitor(watcher, scripts) {
  var ready = false;

  // Add event listeners.
  watcher
    .on('add',    path => !ready ? '' : run(scripts, `File ${path} has been added`))
    .on('change', path => !ready ? '' : run(scripts, `File ${path} has been changed`))
    .on('unlink', path => !ready ? '' : run(scripts, `File ${path} has been removed`));

  // More possible events.
  watcher
    .on('addDir', path => !ready ? '' : run(scripts, `Directory ${path} has been added`))
    .on('unlinkDir', path => !ready ? '' : run(scripts, `Directory ${path} has been removed`))
    .on('ready', () => {
      ready = true;
      log('Initial scan complete. Ready for changes');
    })
//    .on('raw', (event, path, details) => {
//      log('Raw event info:', event, path, details);
//    }).
    .on('error', error => log(`Watcher error: ${error}`));
}

/**
 * Watch for code changes
 */
monitor(
  chokidar.watch([ 'src/**/*.js' ], { ignored: [] }),
  rebuildScripts
);

monitor(
  chokidar.watch(['public/js/**/*.jsx'], { ignored: [] }),
  clientRebuildScripts
)
