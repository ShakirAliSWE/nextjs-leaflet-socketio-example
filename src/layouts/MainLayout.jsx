"use client";

import { RecoilRoot } from "recoil";

const MainLayout = ({ children }) => {
  return <RecoilRoot>{children}</RecoilRoot>;
};

export default MainLayout;
