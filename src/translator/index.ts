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
            const target = matchElement[elementName]
            if (target) {
                const langCon = languageContentTranslate(
                    elementName,
                    lang
                )
                let trackStatus = true
                
                if(target.type == "Attr") {
                    for (let i = 0; i < target.attrList.length; i++) {
                        const attrNode = target.attrList[i];
                        if(attrNode.Key == "no-track") {
                            trackStatus = false
                            continue
                        }
                        if(attrNode.Key == "text-content") {
                            target.node.textContent = langCon
                            continue
                        }
                        if(attrNode.Value=="" && target.node.getAttribute(attrNode.Key) != langCon) {
                            target.node.setAttribute(attrNode.Key, langCon)
                        }
                        if(attrNode.Value != "" && target.node.getAttribute(attrNode.Key) != attrNode.Value) {
                            target.node.setAttribute(attrNode.Key, attrNode.Value)
                        }
                    }
                    
                }
                if(target.type == "Text" && target.node.textContent != langCon) {
                    target.node.textContent = langCon
                }
                if(trackStatus && target.node && target.node.setAttribute) {
                    target.node.setAttribute("figma-i18n-id", elementName)
                }
            }
        }
    }
}