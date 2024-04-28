// Created and Modified by AlienAlfa
let cluster = require('cluster')
let path = require('path')
let fs = require('fs')
const { UpdateLocal } = require("./lib")


console.log("Server Starting...!")


const workers = {};

function start(file) {
    if (workers[file]) return;
    const args = [path.join(__dirname, file), ...process.argv.slice(2)];

    cluster.setupMaster({
        exec: path.join(__dirname, file),
        args: args.slice(1),
    });

    const p = cluster.fork();
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

        delete workers[file];

        console.log("Restarting the process immediately")
        start(file);
    });

    workers[file] = p;
}

start("index.js")


const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
app.post('/restart', (req, res) => {
  console.log("[Restarting]");
  process.send('reset');
    res.sendStatus(200); 
});
app.post('/update', (req, res) => {
    console.log("[Updating]");
    UpdateLocal()
      res.sendStatus(200); 
  });
app.get('/', (req, res) => { res.sendFile(path.join(__dirname, 'lib/BASE/index.html')); });
app.listen(port, () => console.log(`cortana Server listening on port http://localhost:${port}`));