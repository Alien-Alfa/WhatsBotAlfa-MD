const cluster = require('cluster');
const path = require('path');
const fs = require('fs');

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
        console.log(`[RECEIVED from ${file}]`, data);
        switch (data) {
            case 'reset':
                resetProcess(file);
                break;
            case 'uptime':
                p.send(process.uptime());
                break;
            case 'shutdown':
                shutdown();
                break;
            case 'Kill':
                console.log("Received Kill command, shutting down everything immediately");
                shutdown(true);
                break;
        }
    });

    p.on('exit', (code, signal) => {
        console.error(`Child process for ${file} exited with code: ${code}, signal: ${signal}`);
        if (!workers[file]) {
            console.error(`No process reference found for ${file}`);
            return;
        }

        delete workers[file];

        if (signal !== 'SIGTERM') { // Prevent restarting if killed intentionally
            console.log("Restarting the process immediately");
            start(file);
        }
    });

    workers[file] = p;
}

function resetProcess(file) {
    const worker = workers[file];
    if (worker) {
        worker.kill();
    } else {
        console.error(`No child process running for ${file}`);
    }
}

function BootUp() {
    console.log("Booting Up Sequence Initiated!");
    start("index.js");
}

function shutdown(killAll = false) {
    console.log("Shutting down the server...");
    for (const file in workers) {
        stopProcess(file, killAll);
    }
    if (killAll) {
        console.log("Exiting the main process...");
        process.exit();
    }
}

function stopProcess(file, killAll = false) {
    const worker = workers[file];
    if (worker) {
        if (killAll) {
            worker.kill();
        } else {
            worker.send('shutdown'); // Send shutdown message to the worker
        }
        delete workers[file];
        console.log(`Stopping process for ${file}`);
    } else {
        console.error(`No child process running for ${file}`);
    }
}

async function deleteSession() {
    fs.readdir('session/', (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }

        files.forEach(file => {
            if (file !== 'Aurora.txt') {
                fs.unlink(path.join('session/', file), err => {
                    if (err) {
                        console.error('Error deleting file:', err);
                        return;
                    }
                    console.log(`${file} has been deleted.`);
                });
            }
        });
    });
}

console.log(`==================================================\n                Server Starting...!\n==================================================`);
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;

app.post('/restart', (req, res) => {
    console.log("[Restarting]");
    for (const file in workers) {
        resetProcess(file);
    }
    res.sendStatus(200);
});

app.post('/update', (req, res) => {
    console.log("[Discarding Session]");
    deleteSession();
    res.sendStatus(200);
});

app.post('/shutdown', (req, res) => {
    console.log("[ShutDown]");
    shutdown();
    res.sendStatus(200);
});

app.post('/bootup', (req, res) => {
    console.log("[BootUp]");
    BootUp();
    res.sendStatus(200);
});

app.post('/feksession', (req, res) => {
    console.log("[Discarding Session]");
    res.sendStatus(200);
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'lib/Messages/index.html'));
});

app.listen(port, () => console.log(`cortana Server listening on port http://localhost:${port}`));

start("index.js");
