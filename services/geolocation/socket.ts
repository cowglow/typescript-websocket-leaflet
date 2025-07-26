import {WebSocketServer} from 'ws';

type Point = { x: number; y: number };

const wss = new WebSocketServer({port: 9090});

function getRandomPoint(): Point {
    return {
        x: Math.random() * 100,
        y: Math.random() * 100,
    };
}

wss.on('connection', ws => {
    let authenticated = false;

    ws.on('message', (msg) => {
        try {
            const data = JSON.parse(msg.toString());
            if (data.type === 'auth' && data.password === 'password') {
                authenticated = true;
                ws.send(JSON.stringify({type: 'auth', status: 'success'}));
            } else if (data.type === 'auth') {
                ws.send(JSON.stringify({type: 'auth', status: 'failure'}));
                ws.close();
            }
        } catch {
            ws.close();
        }
    });

    const interval = setInterval(() => {
        if (authenticated) {
            ws.send(JSON.stringify({type: 'point', point: getRandomPoint()}));
        }
    }, 1000);

    ws.on('close', () => clearInterval(interval));
});
console.log('Geolocation service is running...');
