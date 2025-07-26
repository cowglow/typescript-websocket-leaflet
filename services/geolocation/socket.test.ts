import { describe, it, expect } from 'vitest';
import {WebSocket} from 'ws';
import './socket'; // Start server

const WS_URL = 'ws://localhost:8080';

describe('Geolocation WebSocket Server', () => {
    it('authenticates with correct password', async () => {
        await new Promise<void>((resolve, reject) => {
            const ws = new WebSocket(WS_URL);
            ws.on('open', () => {
                ws.send(JSON.stringify({ type: 'auth', password: 'password' }));
            });
            ws.on('message', (msg) => {
                const data = JSON.parse(msg.toString());
                try {
                    expect(data.type).toBe('auth');
                    expect(data.status).toBe('success');
                    ws.close();
                    resolve();
                } catch (err) {
                    ws.close();
                    reject(err);
                }
            });
        });
    });

    it('fails authentication with wrong password', async () => {
        await new Promise<void>((resolve, reject) => {
            const ws = new WebSocket(WS_URL);
            ws.on('open', () => {
                ws.send(JSON.stringify({ type: 'auth', password: 'wrong' }));
            });
            ws.on('message', (msg) => {
                const data = JSON.parse(msg.toString());
                try {
                    expect(data.type).toBe('auth');
                    expect(data.status).toBe('failure');
                } catch (err) {
                    ws.close();
                    reject(err);
                }
            });
            ws.on('close', () => {
                resolve();
            });
        });
    });

    it('receives point messages after authentication', async () => {
        await new Promise<void>((resolve, reject) => {
            const ws = new WebSocket(WS_URL);
            let authenticated = false;
            ws.on('open', () => {
                ws.send(JSON.stringify({ type: 'auth', password: 'password' }));
            });
            ws.on('message', (msg) => {
                const data = JSON.parse(msg.toString());
                try {
                    if (data.type === 'auth' && data.status === 'success') {
                        authenticated = true;
                    } else if (authenticated && data.type === 'point') {
                        expect(data.point).toHaveProperty('x');
                        expect(data.point).toHaveProperty('y');
                        ws.close();
                        resolve();
                    }
                } catch (err) {
                    ws.close();
                    reject(err);
                }
            });
        });
    });

    it('closes connection on invalid JSON message', async () => {
        await new Promise<void>((resolve) => {
            const ws = new WebSocket(WS_URL);
            ws.on('open', () => {
                ws.send('not a json');
            });
            ws.on('close', () => {
                resolve();
            });
        });
    });
});