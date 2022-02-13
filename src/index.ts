import * as filter from "./filter/index"
import * as translator from "./translator/index"

let observer = new MutationObserver(function(mutations) {
    let originElements: Element[] = []

    for (const mutation of mutations) {
        const nodes = mutation.addedNodes
        if(!nodes || nodes.length == 0) {
            continue
        }
        nodes.forEach(node => {
            originElements.push(<Element>node)
        });
    }

    const matchElement = filter.getTargetElement(originElements)
    for (const elementName in matchElement) {
        if (Object.prototype.hasOwnProperty.call(matchElement, elementName)) {
            const element = matchElement[elementName];
            if(element) {
                element.textContent = translator.languageTranslate(elementName, "zhCn")
            }
        }
    }
})

observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
})