import * as filter from "../filter/index"
import {Language, languageDict} from "../locale/index"

export interface LangInfo {
    ID: string
    name: string
    dict: {
        [elementName: string]: string
    }
}

const generateLangInfoList = (langDict: Language): LangInfo[] => {
    let list: LangInfo[] = []

    for (const key in langDict) {
        if (Object.prototype.hasOwnProperty.call(langDict, key)) {
            const val = langDict[key]
            list.push({
                ID: key,
                name: val.name,
                dict: val.dict,
            })
        }
    }

    return list
}

const languageContentTranslate = function(elementName: string, lang: string): string {
    const langDict = (<Language>languageDict)
    return  langDict[lang] && langDict[lang]["dict"] && langDict[lang]["dict"][elementName]? langDict[lang]["dict"][elementName]: ""
}


export const langInfoList = generateLangInfoList(languageDict)

export 	const languageConverter = (elements: Element[], lang: string) => {
    const matchElement = filter.getTargetElement(elements)

    for (const elementName in matchElement) {
        if (
            Object.prototype.hasOwnProperty.call(matchElement, elementName)
        ) {
            const element = matchElement[elementName]
            if (element) {
                const langCon = languageContentTranslate(
                    elementName,
                    lang
                )
                element.textContent = langCon
            }
        }
    }
}