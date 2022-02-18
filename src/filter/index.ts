interface MatchRule {
    [key: string]: string
}

const matchRuleDict:MatchRule = {
    "fullscreenMenu.BackToFiles": "a[data-onboarding-key='back-to-files']>span[class^='multilevel_dropdown--name']",

    "fullscreenMenu.QuickActions": "div[data-testid='dropdown-option-Quick actions…']>div[class^='multilevel_dropdown--name']",

    "fullscreenMenu.File": "div[data-testid='dropdown-option-File']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.File.NewDesignFile": "div[data-testid='dropdown-option-New design file']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.File.NewFigJamFile": "div[data-testid='dropdown-option-New FigJam file']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.File.NewFromSketchFile": "div[data-testid='dropdown-option-New from Sketch file…']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.File.PlaceImage": "div[data-testid='dropdown-option-Place image...']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.File.SaveLocalCopy": "div[data-testid='dropdown-option-Save local copy…']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.File.SaveToVersionHistory": "div[data-testid='dropdown-option-Save to version history…']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.File.ShowVersionHistory": "div[data-testid='dropdown-option-Show version history']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.File.Export": "div[data-testid='dropdown-option-Export…']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.File.ExportFramesToPDF": "div[data-testid='dropdown-option-Export frames to PDF…']>div[class^='multilevel_dropdown--name']",

    "fullscreenMenu.Edit": "div[data-testid='dropdown-option-Edit']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.Undo": "div[data-testid='dropdown-option-Undo']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.Redo": "div[data-testid='dropdown-option-Redo']>div[class^='multilevel_dropdown--name']",

    "fullscreenMenu.Edit.CopyAs": "div[data-testid='dropdown-option-Copy as']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.CopyAs.CopyAsText": "div[data-testid='dropdown-option-Copy as text']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.CopyAs.CopyAsCSS": "div[data-testid='dropdown-option-Copy as CSS']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.CopyAs.CopyAsSVG": "div[data-testid='dropdown-option-Copy as SVG']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.CopyAs.CopyAsPNG": "div[data-testid='dropdown-option-Copy as PNG']>div[class^='multilevel_dropdown--name']",

    "fullscreenMenu.Edit.PasteOverSelection": "div[data-testid='dropdown-option-Paste over selection']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.PasteToReplace": "div[data-testid='dropdown-option-Paste to replace']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.Duplicate": "div[data-testid='dropdown-option-Duplicate']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.Delete": "div[data-testid='dropdown-option-Delete']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.SetDefaultProperties": "div[data-testid='dropdown-option-Set default properties']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.CopyProperties": "div[data-testid='dropdown-option-Copy properties']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.PasteProperties": "div[data-testid='dropdown-option-Paste properties']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.PickColor": "div[data-testid='dropdown-option-Pick color']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.SelectAll": "div[data-testid='dropdown-option-Select all']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.SelectNone": "div[data-testid='dropdown-option-Select none']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.SelectInverse": "div[data-testid='dropdown-option-Select inverse']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.SelectAllWithSameProperties": "div[data-testid='dropdown-option-Select all with same properties']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.SelectAllWithSameFill": "div[data-testid='dropdown-option-Select all with same fill']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.SelectAllWithSameStroke": "div[data-testid='dropdown-option-Select all with same stroke']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.SelectAllWithSameEffect": "div[data-testid='dropdown-option-Select all with same effect']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.SelectAllWithSameTextProperties": "div[data-testid='dropdown-option-Select all with same text properties']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.SelectAllWithSameFont": "div[data-testid='dropdown-option-Select all with same font']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Edit.SelectAllWithSameInstance": "div[data-testid='dropdown-option-Select all with same instance']>div[class^='multilevel_dropdown--name']",

    "fullscreenMenu.View": "div[data-testid='dropdown-option-View']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.PixelGrid": "div[data-testid='dropdown-option-Pixel grid']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.LayoutGrids": "div[data-testid='dropdown-option-Layout grids']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.Rulers": "div[data-testid='dropdown-option-Rulers']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.ShowSlices": "div[data-testid='dropdown-option-Show slices']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.Comments": "div[data-testid='dropdown-option-Comments']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.Outlines": "div[data-testid='dropdown-option-Outlines']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.PixelPreview": "div[data-testid='dropdown-option-Pixel preview']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.MaskOutlines": "div[data-testid='dropdown-option-Mask outlines']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.FrameOutlines": "div[data-testid='dropdown-option-Frame outlines']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.ResourceUse": "div[data-testid='dropdown-option-Resource use']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.ShowOrHideUI": "div[data-testid='dropdown-option-Show/Hide UI']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.MultiplayerCursors": "div[data-testid='dropdown-option-Multiplayer cursors']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.Panels": "div[data-testid='dropdown-option-Panels']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.ZoomIn": "div[data-testid='dropdown-option-Zoom in']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.ZoomOut": "div[data-testid='dropdown-option-Zoom out']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.ZoomTo100%": "div[data-testid='dropdown-option-Zoom to 100%']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.ZoomToFit": "div[data-testid='dropdown-option-Zoom to fit']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.ZoomToSelection": "div[data-testid='dropdown-option-Zoom to selection']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.PreviousPage": "div[data-testid='dropdown-option-Previous page']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.NextPage": "div[data-testid='dropdown-option-Next page']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.ZoomToPreviousFrame": "div[data-testid='dropdown-option-Zoom to previous frame']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.ZoomToNextFrame": "div[data-testid='dropdown-option-Zoom to next frame']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.FindPreviousFrame": "div[data-testid='dropdown-option-Find previous frame']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.View.FindNextFrame": "div[data-testid='dropdown-option-Find next frame']>div[class^='multilevel_dropdown--name']",

    "fullscreenMenu.Object": "div[data-testid='dropdown-option-Object']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.GroupSelection": "div[data-testid='dropdown-option-Group selection']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.CreateSection": "div[data-testid='dropdown-option-Create section']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.FrameSelection": "div[data-testid='dropdown-option-Frame selection']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.UngroupSelection": "div[data-testid='dropdown-option-Ungroup selection']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.UseAsMask": "div[data-testid='dropdown-option-Use as mask']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.SetAsThumbnail": "div[data-testid='dropdown-option-Set as thumbnail']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.AddAutoLayout": "div[data-testid='dropdown-option-Add auto layout']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.CreateComponent": "div[data-testid='dropdown-option-Create component']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.ResetAllOverrides": "div[data-testid='dropdown-option-Reset all overrides']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.DetachInstance": "div[data-testid='dropdown-option-Detach instance']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.MainComponent": "div[data-testid='dropdown-option-Main component']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.BringToFront": "div[data-testid='dropdown-option-Bring to front']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.BringForward": "div[data-testid='dropdown-option-Bring forward']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.SendBackward": "div[data-testid='dropdown-option-Send backward']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.SendToBack": "div[data-testid='dropdown-option-Send to back']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.flipHorizontal": "div[data-testid='dropdown-option-Flip horizontal']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.flipVertical": "div[data-testid='dropdown-option-Flip vertical']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.Rotate180": "div[data-testid='dropdown-option-Rotate 180˚']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.Rotate90Left": "div[data-testid='dropdown-option-Rotate 90˚ left']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.Rotate90Right": "div[data-testid='dropdown-option-Rotate 90˚ right']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.FlattenSelection": "div[data-testid='dropdown-option-Flatten selection']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.OutlineStroke": "div[data-testid='dropdown-option-Outline stroke']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.BooleanGroups": "div[data-testid='dropdown-option-Boolean groups']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.RasterizeSelection": "div[data-testid='dropdown-option-Rasterize selection']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.ShowOrHideSelection": "div[data-testid='dropdown-option-Show/Hide selection']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.LockOrUnlockSelection": "div[data-testid='dropdown-option-Lock/Unlock selection']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.HideOtherLayers": "div[data-testid='dropdown-option-Hide other layers']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.CollapseLayers": "div[data-testid='dropdown-option-Collapse layers']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.RemoveFill": "div[data-testid='dropdown-option-Remove fill']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.RemoveStroke": "div[data-testid='dropdown-option-Remove stroke']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Object.SwapFillAndStroke": "div[data-testid='dropdown-option-Swap fill and stroke']>div[class^='multilevel_dropdown--name']",

    "fullscreenMenu.Vector": "div[data-testid='dropdown-option-Vector']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Text": "div[data-testid='dropdown-option-Text']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Arrange": "div[data-testid='dropdown-option-Arrange']>div[class^='multilevel_dropdown--name']",

    "fullscreenMenu.Plugins": "div[data-testid='dropdown-option-Plugins']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Plugins.ManagePlugins": "div[data-testid='dropdown-option-Manage plugins…']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Plugins.BrowsePluginsInCommunity": "div[data-testid='dropdown-option-Browse plugins in Community']>div[class^='multilevel_dropdown--name']",

    "fullscreenMenu.Integrations": "div[data-testid='dropdown-option-Integrations']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Preferences": "div[data-testid='dropdown-option-Preferences']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.Libraries": "div[data-testid='dropdown-option-Libraries']>div[class^='multilevel_dropdown--name']",

    "fullscreenMenu.GetDesktopApp": "div[data-testid='dropdown-option-Get desktop app']>div[class^='multilevel_dropdown--name']",
    "fullscreenMenu.HelpAndAccount": "div[data-testid='dropdown-option-Help and account']>div[class^='multilevel_dropdown--name']",


    "contextMenu.Copy": "div[data-testid='dropdown-option-Copy']>div[class^='multilevel_dropdown--name']",
    "contextMenu.PasteHere": "div[data-testid='dropdown-option-Paste here']>div[class^='multilevel_dropdown--name']",

    "contextMenu.CopyOrPasteAs": "div[data-testid='dropdown-option-Copy/Paste as']>div[class^='multilevel_dropdown--name']",
    "contextMenu.CopyOrPasteAs.CopyLink": "div[data-testid='dropdown-option-Copy  link']>div[class^='multilevel_dropdown--name']",

    "contextMenu.Ungroup": "div[data-testid='dropdown-option-Ungroup']>div[class^='multilevel_dropdown--name']",
    "contextMenu.Flatten": "div[data-testid='dropdown-option-Flatten']>div[class^='multilevel_dropdown--name']",

    "contextMenu.ShowOrHide": "div[data-testid='dropdown-option-Show/Hide']>div[class^='multilevel_dropdown--name']",
    "contextMenu.LockOrUnlock": "div[data-testid='dropdown-option-Lock/Unlock']>div[class^='multilevel_dropdown--name']",

    "contextMenu.ShowOrHideComments": "div[data-testid='dropdown-option-Show/Hide comments']>div[class^='multilevel_dropdown--name']",

    "contextMenu.CursorChat": "div[data-testid='dropdown-option-Cursor chat']>div[class^='multilevel_dropdown--name']"
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