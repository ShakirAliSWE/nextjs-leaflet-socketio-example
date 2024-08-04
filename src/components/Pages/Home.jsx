"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState } from "recoil";

import { atomUsers } from "@/recoil/users.atom";
import useLocation from "@/hooks/useLocation";
import useSocket from "@/hooks/useSocket";

const HomePage = () => {
  const socket = useSocket("https://nextjs-leaflet-socketio.vercel.app:3000");
  const [leafletOptions, setLeafletOptions] = useState({ center: null, zoom: null });
  const [users, setUsers] = useRecoilState(atomUsers);
  const userLocation = useLocation();
  const lastLocation = useRef({ current: { latitude: 0, longitude: 0 } });

  const LeafletMap = useMemo(
    () =>
      dynamic(() => import("@/components/LeafletMap"), {
        loading: () => <>Loading Map...</>,
        ssr: false,
      }),
    [leafletOptions]
  );

  const LeafletMarker = useMemo(
    () =>
      dynamic(() => import("@/components/LeafletMap/LeafletMarker"), {
        loading: () => <>Loading Marker...</>,
        ssr: false,
      }),
    []
  );

  const receiveLocation = (data) => {
    console.log("Received Location ", data);
    const newUsers = [...users];
    const indexUser = newUsers.findIndex((user) => user.id === data.id);
    if (indexUser !== -1) {
      newUsers[indexUser] = data;
    } else {
      newUsers.push(data);
    }

    setUsers(newUsers);
    setLeafletOptions(() => ({ center: [data.latitude, data.longitude], zoom: 8 }));
  };

  const removeLocation = (id) => {
    console.log("Removed Location", id);
    const filterUsers = [...users].filter((user) => user.id !== id);
    setUsers(filterUsers);
  };

  useEffect(() => {
    if (
      lastLocation.current.latitude !== userLocation.latitude &&
      lastLocation.current.longitude !== userLocation.longitude &&
      socket
    ) {
      console.log("Location sent", userLocation);
      socket.emit("send-location", userLocation);
      lastLocation.current = userLocation;
    }
  }, [userLocation]);

  useEffect(() => {
    if (socket) {
      socket.on("receive-location", receiveLocation);
      socket.on("remove-location", removeLocation);
      return () => {
        socket.off("remove-location", removeLocation);
      };
    }
  }, [socket]);

  useEffect(() => {
    console.log(`~ No of Users : ${users.length}`);
  }, [users]);

  return (
    <LeafletMap {...leafletOptions}>
      {users.map((user) => (
        <LeafletMarker key={user.id} position={[user.latitude, user.longitude]} label={user?.id} />
      ))}
    </LeafletMap>
  );
};

export default HomePage;
