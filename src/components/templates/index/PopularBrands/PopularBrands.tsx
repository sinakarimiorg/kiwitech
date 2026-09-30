import { getBannersByPosition } from "@root/src/lib/home/homeData";
import { HomeSectionConfig } from "@root/src/types/siteSettingsType";
import PopularBrandsSlider from "./PopularBrandsSlider";


export default async function PopularBrands({ config }: { config: HomeSectionConfig }) {
    const brands = await getBannersByPosition('brands', config.limit)
    if (brands.length === 0) return null

    return <PopularBrandsSlider title={config.title} brands={brands} />
}
