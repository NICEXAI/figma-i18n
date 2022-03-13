import * as zhCn from "./lang/zh-cn"
import * as en from "./lang/en"
import * as ja from "./lang/ja"

export interface Language {
    [lang: string]: {
        name: string
        dict: {
            [elementName: string]: string
        }
    }
}

export const languageDict = {
    en: {
        name: "English",
        dict: en.default
    },
    zhCn: {
        name: "简体中文",
        dict: zhCn.default
    },
    ja: {
        name: "日本語",
        dict: ja.default
    }
}