const net = require("net");
const dgram = require("dgram");
const io = require("socket.io")(3001);

let gameState = Array(9).fill(null);
let currentPlayer = 'X';

const server = net.createServer((socket) => {
    console.log("A player has connected");

    socket.on("data", (data) => {
        const move = JSON.parse(data);
        if (gameState[move.index] === null && currentPlayer === move.player) {
            gameState[move.index] = move.player;
            currentPlayer = move.player === "X" ? "O" : "X";
            broadcastGameState();
        }
    });

    socket.on("end", () => {
        console.log("A player has disconnected");
    });
});

function broadcastGameState() {
    io.sockets.emit("game-update", gameState);
}

server.listen(8080, () => {
    console.log("TCP server listening on port 8080");
});

const udpServer = dgram.createSocket("udp4");
udpServer.on("message", (msg, rinfo) => {
    console.log(`UDP message: ${msg} from ${rinfo.address}:${rinfo.port}`);
});
udpServer.bind(8081);
