"use client"

import Header from "../components/modules/header/Header";
import Landing from "../components/layouts/index/Landing/Landing";
import PopularCategories from "../components/layouts/index/PopularCategories/PopularCategories";
import AmazingOffers from "../components/layouts/index/AmazingOffers/AmazingOffers";
import CategoriesByPhone from "../components/layouts/index/CategoriesByPhone/CategoriesByPhone";
import LatestProducts from "../components/layouts/index/LatestProducts/LatestProducts";
import ServicesSection from "../components/layouts/index/ServicesSection/ServicesSection";
import PopularProducts from "../components/layouts/index/PopularProducts/PopularProducts";
import PopularBrands from "../components/layouts/index/PopularBrands/PopularBrands";
import LatestArticles from "../components/layouts/index/LatestArticles/LatestArticles";
import Footer from "../components/modules/footer/Footer"; 

export default function Home() {
  return (
    <>
      <Header />
      <Landing />
      <PopularCategories />
      <AmazingOffers />
      <CategoriesByPhone />
      <LatestProducts />
      <ServicesSection />
      <PopularProducts />
      <PopularBrands />
      <LatestArticles />
      <Footer marginClasses={'mt-32'}/>
    </>
  );
}
