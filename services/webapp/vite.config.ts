import { defineConfig } from "vite";

export default defineConfig({
	server: {
		host: true, // Listen on all addresses (0.0.0.0)
		port: 3000 // Default port, can be omitted if 3000
	}
});
