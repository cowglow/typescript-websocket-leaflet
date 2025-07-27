import { WebSocketServer } from "ws";

type Point = { x: number; y: number };

const wss = new WebSocketServer({ port: 9090 });

const EUROPEAN_BOUNDS = {
  minX: -25, // longitude (Iceland west)
  maxX: 45, // longitude (Turkey east)
  minY: 35, // latitude (Turkey south)
  maxY: 66, // latitude (Iceland north)
};

const BOUNDS = {
  minX: -180, // longitude (west)
  maxX: 180, // longitude (east)
  minY: -90, // latitude (south)
  maxY: 90, // latitude (north)
};

const PADDING = 10;

function getRandomPoint(): Point {
  const x = Math.random() * (BOUNDS.maxX - BOUNDS.minX) + BOUNDS.minX;
  const y = Math.random() * (BOUNDS.maxY - BOUNDS.minY) + BOUNDS.minY - PADDING;
  return { x, y };
}

wss.on("connection", (ws) => {
  let authenticated = false;

  ws.on("message", (msg) => {
    try {
      const data = JSON.parse(msg.toString());
      if (data.type === "auth" && data.password === "password") {
        authenticated = true;
        ws.send(JSON.stringify({ type: "auth", status: "success" }));
      } else if (data.type === "auth") {
        ws.send(JSON.stringify({ type: "auth", status: "failure" }));
        ws.close();
      }
    } catch {
      ws.close();
    }
  });

  const interval = setInterval(() => {
    if (authenticated) {
      ws.send(JSON.stringify({ type: "point", point: getRandomPoint() }));
    }
  }, 1000);

  ws.on("close", () => clearInterval(interval));
});
console.log("Geolocation service is running...");
