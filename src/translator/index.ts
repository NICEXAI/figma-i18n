import {Language, languageDict} from "../locale/index"

export const languageTranslate = function(elementName: string, lang: string): string {
    const langDict = (<Language>languageDict)
    return  langDict[lang] && langDict[lang][elementName]? langDict[lang][elementName]: ""
}