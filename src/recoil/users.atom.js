const { atom } = require("recoil");
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const atomUsers = atom({
  key: "users",
  default: [
    // { id: "RGfNJN-CnCFURknTAAAR", latitude: 31.4339184, longitude: 74.4659355 },
    // { id: "QLvs-avJSG677F2qAAAX", latitude: 31.4167993, longitude: 74.4774626 },
  ],
  effects_UNSTABLE: [persistAtom],
});
