"use client";

import { Marker, Popup } from "react-leaflet";

const LeafletMarker = ({ position, label = null }) => {
  return <Marker position={position}>{label && <Popup>{label}</Popup>}</Marker>;
};

export default LeafletMarker;
