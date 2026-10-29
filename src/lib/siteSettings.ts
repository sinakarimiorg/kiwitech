import { connectDB } from "./mongodb";
import { cachedQuery } from "./cache";
import SiteSettingsModel from '@root/src/models/SiteSettings'
import { mergeHomeSections} from "../types/siteSettingsType";
import type { HomeSectionConfig } from '@root/src/types/siteSettingsType'

const loadHomeSections = cachedQuery('settings:home-sections', ['settings'], async (): Promise<HomeSectionConfig[]> => {
    await connectDB()
    const settings = await SiteSettingsModel.findOne({ key: 'main' }).lean()
    return mergeHomeSections(settings?.homeSections)
}, mergeHomeSections())

export const getHomeSections = loadHomeSections
