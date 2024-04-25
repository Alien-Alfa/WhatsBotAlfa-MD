// Created and Modified by AlienAlfa
let cluster = require('cluster')
let path = require('path')
let fs = require('fs')


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
let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Reset Button</title>
<style>
  body {
    font-family: Arial, sans-serif;
    background-color: #000000;
    margin: 0;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
  }

  button {
    padding: 10px 20px;
    font-size: 16px;
    background-color: #00ff1e;
    color: rgb(0, 0, 0);
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  button:hover {
    background-color: #00f7ff;
  }
</style>
</head>
<body>

    <button id="resetButton">Reset</button>
    <button id="updateButton">Update</button>

<script>
  // Add event listener to the button
  document.getElementById('resetButton').addEventListener('click', function() {
    // Send 'reset' action to the parent process
    if (typeof process !== 'undefined' && process.send) {
      process.send('reset');
    } else {
      console.error('Process is not defined.');
    }
  });
</script>

</body>
</html>
`
app.get("/", (req, res) => {res.send(html);});
app.listen(port, () => console.log(`cortana Server listening on port http://localhost:${port}`));