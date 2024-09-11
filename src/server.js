import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';  // Ajoutez ceci

const app = express();

// Utilisez CORS pour permettre les requêtes cross-origin
app.use(cors());  // Ajoutez ceci

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*",  // Vous pouvez restreindre l'accès à des domaines spécifiques
        methods: ["GET", "POST"]
    }
});

const players = {};

io.on('connection', (socket) => {
    console.log(`Player connected: ${socket.id}`);

    players[socket.id] = {
        x: 100,
        y: 450,
        id: socket.id,
    };

    socket.emit('currentPlayers', players);
    socket.broadcast.emit('newPlayer', players[socket.id]);

    socket.on('playerMovement', (movementData) => {
        players[socket.id].x = movementData.x;
        players[socket.id].y = movementData.y;
        io.emit('playerMoved', players[socket.id]);
    });

    socket.on('disconnect', () => {
        console.log(`Player disconnected: ${socket.id}`);
        delete players[socket.id];
        io.emit('playerDisconnected', socket.id);
    });
});

server.listen(8010, () => {
    console.log('Listening on *:8010');
});
