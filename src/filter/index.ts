interface MatchRule {
    [key: string]: string
}

const matchRuleDict:MatchRule = {
    "contextMenu.flipVertical": "div[data-testid='dropdown-option-Flip vertical']>div"
}

interface MatchElement {
    [key: string]: Element
}

export const getTargetElement = function(originElements: Element[]): MatchElement {
    let matchElement: MatchElement = {}

    for (const element of originElements) {
        for (const elementName in matchRuleDict) {
            if (!Object.prototype.hasOwnProperty.call(matchRuleDict, elementName)) {
                continue
            }

            const rule = matchRuleDict[elementName]
            if(!element.querySelector) {
                continue
            }
            const target = (<Element>element).querySelector(rule)
            if(target && target?.nodeType == 1) {
                matchElement[elementName] = target
            }
        }
    }

    return matchElement
}