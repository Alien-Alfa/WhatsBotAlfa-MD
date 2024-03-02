let cluster = require('cluster')
let path = require('path')
let fs = require('fs')
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
  }

const CFonts  = require('cfonts')
setTimeout(async()=>{
  CFonts.say('AURORA', {
    gradient: ['red', 'blue'],
    font: 'block',
    align: 'center',
  })
}, 1000)

console.log("Server Starting...!")
 

const workers = {}; // Store references to child processes

function start(file) {
  // Check if a child process is already running for the specified file
  if (workers[file]) return;

  // Create a child process for the specified file
  const args = [path.join(__dirname, file), ...process.argv.slice(2)];

  cluster.setupMaster({
    exec: path.join(__dirname, file),
    args: args.slice(1),
  });

  const p = cluster.fork();

  // Set up event listeners for the child process
  p.on('message', async (data) => {
    console.log(`[RECEIVED from ${file}]`, "Restart");
      switch (data) {
        case 'reset':
            const worker = workers[file];
            if (worker) {
                worker.kill();
            } else {
                console.error(`No child process running for ${file}`);
            }
            break
        case 'uptime':
            p.send(process.uptime())
            break
    }
  });

  p.on('exit', (code, signal) => {
    console.error(`Child process for ${file} exited with code: ${code}, signal: ${signal}`);
    if (!workers[file]) {
      console.error(`No process reference found for ${file}`);
      return;
    }

    // Remove reference to the child process
    delete workers[file];

    // Restart the child process immediately
	console.log("Restarting the process immediately")
    start(file);
  });

  workers[file] = p; // Store a reference to the child process
}

start("index.js")
