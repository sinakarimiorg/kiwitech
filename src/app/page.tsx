"use client"

import Header from "../components/modules/header/Header";
import Landing from "../components/templates/index/Landing/Landing";
import PopularCategories from "../components/templates/index/PopularCategories/PopularCategories";
import AmazingOffers from "../components/templates/index/AmazingOffers/AmazingOffers";
import CategoriesByPhone from "../components/templates/index/CategoriesByPhone/CategoriesByPhone";
import LatestProducts from "../components/templates/index/LatestProducts/LatestProducts";
import ServicesSection from "../components/templates/index/ServicesSection/ServicesSection";
import PopularProducts from "../components/templates/index/PopularProducts/PopularProducts";
import PopularBrands from "../components/templates/index/PopularBrands/PopularBrands";
import LatestArticles from "../components/templates/index/LatestArticles/LatestArticles";
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
