"use client"

import Header from "../components/modules/Header/Header";
import Landing from "../components/templates/Index/Landing/Landing";
import PopularCategories from "../components/templates/Index/PopularCategories/PopularCategories";
import AmazingOffers from "../components/templates/Index/AmazingOffers/AmazingOffers";
import CategoriesByPhone from "../components/templates/Index/CategoriesByPhone/CategoriesByPhone";
import LatestProducts from "../components/templates/Index/LatestProducts/LatestProducts";
import ServicesSection from "../components/templates/Index/ServicesSection/ServicesSection";
import PopularProducts from "../components/templates/Index/PopularProducts/PopularProducts";
import PopularBrands from "../components/templates/Index/PopularBrands/PopularBrands";
import LatestArticles from "../components/templates/Index/LatestArticles/LatestArticles";
import Footer from "../components/modules/Footer/Footer"; 

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
