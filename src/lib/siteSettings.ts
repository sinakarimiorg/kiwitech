import { connectDB } from "./mongodb";
import SiteSettingsModel from '@root/src/models/SiteSettings'
import { mergeHomeSections} from "../types/siteSettingsType";
import type { HomeSectionConfig } from '@root/src/types/siteSettingsType'


export async function getHomeSections(): Promise<HomeSectionConfig[]> {
    try {
        await connectDB()
        const settings = await SiteSettingsModel.findOne({key: 'main'}).lean()
        return mergeHomeSections(settings?.homeSections)
    } catch (error) {
        console.error('[settings] failed to load home sections:', error)
        return mergeHomeSections()
    }
}