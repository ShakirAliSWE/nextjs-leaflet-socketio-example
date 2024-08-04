const { atom } = require("recoil");
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export const atomUsers = atom({
  key: "users",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
