const matchRuleDict = {
    "contextMenu.flipVertical": "div[data-testid='dropdown-option-Flip vertical']>div"
};
const getTargetElement = function (originElements) {
    let matchElement = {};
    for (const element of originElements) {
        for (const elementName in matchRuleDict) {
            if (!Object.prototype.hasOwnProperty.call(matchRuleDict, elementName)) {
                continue;
            }
            const rule = matchRuleDict[elementName];
            if (!element.querySelector) {
                continue;
            }
            const target = element.querySelector(rule);
            if (target && (target === null || target === void 0 ? void 0 : target.nodeType) == 1) {
                matchElement[elementName] = target;
            }
        }
    }
    return matchElement;
};

var zhCn = {
    "contextMenu.flipVertical": "垂直翻转"
};

var en = {
    "contextMenu.flipVertical": "Flip vertical"
};

const languageDict = {
    zhCn: zhCn,
    en: en
};

const languageTranslate = function (elementName, lang) {
    const langDict = languageDict;
    return langDict[lang] && langDict[lang][elementName] ? langDict[lang][elementName] : "";
};

let observer = new MutationObserver(function (mutations) {
    let originElements = [];
    for (const mutation of mutations) {
        const nodes = mutation.addedNodes;
        if (!nodes || nodes.length == 0) {
            continue;
        }
        nodes.forEach(node => {
            originElements.push(node);
        });
    }
    const matchElement = getTargetElement(originElements);
    for (const elementName in matchElement) {
        if (Object.prototype.hasOwnProperty.call(matchElement, elementName)) {
            const element = matchElement[elementName];
            if (element) {
                element.textContent = languageTranslate(elementName, "zhCn");
            }
        }
    }
});
observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
});
