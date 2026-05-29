"use client"

import Header from "../components/modules/header/Header";
import Landing from "../components/layouts/index/Landing/Landing";
import PopularCategories from "../components/layouts/index/PopularCategories/PopularCategories";

export default function Home() {
  return (
    <>
      <Header />
      <Landing/>
      <PopularCategories/>
    </>
  );
}
