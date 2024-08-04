"use client";

import React from "react";
import * as ReactLeaflet from "react-leaflet";
import "leaflet/dist/leaflet.css";

const DEFAULT_CENTER = [30.3753, 69.3451];
const DEFAULT_ZOOM = 5;

const LeafletMap = ({ children, center = null, zoom = null }) => {
  return (
    <ReactLeaflet.MapContainer
      className="leaflet-map-container"
      zoom={zoom || DEFAULT_ZOOM}
      center={center || DEFAULT_CENTER}
    >
      <ReactLeaflet.TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://github.com/ShakirAliSWE/nextjs-leaflet-socketio-example">Shakir Ali</a>'
      />
      {children}
    </ReactLeaflet.MapContainer>
  );
};

export default LeafletMap;
