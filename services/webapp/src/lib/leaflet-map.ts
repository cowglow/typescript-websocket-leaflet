import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { AUTHENTICATION, WS_URL } from "../constants.ts";
import { greenIcon } from "./leaflet-map-icons.ts";

let markerCount = 0;

export function createLeafletMap() {
	const mapContainer = document.createElement("div");
	mapContainer.id = "map";
	setupLeafletMap(mapContainer);
	return mapContainer;
}

function setupLeafletMap(mapContainer: HTMLDivElement) {
	const map = L.map(mapContainer, {
		maxBounds: [
			[-90, -180], // Southwest corner
			[90, 180] // Northeast corner
		],
		worldCopyJump: true
	}).setView([51.505, -0.09], 13);
	setupAttribution(map);
	setupWebSocketInterface(map);
	setTimeout(() => map.invalidateSize(), 100);
}

function setupAttribution(map: L.Map) {
	L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
		maxZoom: 19,
		attribution:
			'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

type MessageType = {
	type: "point";
	point: {
		x: number;
		y: number;
	};
};

function setupWebSocketInterface(map: L.Map) {
	const ws = new WebSocket(WS_URL);
	const bounds = L.latLngBounds([]);

	ws.onopen = () => ws.send(JSON.stringify(AUTHENTICATION));

	ws.onmessage = (event) => {
		const data: MessageType = JSON.parse(event.data);
		if (data.type === "point") {
			markerCount++;
			const useGreen = markerCount % 5 === 0;
			const markerPosition: L.LatLngExpression = [data.point.y, data.point.x];
			const marker = useGreen
				? L.marker(markerPosition, { icon: greenIcon })
				: L.marker(markerPosition);
			marker.addTo(map);
			marker.bindTooltip(`<pre>${JSON.stringify(marker.getLatLng(), null, 2)}</pre>`);
			bounds.extend(marker.getLatLng());
			map.fitBounds(bounds);
		}
	};

	window.addEventListener("beforeunload", () => ws.close());
}
