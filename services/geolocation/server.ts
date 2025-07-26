import Fastify from "fastify";
import "./socket.ts"

const fastify = Fastify();
const PORT = process.env.PORT ? Number(process.env.PORT) : 8080;

fastify.get("/", async (_request, _reply) => {
    return {message: "Server Running"};
});

fastify.listen({port: PORT, host: "0.0.0.0"}, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    console.log(`Geo server running at ${address}`);
});