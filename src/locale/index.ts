import * as zhCn from "./lang/zh-cn"
import * as en from "./lang/en"

export interface Language {
    [lang: string]: {
        [elementName: string]: string
    }
}

export const languageDict = {
    zhCn: zhCn.default,
    en: en.default
}