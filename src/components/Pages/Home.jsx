"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRecoilState } from "recoil";

import { atomUsers } from "@/recoil/users.atom";
import useLocation from "@/hooks/useLocation";
import useSocket from "@/hooks/useSocket";

const HomePage = () => {
  const socket = useSocket("http://localhost:3000");
  const [users, setUsers] = useRecoilState(atomUsers);
  const userLocation = useLocation();
  const lastLocation = useRef({ current: { latitude: 0, longitude: 0 } });

  const LeafletMap = useMemo(
    () =>
      dynamic(() => import("@/components/LeafletMap"), {
        loading: () => <>Loading Map...</>,
        ssr: false,
      }),
    []
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
    newUsers.push(data);
    setUsers(newUsers);
  };

  const removeLocation = (id) => {
    console.log("removeLocation", id);
    setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
  };

  useEffect(() => {
    console.log("useEffect Send Location Loading...", userLocation);
    if (
      lastLocation.current.latitude !== userLocation.latitude &&
      lastLocation.current.longitude !== userLocation.longitude
    ) {
      socket.emit("send-location", userLocation);
      lastLocation.current = userLocation;
    }
  }, [userLocation]);

  useEffect(() => {
    console.log("useEffect Receive Location Loading...");

    socket.on("receive-location", receiveLocation);
    socket.on("remove-location", removeLocation);

    return () => {
      socket.off("receive-location", receiveLocation);
      socket.off("remove-location", removeLocation);
    };
  }, [socket]);

  return (
    <LeafletMap>
      {users.map((user) => (
        <LeafletMarker key={user.id} position={[user.latitude, user.longitude]} label={user?.id} />
      ))}
    </LeafletMap>
  );
};

export default HomePage;
