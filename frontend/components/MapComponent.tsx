"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Fix for default Leaflet icon paths
const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

export default function MapComponent() {
    const position: [number, number] = [6.217797208236703, -0.3515880323753746]; // Live Coordinates for Imperial Academy

    return (
        <div className="w-full h-full min-h-[500px] z-10 relative">
            <MapContainer 
                center={position} 
                zoom={15} 
                scrollWheelZoom={false} 
                style={{ height: "100%", width: "100%" }}
                className="z-0"
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        <div className="text-center">
                            <h3 className="font-bold text-[#00236F]">Imperial Academy</h3>
                            <p className="text-xs text-zinc-600 mt-1">123 Academy Heights Blvd.</p>
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}
