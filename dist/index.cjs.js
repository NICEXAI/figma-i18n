'use strict';

const matchRuleDict = {
    "fullscreenMenu.BackToFiles": "a[data-onboarding-key='back-to-files']>span[class^='multilevel_dropdown--name']",
    "fullscreenMenu.File": "div[data-testid='dropdown-option-File']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit": "div[data-testid='dropdown-option-Edit']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View": "div[data-testid='dropdown-option-View']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object": "div[data-testid='dropdown-option-Object']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Vector": "div[data-testid='dropdown-option-Vector']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Text": "div[data-testid='dropdown-option-Text']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Arrange": "div[data-testid='dropdown-option-Arrange']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Integrations": "div[data-testid='dropdown-option-Integrations']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Preferences": "div[data-testid='dropdown-option-Preferences']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Libraries": "div[data-testid='dropdown-option-Libraries']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.GetDesktopApp": "div[data-testid='dropdown-option-Get desktop app']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.HelpAndAccount": "div[data-testid='dropdown-option-Help and account']>div[class^='multilevel_dropdown--name']",
    "contextMenu.Copy": "div[data-testid='dropdown-option-Copy']>div[class^='multilevel_dropdown--name']",
    "contextMenu.PasteHere": "div[data-testid='dropdown-option-Paste here']>div[class^='multilevel_dropdown--name']",
    "contextMenu.PasteToReplace": "div[data-testid='dropdown-option-Paste to replace']>div[class^='multilevel_dropdown--name']",
    "contextMenu.CopyOrPasteAs": "div[data-testid='dropdown-option-Copy/Paste as']>div[class^='multilevel_dropdown--name']",
    "contextMenu.CopyOrPasteAs.CopyAsCSS": "div[data-testid='dropdown-option-Copy as CSS']>div[class^='multilevel_dropdown--name']",
    "contextMenu.CopyOrPasteAs.CopyAsSVG": "div[data-testid='dropdown-option-Copy as SVG']>div[class^='multilevel_dropdown--name']",
    "contextMenu.CopyOrPasteAs.CopyAsPNG": "div[data-testid='dropdown-option-Copy as PNG']>div[class^='multilevel_dropdown--name']",
    "contextMenu.CopyOrPasteAs.CopyLink": "div[data-testid='dropdown-option-Copy  link']>div[class^='multilevel_dropdown--name']",
    "contextMenu.CopyOrPasteAs.CopyProperties": "div[data-testid='dropdown-option-Copy properties']>div[class^='multilevel_dropdown--name']",
    "contextMenu.CopyOrPasteAs.PasteProperties": "div[data-testid='dropdown-option-Paste properties']>div[class^='multilevel_dropdown--name']",
    "contextMenu.BringToFront": "div[data-testid='dropdown-option-Bring to front']>div[class^='multilevel_dropdown--name']",
    "contextMenu.SendToBack": "div[data-testid='dropdown-option-Send to back']>div[class^='multilevel_dropdown--name']",
    "contextMenu.GroupSelection": "div[data-testid='dropdown-option-Group selection']>div[class^='multilevel_dropdown--name']",
    "contextMenu.FrameSelection": "div[data-testid='dropdown-option-Frame selection']>div[class^='multilevel_dropdown--name']",
    "contextMenu.Ungroup": "div[data-testid='dropdown-option-Ungroup']>div[class^='multilevel_dropdown--name']",
    "contextMenu.Flatten": "div[data-testid='dropdown-option-Flatten']>div[class^='multilevel_dropdown--name']",
    "contextMenu.OutlineStroke": "div[data-testid='dropdown-option-Outline stroke']>div[class^='multilevel_dropdown--name']",
    "contextMenu.UseAsMask": "div[data-testid='dropdown-option-Use as mask']>div[class^='multilevel_dropdown--name']",
    "contextMenu.SetAsThumbnail": "div[data-testid='dropdown-option-Set as thumbnail']>div[class^='multilevel_dropdown--name']",
    "contextMenu.AddAutoLayout": "div[data-testid='dropdown-option-Add auto layout']>div[class^='multilevel_dropdown--name']",
    "contextMenu.CreateComponent": "div[data-testid='dropdown-option-Create component']>div[class^='multilevel_dropdown--name']",
    "contextMenu.Plugins": "div[data-testid='dropdown-option-Plugins']>div[class^='multilevel_dropdown--name']",
    "contextMenu.Plugins.ManagePlugins": "div[data-testid='dropdown-option-Manage plugins…']>div[class^='multilevel_dropdown--name']",
    "contextMenu.Plugins.BrowsePluginsInCommunity": "div[data-testid='dropdown-option-Browse plugins in Community']>div[class^='multilevel_dropdown--name']",
    "contextMenu.ShowOrHide": "div[data-testid='dropdown-option-Show/Hide']>div[class^='multilevel_dropdown--name']",
    "contextMenu.LockOrUnlock": "div[data-testid='dropdown-option-Lock/Unlock']>div[class^='multilevel_dropdown--name']",
    "contextMenu.flipHorizontal": "div[data-testid='dropdown-option-Flip horizontal']>div[class^='multilevel_dropdown--name']",
    "contextMenu.flipVertical": "div[data-testid='dropdown-option-Flip vertical']>div[class^='multilevel_dropdown--name']",
    "contextMenu.ShowOrHideUI": "div[data-testid='dropdown-option-Show/Hide UI']>div[class^='multilevel_dropdown--name']",
    "contextMenu.ShowOrHideComments": "div[data-testid='dropdown-option-Show/Hide comments']>div[class^='multilevel_dropdown--name']",
    "contextMenu.CursorChat": "div[data-testid='dropdown-option-Cursor chat']>div[class^='multilevel_dropdown--name']",
    "contextMenu.QuickActions": "div[data-testid='dropdown-option-Quick actions…']>div[class^='multilevel_dropdown--name']"
};
const getTargetElement = function (originElements) {
    let matchElement = {};
    for (const element of originElements) {
        if (!element.querySelector) {
            continue;
        }
        console.log(element.innerHTML);
        for (const elementName in matchRuleDict) {
            if (!Object.prototype.hasOwnProperty.call(matchRuleDict, elementName)) {
                continue;
            }
            const rule = matchRuleDict[elementName];
            const target = element.querySelector(rule);
            if (target && (target === null || target === void 0 ? void 0 : target.nodeType) == 1) {
                matchElement[elementName] = target;
            }
        }
    }
    return matchElement;
};

var zhCn = {
    "fullscreenMenu.BackToFiles": "返回文件列表",
    "fullscreenMenu.File": "文件",
    "fullscreenMenu.Edit": "编辑",
    "fullscreenMenu.View": "查看",
    "fullscreenMenu.Object": "对象",
    "fullscreenMenu.Vector": "矢量",
    "fullscreenMenu.Text": "文本",
    "fullscreenMenu.Arrange": "排列",
    "fullscreenMenu.Integrations": "集成",
    "fullscreenMenu.Preferences": "偏好设置",
    "fullscreenMenu.Libraries": "组件库",
    "fullscreenMenu.GetDesktopApp": "下载桌面版应用",
    "fullscreenMenu.HelpAndAccount": "帮助和账户",
    "contextMenu.Copy": "复制",
    "contextMenu.PasteHere": "粘贴到这里",
    "contextMenu.PasteToReplace": "粘贴替换",
    "contextMenu.CopyOrPasteAs": "复制/粘贴为",
    "contextMenu.CopyOrPasteAs.CopyAsCSS": "复制为 CSS",
    "contextMenu.CopyOrPasteAs.CopyAsSVG": "复制为 SVG",
    "contextMenu.CopyOrPasteAs.CopyAsPNG": "复制为 PNG",
    "contextMenu.CopyOrPasteAs.CopyLink": "复制链接",
    "contextMenu.CopyOrPasteAs.CopyProperties": "复制属性",
    "contextMenu.CopyOrPasteAs.PasteProperties": "粘贴属性",
    "contextMenu.BringToFront": "移到顶层",
    "contextMenu.SendToBack": "移到底层",
    "contextMenu.GroupSelection": "编组所选项",
    "contextMenu.FrameSelection": "添加画框",
    "contextMenu.Ungroup": "取消编组",
    "contextMenu.Flatten": "拼合",
    "contextMenu.OutlineStroke": "轮廓化描边",
    "contextMenu.UseAsMask": "设为蒙版",
    "contextMenu.SetAsThumbnail": "设为封面",
    "contextMenu.AddAutoLayout": "添加自动布局",
    "contextMenu.CreateComponent": "创建组件",
    "contextMenu.Plugins": "插件",
    "contextMenu.Plugins.ManagePlugins": "管理插件…",
    "contextMenu.Plugins.BrowsePluginsInCommunity": "在社区中浏览插件",
    "contextMenu.ShowOrHide": "显示/隐藏",
    "contextMenu.LockOrUnlock": "锁定/解锁",
    "contextMenu.flipHorizontal": "水平翻转",
    "contextMenu.flipVertical": "垂直翻转",
    "contextMenu.ShowOrHideUI": "显示/隐藏界面",
    "contextMenu.ShowOrHideComments": "显示/隐藏评论",
    "contextMenu.CursorChat": "聚焦聊天框",
    "contextMenu.QuickActions": "快速操作…"
};

var en = {
    "fullscreenMenu.BackToFiles": "Back to files",
    "fullscreenMenu.File": "File",
    "fullscreenMenu.Edit": "Edit",
    "fullscreenMenu.View": "View",
    "fullscreenMenu.Object": "Object",
    "fullscreenMenu.Vector": "Vector",
    "fullscreenMenu.Text": "Text",
    "fullscreenMenu.Arrange": "Arrange",
    "fullscreenMenu.Integrations": "Integrations",
    "fullscreenMenu.Preferences": "Preferences",
    "fullscreenMenu.Libraries": "Libraries",
    "fullscreenMenu.GetDesktopApp": "Get desktop app",
    "fullscreenMenu.HelpAndAccount": "Help and account",
    "contextMenu.Copy": "Copy",
    "contextMenu.PasteHere": "Paste here",
    "contextMenu.PasteToReplace": "Paste to replace",
    "contextMenu.CopyOrPasteAs": "Copy/Paste as",
    "contextMenu.CopyOrPasteAs.CopyAsCSS": "Copy as CSS",
    "contextMenu.CopyOrPasteAs.CopyAsSVG": "Copy as SVG",
    "contextMenu.CopyOrPasteAs.CopyAsPNG": "Copy as PNG",
    "contextMenu.CopyOrPasteAs.CopyLink": "Copy link",
    "contextMenu.CopyOrPasteAs.CopyProperties": "Copy properties",
    "contextMenu.CopyOrPasteAs.PasteProperties": "Paste properties",
    "contextMenu.BringToFront": "Bring to front",
    "contextMenu.SendToBack": "Send to back",
    "contextMenu.GroupSelection": "Group selection",
    "contextMenu.FrameSelection": "Frame selection",
    "contextMenu.Ungroup": "Ungroup",
    "contextMenu.Flatten": "Flatten",
    "contextMenu.OutlineStroke": "Outline stroke",
    "contextMenu.UseAsMask": "Use as mask",
    "contextMenu.SetAsThumbnail": "Set as thumbnail",
    "contextMenu.AddAutoLayout": "Add auto layout",
    "contextMenu.CreateComponent": "Create component",
    "contextMenu.Plugins": "Plugins",
    "contextMenu.Plugins.ManagePlugins": "Manage plugins…",
    "contextMenu.Plugins.BrowsePluginsInCommunity": "Browse plugins in Community",
    "contextMenu.ShowOrHide": "Show/Hide",
    "contextMenu.LockOrUnlock": "Lock/Unlock",
    "contextMenu.flipHorizontal": "Flip horizontal",
    "contextMenu.flipVertical": "Flip vertical",
    "contextMenu.ShowOrHideUI": "Show/Hide UI",
    "contextMenu.ShowOrHideComments": "Show/Hide comments",
    "contextMenu.CursorChat": "Cursor chat",
    "contextMenu.QuickActions": "Quick actions…"
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
