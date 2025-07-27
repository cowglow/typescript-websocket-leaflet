import "./style.css";
import { createWebSocketViewer } from "./lib/web-socket-viewer.ts";
import { createLeafletMap } from "./lib/leaflet-map.ts";

const appBase = document.getElementById("app")!;
appBase.appendChild(createWebSocketViewer());
appBase.appendChild(createLeafletMap());
