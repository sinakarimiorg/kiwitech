import { Fragment, type ReactNode } from "react"
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
import { getHomeSections } from "../lib/siteSettings";
import type { HomeSectionConfig } from "../types/siteSettingsType";

export const dynamic = 'force-dynamic'

function renderSection(section: HomeSectionConfig): ReactNode {
  switch (section.key) {
    case 'landing': return <Landing config={section} />
    case 'popularCategories': return <PopularCategories config={section} />
    case 'amazingOffers': return <AmazingOffers config={section} />
    case 'categoriesByPhone': return <CategoriesByPhone config={section} />
    case 'latestProducts': return <LatestProducts config={section} />
    case 'services': return <ServicesSection />
    case 'popularProducts': return <PopularProducts config={section} />
    case 'popularBrands': return <PopularBrands config={section} />
    case 'latestArticles': return <LatestArticles config={section} />
    default: return null
  }
}

export default async function Home() {
  const sections = await getHomeSections()
  const enabledSections = sections.filter(section => section.enabled)
  const hasLanding = enabledSections.some(section => section.key === 'landing')

  return (
    <>
      <Header />

      {!hasLanding && <div className='hidden sm:block h-40' />}

      {enabledSections.map(section => (
        <Fragment key={section.key}>{renderSection(section)}</Fragment>
      ))}

      <Footer marginClasses={'mt-32'} />
    </>
  );
}
