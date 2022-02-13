interface MatchRule {
    [key: string]: string
}

const matchRuleDict:MatchRule = {
    "contextMenu.Copy": "div[data-testid='dropdown-option-Copy']>div",
    "contextMenu.PasteHere": "div[data-testid='dropdown-option-Paste here']>div",
    "contextMenu.PasteToReplace": "div[data-testid='dropdown-option-Paste to replace']>div",
    "contextMenu.CopyOrPasteAs": "div[data-testid='dropdown-option-Copy/Paste as']>div",

    "contextMenu.CopyOrPasteAs.CopyAsCSS": "div[data-testid='dropdown-option-Copy as CSS']>div",
    "contextMenu.CopyOrPasteAs.CopyAsSVG": "div[data-testid='dropdown-option-Copy as SVG']>div",
    "contextMenu.CopyOrPasteAs.CopyAsPNG": "div[data-testid='dropdown-option-Copy as PNG']>div",
    "contextMenu.CopyOrPasteAs.CopyLink": "div[data-testid='dropdown-option-Copy  link']>div",

    "contextMenu.CopyOrPasteAs.CopyProperties": "div[data-testid='dropdown-option-Copy properties']>div",
    "contextMenu.CopyOrPasteAs.PasteProperties": "div[data-testid='dropdown-option-Paste properties']>div",

    "contextMenu.BringToFront": "div[data-testid='dropdown-option-Bring to front']>div",
    "contextMenu.SendToBack": "div[data-testid='dropdown-option-Send to back']>div",

    "contextMenu.GroupSelection": "div[data-testid='dropdown-option-Group selection']>div",
    "contextMenu.FrameSelection": "div[data-testid='dropdown-option-Frame selection']>div",
    "contextMenu.Ungroup": "div[data-testid='dropdown-option-Ungroup']>div",
    "contextMenu.Flatten": "div[data-testid='dropdown-option-Flatten']>div",
    "contextMenu.OutlineStroke": "div[data-testid='dropdown-option-Outline stroke']>div",
    "contextMenu.UseAsMask": "div[data-testid='dropdown-option-Use as mask']>div",
    "contextMenu.SetAsThumbnail": "div[data-testid='dropdown-option-Set as thumbnail']>div",

    "contextMenu.AddAutoLayout": "div[data-testid='dropdown-option-Add auto layout']>div",
    "contextMenu.CreateComponent": "div[data-testid='dropdown-option-Create component']>div",
    "contextMenu.Plugins": "div[data-testid='dropdown-option-Plugins']>div",

    "contextMenu.Plugins.ManagePlugins": "div[data-testid='dropdown-option-Manage plugins…']>div",
    "contextMenu.Plugins.BrowsePluginsInCommunity": "div[data-testid='dropdown-option-Browse plugins in Community']>div",

    "contextMenu.ShowOrHide": "div[data-testid='dropdown-option-Show/Hide']>div",
    "contextMenu.LockOrUnlock": "div[data-testid='dropdown-option-Lock/Unlock']>div",

    "contextMenu.flipHorizontal": "div[data-testid='dropdown-option-Flip horizontal']>div",
    "contextMenu.flipVertical": "div[data-testid='dropdown-option-Flip vertical']>div",

    "contextMenu.ShowOrHideUI": "div[data-testid='dropdown-option-Show/Hide UI']>div",
    "contextMenu.ShowOrHideComments": "div[data-testid='dropdown-option-Show/Hide comments']>div",

    "contextMenu.CursorChat": "div[data-testid='dropdown-option-Cursor chat']>div",
    "contextMenu.QuickActions": "div[data-testid='dropdown-option-Quick actions…']>div"
}

interface MatchElement {
    [key: string]: Element
}

export const getTargetElement = function(originElements: Element[]): MatchElement {
    let matchElement: MatchElement = {}

    for (const element of originElements) {
        if(!element.querySelector) {
            continue
        }

        console.log(element.innerHTML)

        for (const elementName in matchRuleDict) {
            if (!Object.prototype.hasOwnProperty.call(matchRuleDict, elementName)) {
                continue
            }

            const rule = matchRuleDict[elementName]
            const target = (<Element>element).querySelector(rule)

            if(target && target?.nodeType == 1) {
                matchElement[elementName] = target
            }
        }
    }

    return matchElement
}