import { RunMode } from "../types"

interface MatchRule {
	[key: string]: string
}

const matchRuleDict: MatchRule = {
	"fullscreenMenu.BackToFiles": "a[data-onboarding-key='back-to-files']>span[class^='multilevel_dropdown--name']",

	"fullscreenMenu.QuickActions": "div[data-testid='dropdown-option-Quick actions…']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.File": "div[data-testid='dropdown-option-File']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.File.NewDesignFile": "div[data-testid='dropdown-option-New design file']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.File.NewFigJamFile": "div[data-testid='dropdown-option-New FigJam file']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.File.NewFromSketchFile": "div[data-testid='dropdown-option-New from Sketch file…']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.File.PlaceImage": "div[data-testid='dropdown-option-Place image...']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.File.ImportFromCSV": "div[data-testid='dropdown-option-Import from CSV…']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.File.SaveLocalCopy": "div[data-testid='dropdown-option-Save local copy…']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.File.SaveToVersionHistory": "div[data-testid='dropdown-option-Save to version history…']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.File.ShowVersionHistory": "div[data-testid='dropdown-option-Show version history']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.File.Export": "div[data-testid='dropdown-option-Export…']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.File.ExportFramesToPDF": "div[data-testid='dropdown-option-Export frames to PDF…']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.File.ExportAs": "div[data-testid='dropdown-option-Export as…']>div[class^='multilevel_dropdown--name']",

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
	"fullscreenMenu.View.ShowDotGrid": "div[data-testid='dropdown-option-Show dot grid']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.View.ResourceUse": "div[data-testid='dropdown-option-Resource use']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.View.ShowOrHideUI": "div[data-testid='dropdown-option-Show/Hide UI']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.View.MultiplayerCursors": "div[data-testid='dropdown-option-Multiplayer cursors']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.View.Panels": "div[data-testid='dropdown-option-Panels']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.View.Panels.OpenLayersPanel": "div[data-testid='dropdown-option-Open layers panel']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.View.Panels.OpenDesignPanel": "div[data-testid='dropdown-option-Open design panel']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.View.Panels.OpenPrototypePanel": "div[data-testid='dropdown-option-Open prototype panel']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.View.Panels.OpenInspectPanel": "div[data-testid='dropdown-option-Open inspect panel']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.View.Panels.ShowLeftSidebar": "div[data-testid='dropdown-option-Show left sidebar']>div[class^='multilevel_dropdown--name']",

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
	"fullscreenMenu.Object.RestoreDefaultThumbnail": "div[data-testid='dropdown-option-Restore default thumbnail']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Object.SetAsThumbnail": "div[data-testid='dropdown-option-Set as thumbnail']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Object.AddAutoLayout": "div[data-testid='dropdown-option-Add auto layout']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Object.CreateComponent": "div[data-testid='dropdown-option-Create component']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Object.ResetAllOverrides": "div[data-testid='dropdown-option-Reset all overrides']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Object.DetachInstance": "div[data-testid='dropdown-option-Detach instance']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.Object.MainComponent": "div[data-testid='dropdown-option-Main component']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Object.MainComponent.GoToMainComponent": "div[data-testid='dropdown-option-Go to main component']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Object.MainComponent.PushOverridesToMainComponent": "div[data-testid='dropdown-option-Push overrides to main component']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Object.MainComponent.RestoreMainComponent": "div[data-testid='dropdown-option-Restore main component']>div[class^='multilevel_dropdown--name']",

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
	"fullscreenMenu.Object.BooleanGroups.UnionSelection": "div[data-testid='dropdown-option-Union selection']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Object.BooleanGroups.SubtractSelection": "div[data-testid='dropdown-option-Subtract selection']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Object.BooleanGroups.IntersectSelection": "div[data-testid='dropdown-option-Intersect selection']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Object.BooleanGroups.ExcludeSelection": "div[data-testid='dropdown-option-Exclude selection']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.Object.RasterizeSelection": "div[data-testid='dropdown-option-Rasterize selection']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Object.ShowOrHideSelection": "div[data-testid='dropdown-option-Show/Hide selection']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Object.LockOrUnlockSelection": "div[data-testid='dropdown-option-Lock/Unlock selection']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Object.HideOtherLayers": "div[data-testid='dropdown-option-Hide other layers']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Object.CollapseLayers": "div[data-testid='dropdown-option-Collapse layers']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Object.RemoveFill": "div[data-testid='dropdown-option-Remove fill']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Object.RemoveStroke": "div[data-testid='dropdown-option-Remove stroke']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Object.SwapFillAndStroke": "div[data-testid='dropdown-option-Swap fill and stroke']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.Vector": "div[data-testid='dropdown-option-Vector']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Vector.JoinSelection": "div[data-testid='dropdown-option-Join selection']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Vector.SmoothJoinSelection": "div[data-testid='dropdown-option-Smooth join selection']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Vector.DeleteAndHealSelection": "div[data-testid='dropdown-option-Delete and heal selection']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.Text": "div[data-testid='dropdown-option-Text']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Bold": "div[data-testid='dropdown-option-Bold']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Italic": "div[data-testid='dropdown-option-Italic']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Underline": "div[data-testid='dropdown-option-Underline']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Strikethrough": "div[data-testid='dropdown-option-Strikethrough']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.CreateLink": "div[data-testid='dropdown-option-Create link']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.BulletedList": "div[data-testid='dropdown-option-Bulleted list']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.NumberedList": "div[data-testid='dropdown-option-Numbered list']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.Text.Alignment": "div[data-testid='dropdown-option-Alignment']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Alignment.TextAlignLeft": "div[data-testid='dropdown-option-Text align left']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Alignment.TextAlignCenter": "div[data-testid='dropdown-option-Text align center']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Alignment.TextAlignRight": "div[data-testid='dropdown-option-Text align right']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Alignment.TextAlignJustified": "div[data-testid='dropdown-option-Text align justified']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Alignment.TextAlignTop": "div[data-testid='dropdown-option-Text align top']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Alignment.TextAlignMiddle": "div[data-testid='dropdown-option-Text align middle']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Alignment.TextAlignBottom": "div[data-testid='dropdown-option-Text align bottom']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.Text.Adjust": "div[data-testid='dropdown-option-Adjust']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Adjust.IncreaseIndentation": "div[data-testid='dropdown-option-Increase indentation']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Adjust.DecreaseIndentation": "div[data-testid='dropdown-option-Decrease indentation']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Adjust.IncreaseFontSize": "div[data-testid='dropdown-option-Increase font size']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Adjust.DecreaseFontSize": "div[data-testid='dropdown-option-Decrease font size']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Adjust.IncreaseFontWeight": "div[data-testid='dropdown-option-Increase font weight']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Adjust.DecreaseFontWeight": "div[data-testid='dropdown-option-Decrease font weight']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Adjust.IncreaseLineHeight": "div[data-testid='dropdown-option-Increase line height']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Adjust.DecreaseLineHeight": "div[data-testid='dropdown-option-Decrease line height']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Adjust.IncreaseLetterSpacing": "div[data-testid='dropdown-option-Increase letter spacing']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Adjust.DecreaseLetterSpacing": "div[data-testid='dropdown-option-Decrease letter spacing']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.Text.Case": "div[data-testid='dropdown-option-Case']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Case.OriginalCase": "div[data-testid='dropdown-option-Original case']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Case.Uppercase": "div[data-testid='dropdown-option-Uppercase']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Text.Case.Lowercase": "div[data-testid='dropdown-option-Lowercase']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.Arrange": "div[data-testid='dropdown-option-Arrange']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Arrange.RoundToPixel": "div[data-testid='dropdown-option-Round to pixel']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Arrange.AlignLeft": "div[data-testid='dropdown-option-Align left']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Arrange.AlignHorizontalCenters": "div[data-testid='dropdown-option-Align horizontal centers']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Arrange.AlignRight": "div[data-testid='dropdown-option-Align right']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Arrange.AlignTop": "div[data-testid='dropdown-option-Align top']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Arrange.AlignVerticalCenters": "div[data-testid='dropdown-option-Align vertical centers']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Arrange.AlignBottom": "div[data-testid='dropdown-option-Align bottom']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Arrange.TidyUp": "div[data-testid='dropdown-option-Tidy up']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Arrange.PackHorizontal": "div[data-testid='dropdown-option-Pack horizontal']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Arrange.PackVertical": "div[data-testid='dropdown-option-Pack vertical']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Arrange.DistributeHorizontalSpacing": "div[data-testid='dropdown-option-Distribute horizontal spacing']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Arrange.DistributeVerticalSpacing": "div[data-testid='dropdown-option-Distribute vertical spacing']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Arrange.DistributeLeft": "div[data-testid='dropdown-option-Distribute left']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Arrange.DistributeHorizontalCenters": "div[data-testid='dropdown-option-Distribute horizontal centers']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Arrange.DistributeRight": "div[data-testid='dropdown-option-Distribute right']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Arrange.DistributeTop": "div[data-testid='dropdown-option-Distribute top']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Arrange.DistributeVerticalCenters": "div[data-testid='dropdown-option-Distribute vertical centers']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Arrange.DistributeBottom": "div[data-testid='dropdown-option-Distribute bottom']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.Plugins": "div[data-testid='dropdown-option-Plugins']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Plugins.RunLastPlugin": "div[data-testid='dropdown-option-Run last plugin']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Plugins.ManagePlugins": "div[data-testid='dropdown-option-Manage plugins…']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Plugins.BrowsePluginsInCommunity": "div[data-testid='dropdown-option-Browse plugins in Community']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Plugins.BrowsePlugins": "div[data-testid='dropdown-option-Browse plugins']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.Widgets": "div[data-testid='dropdown-option-Widgets']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Widgets.BrowseWidgets": "div[data-testid='dropdown-option-Browse widgets']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Widgets.SelectAllWidgets": "div[data-testid='dropdown-option-Select all widgets']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.Integrations": "div[data-testid='dropdown-option-Integrations']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Integrations.Dribbble": "div[data-testid='dropdown-option-Dribbble']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.Preferences": "div[data-testid='dropdown-option-Preferences']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.SnapToGeometry": "div[data-testid='dropdown-option-Snap to geometry']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.SnapToObjects": "div[data-testid='dropdown-option-Snap to objects']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.SnapToDotGrid": "div[data-testid='dropdown-option-Snap to dot grid']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.SnapToPixelGrid": "div[data-testid='dropdown-option-Snap to pixel grid']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.KeepToolSelectedAfterUse": "div[data-testid='dropdown-option-Keep tool selected after use']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.HighlightLayersOnHover": "div[data-testid='dropdown-option-Highlight layers on hover']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.RenameDuplicatedLayers": "div[data-testid='dropdown-option-Rename duplicated layers']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.ShowDimensionsOnObjects": "div[data-testid='dropdown-option-Show dimensions on objects']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.HideCanvasUIDuringChanges": "div[data-testid='dropdown-option-Hide canvas UI during changes']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.KeyboardZoomsIntoSelection": "div[data-testid='dropdown-option-Keyboard zooms into selection']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.SubstituteSmartQuotes": "div[data-testid='dropdown-option-Substitute smart quotes']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.ShowGoogleFonts": "div[data-testid='dropdown-option-Show Google Fonts']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.FlipObjectsWhileResizing": "div[data-testid='dropdown-option-Flip objects while resizing']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.InvertZoomDirection": "div[data-testid='dropdown-option-Invert zoom direction']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.UseNumberKeysForOpacity": "div[data-testid='dropdown-option-Use number keys for opacity']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.ShakeCursorForHighFive": "div[data-testid='dropdown-option-Shake cursor for high five']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.OpenLinksInDesktopApp": "div[data-testid='dropdown-option-Open links in desktop app']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.NudgeAmount": "div[data-testid='dropdown-option-Nudge amount…']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Preferences.ShowTemplatesForNewFiles": "div[data-testid='dropdown-option-Show templates for new files']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.Libraries": "div[data-testid='dropdown-option-Libraries']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.GetDesktopApp": "div[data-testid='dropdown-option-Get desktop app']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.OpenInDesktopApp": "div[data-testid='dropdown-option-Open in desktop app']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.HelpAndAccount": "div[data-testid='dropdown-option-Help and account']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.HelpAndAccount.HelpPage": "div[data-testid='dropdown-option-Help page']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.HelpAndAccount.KeyboardShortcuts": "div[data-testid='dropdown-option-Keyboard shortcuts']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.HelpAndAccount.SupportForum": "div[data-testid='dropdown-option-Support forum']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.HelpAndAccount.VideoTutorials": "div[data-testid='dropdown-option-Video tutorials']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.HelpAndAccount.ReleaseNotes": "div[data-testid='dropdown-option-Release notes']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.HelpAndAccount.OpenFontSettings": "div[data-testid='dropdown-option-Open font settings']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.HelpAndAccount.LegalSummary": "div[data-testid='dropdown-option-Legal summary']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.HelpAndAccount.AccountSettings": "div[data-testid='dropdown-option-Account settings']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.HelpAndAccount.LogOut": "div[data-testid='dropdown-option-Log out']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.PublishStylesAndComponents": "div[data-testid='dropdown-option-Publish styles and components']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Rename": "div[data-testid='dropdown-option-Rename']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.MoveToProject": "div[data-testid='dropdown-option-Move to project…']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Delete": "div[data-testid='dropdown-option-Delete…']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.ZoomTo50": "div[data-testid='dropdown-option-Zoom to 50%']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.ZoomTo200": "div[data-testid='dropdown-option-Zoom to 200%']>div[class^='multilevel_dropdown--name']",
	"fullscreenMenu.Disabled": "div[data-testid='dropdown-option-Disabled']>div[class^='multilevel_dropdown--name']",

	"fullscreenMenu.Tooltip.MainMenu": "div[class*='toolbar_view--toolbar']>div[data-tooltip='main-menu']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.MoveTools": "div[class*='toolbar_view--toolbar'] div[data-tooltip='Move tools']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.SetToolDefault": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-default']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.SetToolScale": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-scale']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.RegionTools": "div[class*='toolbar_view--toolbar'] div[data-tooltip='Region tools']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.SetToolFrame": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-frame']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.SetToolSlice": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-slice']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.ShapeTools": "div[class*='toolbar_view--toolbar'] div[data-tooltip='Shape tools']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.SetToolRectangle": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-rectangle']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.SetToolLine": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-line']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.SetToolArrow": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-arrow']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.SetToolEllipse": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-ellipse']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.SetToolRegularPolygon": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-regular-polygon']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.SetToolStar": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-star']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.DrawingTools": "div[class*='toolbar_view--toolbar'] div[data-tooltip='Drawing tools']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.SetToolPen": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-pen']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.SetToolPencil": "div[class*='toolbar_view--toolbar'] div[data-tooltip='set-tool-pencil']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.SetToolText": "div[class*='toolbar_view--toolbar'] span[data-tooltip='set-tool-type']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.SetToolHand": "div[class*='toolbar_view--toolbar'] span[data-tooltip='set-tool-hand']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.SetToolComments": "div[class*='toolbar_view--toolbar'] span[data-tooltip='set-tool-comments']->attr:data-tooltip,data-tooltip-type=text",
	"fullscreenMenu.Tooltip.Present": "div[class*='toolbar_view--toolbar'] div[data-tooltip='Present']->attr:data-tooltip",

	"toolbarView.fileName.folderName.Drafts": "XPATH://div[contains(@class, 'filename_view--folder')]//div[text()='Drafts']",

	"toolbarView.moveFlyout.flyout.toolDefault": "a[data-testid='toolbarView.moveFlyout.flyout.toolDefault']>div[class^='action_option--text']",
	"toolbarView.moveFlyout.flyout.toolScale": "a[data-testid='toolbarView.moveFlyout.flyout.toolScale']>div[class^='action_option--text']",

	"toolbarView.regionFlyout.flyout.toolFrame": "a[data-testid='toolbarView.regionFlyout.flyout.toolFrame']>div[class^='action_option--text']",
	"toolbarView.regionFlyout.flyout.toolSlice": "a[data-testid='toolbarView.regionFlyout.flyout.toolSlice']>div[class^='action_option--text']",

	"toolbarView.shapeFlyout.flyout.toolShapeRectangle": "a[data-testid='toolbarView.shapeFlyout.flyout.toolShapeRectangle']>div[class^='action_option--text']",
	"toolbarView.shapeFlyout.flyout.toolShapeLine": "a[data-testid='toolbarView.shapeFlyout.flyout.toolShapeLine']>div[class^='action_option--text']",
	"toolbarView.shapeFlyout.flyout.toolShapeArrow": "a[data-testid='toolbarView.shapeFlyout.flyout.toolShapeArrow']>div[class^='action_option--text']",
	"toolbarView.shapeFlyout.flyout.toolShapeEllipse": "a[data-testid='toolbarView.shapeFlyout.flyout.toolShapeEllipse']>div[class^='action_option--text']",
	"toolbarView.shapeFlyout.flyout.toolShapePolygon": "a[data-testid='toolbarView.shapeFlyout.flyout.toolShapePolygon']>div[class^='action_option--text']",
	"toolbarView.shapeFlyout.flyout.toolShapeStar": "a[data-testid='toolbarView.shapeFlyout.flyout.toolShapeStar']>div[class^='action_option--text']",
	"toolbarView.shapeFlyout.flyout.toolPlaceImage": "a[data-testid='toolbarView.shapeFlyout.flyout.toolPlaceImage']>div[class^='action_option--text']",

	"toolbarView.penFlyout.flyout.toolPen": "a[data-testid='toolbarView.penFlyout.flyout.toolPen']>div[class^='action_option--text']",
	"toolbarView.penFlyout.flyout.toolPencil": "a[data-testid='toolbarView.penFlyout.flyout.toolPencil']>div[class^='action_option--text']",

	"toolbarView.Share": "div[data-testid='multiplayer-toolbar-share-button']",

	"toolbarView.CursorChat": "div[data-testid='dropdown-option-Cursor chat']>div[class^='multilevel_dropdown--name']",
	"toolbarView.Stamp": "div[data-testid='dropdown-option-Stamp']>div[class^='multilevel_dropdown--name']",
	"toolbarView.Emote": "div[data-testid='dropdown-option-Emote']>div[class^='multilevel_dropdown--name']",

	"toolbarView.Overflow.Emote": "XPATH://a[@data-testid='overflow.emote']//div[contains(@class,'toolbar_view--overflowInner')]//text()[1]",
	"toolbarView.Overflow.Stamp": "XPATH://a[@data-testid='overflow.stamp']//div[contains(@class,'toolbar_view--overflowInner')]//text()[1]",
	"toolbarView.Overflow.CursorChat": "XPATH://a[@data-testid='overflow.chat']//div[contains(@class,'toolbar_view--overflowInner')]//text()[1]",
	"toolbarView.Overflow.HighFive": "XPATH://a[@data-testid='overflow.highFive']//div[contains(@class,'toolbar_view--overflowInner')]//text()[1]",
	"toolbarView.Overflow.Timer": "XPATH://a[@data-testid='overflow.timer']//div[contains(@class,'toolbar_view--overflowInner')]//text()[1]",

	"toolbarView.Tooltip.Collaborate": "div[class*='toolbar_view--toolbar'] div[data-tooltip='whiteboard-overflow-menu']->attr:data-tooltip,data-tooltip-type=text",
	"toolbarView.Tooltip.ZoomOut": "div[class*='toolbar_view--toolbar'] span[data-tooltip='zoom-out']->attr:data-tooltip,data-tooltip-type=text",
	"toolbarView.Tooltip.ZoomIn": "div[class*='toolbar_view--toolbar'] span[data-tooltip='zoom-in']->attr:data-tooltip,data-tooltip-type=text",
	"toolbarView.Tooltip.ZoomOrViewOptions": "div[class*='toolbar_view--toolbar'] div[data-tooltip='Zoom/view options']->attr:data-tooltip",

	"delightfulToolbar.MoveTool": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-default-desc']->attr:data-tooltip,data-tooltip-type=text",
	"delightfulToolbar.HandTool": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-hand']->attr:data-tooltip,data-tooltip-type=text",
	"delightfulToolbar.Marker": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-marker']->attr:data-tooltip,data-tooltip-type=text",
	"delightfulToolbar.Highlighter": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-highlighter']->attr:data-tooltip,data-tooltip-type=text",
	"delightfulToolbar.Eraser": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-eraser']->attr:data-tooltip,data-tooltip-type=text",
	"delightfulToolbar.Thin": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Thin']->attr:data-tooltip",
	"delightfulToolbar.Thick": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Thick']->attr:data-tooltip",
	"delightfulToolbar.Charcoal": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Charcoal']->attr:data-tooltip",
	"delightfulToolbar.Red": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Red']->attr:data-tooltip",
	"delightfulToolbar.Yellow": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Yellow']->attr:data-tooltip",
	"delightfulToolbar.Green": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Green']->attr:data-tooltip",
	"delightfulToolbar.Blue": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Blue']->attr:data-tooltip",
	"delightfulToolbar.Violet": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Violet']->attr:data-tooltip",
	"delightfulToolbar.Brown": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Brown']->attr:data-tooltip",
	"delightfulToolbar.White": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='White']->attr:data-tooltip",
	"delightfulToolbar.Square": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-square']->attr:data-tooltip,data-tooltip-type=text,no-track",
	"delightfulToolbar.Ellipse": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-ellipse']->attr:data-tooltip,data-tooltip-type=text,no-track",
	"delightfulToolbar.RoundedRectangle": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-rounded-rectangle']->attr:data-tooltip,data-tooltip-type=text,no-track",
	"delightfulToolbar.Diamond": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-diamond']->attr:data-tooltip,data-tooltip-type=text,no-track",
	"delightfulToolbar.TriangleUp": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-triangle-up']->attr:data-tooltip,data-tooltip-type=text,no-track",
	"delightfulToolbar.TriangleDown": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-triangle-down']->attr:data-tooltip,data-tooltip-type=text,no-track",
	"delightfulToolbar.ParallelogramRight": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-parallelogram-right']->attr:data-tooltip,data-tooltip-type=text,no-track",
	"delightfulToolbar.ParallelogramLeft": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-parallelogram-left']->attr:data-tooltip,data-tooltip-type=text,no-track",
	"delightfulToolbar.Cylinder": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-eng-database']->attr:data-tooltip,data-tooltip-type=text,no-track",
	"delightfulToolbar.HorizontalCylinder": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-eng-queue']->attr:data-tooltip,data-tooltip-type=text,no-track",
	"delightfulToolbar.File": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-eng-file']->attr:data-tooltip,data-tooltip-type=text,no-track",
	"delightfulToolbar.Folder": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-shape-whiteboard-eng-folder']->attr:data-tooltip,data-tooltip-type=text,no-track",
	"delightfulToolbar.Options.Square": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Square']->attr:data-tooltip",
	"delightfulToolbar.Options.Ellipse": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Ellipse']->attr:data-tooltip",
	"delightfulToolbar.Options.RoundedRectangle": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Rounded rectangle']->attr:data-tooltip",
	"delightfulToolbar.Options.Diamond": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Diamond']->attr:data-tooltip",
	"delightfulToolbar.Options.Triangle": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Triangle']->attr:data-tooltip",
	"delightfulToolbar.Options.DownwardPointingTriangle": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Downward-pointing triangle']->attr:data-tooltip",
	"delightfulToolbar.Options.RightLeaningParallelogram": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Right-leaning parallelogram']->attr:data-tooltip",
	"delightfulToolbar.Options.LeftLeaningParallelogram": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Left-leaning parallelogram']->attr:data-tooltip",
	"delightfulToolbar.Options.Cylinder": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Cylinder']->attr:data-tooltip",
	"delightfulToolbar.Options.HorizontalCylinder": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Horizontal cylinder']->attr:data-tooltip",
	"delightfulToolbar.Options.File": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='File']->attr:data-tooltip",
	"delightfulToolbar.Options.Folder": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Folder']->attr:data-tooltip",
	"delightfulToolbar.Sticky": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-sticky']->attr:data-tooltip,data-tooltip-type=text",
	"delightfulToolbar.Text": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-type']->attr:data-tooltip,data-tooltip-type=text",
	"delightfulToolbar.Connector": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-connector-elbowed']->attr:data-tooltip,data-tooltip-type=text,no-track",
	"delightfulToolbar.Line": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-connector-straight']->attr:data-tooltip,data-tooltip-type=text,no-track",
	"delightfulToolbar.Options.Connector": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Connector']->attr:data-tooltip",
	"delightfulToolbar.Options.StraightLine": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='Straight line']->attr:data-tooltip",
	"delightfulToolbar.Stamp": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='set-tool-stamp']->attr:data-tooltip,data-tooltip-type=text",
	"delightfulToolbar.More": "div[class*='delightful_toolbar--delightfulToolbarContainer'] div[data-tooltip='browse-all-resources-dlt']->attr:data-tooltip,data-tooltip-type=text",

	"contextMenu.Copy": "div[data-testid='dropdown-option-Copy']>div[class^='multilevel_dropdown--name']",
	"contextMenu.Paste": "div[data-testid='dropdown-option-Paste']>div[class^='multilevel_dropdown--name']",
	"contextMenu.PasteHere": "div[data-testid='dropdown-option-Paste here']>div[class^='multilevel_dropdown--name']",

	"contextMenu.CopyOrPasteAs": "div[data-testid='dropdown-option-Copy/Paste as']>div[class^='multilevel_dropdown--name']",
	"contextMenu.CopyOrPasteAs.CopyLink": "div[data-testid='dropdown-option-Copy  link']>div[class^='multilevel_dropdown--name']",

	"contextMenu.SelectLayer": "div[data-testid='dropdown-option-Select layer']>div[class^='multilevel_dropdown--name']",
	"contextMenu.MoveToPage": "div[data-testid='dropdown-option-Move to page']>div[class^='multilevel_dropdown--name']",

	"contextMenu.Ungroup": "div[data-testid='dropdown-option-Ungroup']>div[class^='multilevel_dropdown--name']",
	"contextMenu.Flatten": "div[data-testid='dropdown-option-Flatten']>div[class^='multilevel_dropdown--name']",

	"contextMenu.ShowOrHide": "div[data-testid='dropdown-option-Show/Hide']>div[class^='multilevel_dropdown--name']",
	"contextMenu.LockOrUnlock": "div[data-testid='dropdown-option-Lock/Unlock']>div[class^='multilevel_dropdown--name']",

	"contextMenu.ShowOrHideComments": "div[data-testid='dropdown-option-Show/Hide comments']>div[class^='multilevel_dropdown--name']",

	"pagesPanel.Sidebar.Tab": "div[class*='pages_panel--tabsHeader']>div[class*='pages_panel--tab']->attr:data-label",
	"pagesPanel.Sidebar.AssetsTab": "div[class*='pages_panel--tabsHeader']>div[class*='pages_panel--assetsTab']>div[class*='pages_panel--tab']->attr:data-label",

	"pagesPanel.Sidebar.Pages": "div[class*='pages_panel--pagesHeaderContainer']>div[class*='pages_panel--pagesHeaderText']",
	"pagesPanel.Sidebar.Pages.CopyLinkToPage": "div[data-testid='dropdown-option-Copy link to page']>div[class^='multilevel_dropdown--name']",
	"pagesPanel.Sidebar.Pages.DeletePage": "div[data-testid='dropdown-option-Delete page']>div[class^='multilevel_dropdown--name']",
	"pagesPanel.Sidebar.Pages.RenamePage": "div[data-testid='dropdown-option-Rename page']>div[class^='multilevel_dropdown--name']",
	"pagesPanel.Sidebar.Pages.DuplicatePage": "div[data-testid='dropdown-option-Duplicate page']>div[class^='multilevel_dropdown--name']",

	"pagesPanel.Sidebar.AddNewPage": "div[class*='pages_panel--pagesHeaderContainer'] span[aria-label='Add new page']->attr:data-tooltip",
	"pagesPanel.Sidebar.Search": "div[class*='component_sidebar--headerContainer'] input[class*='search--searchInput__DEPRECATED']->attr:placeholder",
	"pagesPanel.Sidebar.ShowAsList": "div[class*='component_sidebar--headerContainer'] span[aria-label='Show as list']->attr:data-tooltip",
	"pagesPanel.Sidebar.ShowAsGrid": "div[class*='component_sidebar--headerContainer'] span[aria-label='Show as grid']->attr:data-tooltip",
	"pagesPanel.Sidebar.TeamLibrary": "div[class*='component_sidebar--headerContainer'] span[aria-label='Team library']->attr:data-tooltip",

	"pagesPanel.Sidebar.Components": "XPATH://div[contains(@class, 'component_sidebar--container')]//div[text()='Components']",
	"pagesPanel.Sidebar.Components.FirstInfoText": "XPATH://div[contains(@class, 'component_sidebar--container')]//div[contains(@class, 'empty_states--emptyStateContent')][1]//div[contains(@class, 'empty_states--emptyStateText')]//text()[1]",
	"pagesPanel.Sidebar.Components.FirstInfoLink": "XPATH://div[contains(@class, 'component_sidebar--container')]//div[contains(@class, 'empty_states--emptyStateContent')][1]//div[contains(@class, 'empty_states--emptyStateText')]//a",
	"pagesPanel.Sidebar.Components.SecondInfoText": "XPATH://div[contains(@class, 'component_sidebar--container')]//div[contains(@class, 'empty_states--emptyStateContent')][2]//div[contains(@class, 'empty_states--emptyStateText')]//text()[1]",
	"pagesPanel.Sidebar.Components.SecondInfoLink": "XPATH://div[contains(@class, 'component_sidebar--container')]//div[contains(@class, 'empty_states--emptyStateContent')][2]//div[contains(@class, 'empty_states--emptyStateText')]//a",

	"propertiesPanel.TabsHeader.Design": "XPATH://div[contains(@class, 'properties_panel--tabsHeader')]//div[text()='Design']->attr:data-label",
	"propertiesPanel.TabsHeader.Prototype": "XPATH://div[contains(@class, 'properties_panel--tabsHeader')]//div[text()='Prototype']->attr:data-label",
	"propertiesPanel.TabsHeader.Inspect": "XPATH://div[contains(@class, 'properties_panel--tabsHeader')]//div[text()='Inspect']->attr:data-label",

	"navbar.Community": "XPATH://div[@data-testid='dropdown-option-Community']//div[text()='Community']",
	"navbar.Search": "XPATH://div[contains(@class, 'navbar--navbarContainer')]//input[contains(@class, 'search--searchInput')]->attr:placeholder",
	"navbar.Notifications": "XPATH://div[contains(@class, 'user_notifications_dropdown--header')]//div[text()='Notifications']",
	"navbar.InternalProfile": "div[data-testid='dropdown-option-Internal profile']>div[class^='multilevel_dropdown--name']",
	"navbar.Settings": "div[data-testid='dropdown-option-Settings']>div[class^='multilevel_dropdown--name']",
	"navbar.AddAccount": "div[data-testid='dropdown-option-Add account']>div[class^='multilevel_dropdown--name']",

	"sidebar.Recents": "XPATH://div[contains(@class, 'sidebar--navContent')]//span[text()='Recents']",
	"sidebar.Drafts": "XPATH://div[contains(@class, 'sidebar--navContent')]//span[text()='Drafts']",
	"sidebar.ExploreCommunity": "XPATH://div[contains(@class, 'sidebar--navContent')]//a[contains(@class, 'community_hub_link')]//span[text()='Explore community']",
	"sidebar.TeamProject": "XPATH://div[contains(@class, 'sidebar--navContent')]//div[contains(@class, 'nav_section--orderedFolders')]//span[text()='Team project']",
	"sidebar.CreateNewTeam": "XPATH://div[contains(@class, 'sidebar--navContent')]//div[contains(@class, 'new_team_link--createNewTeamLink')]//div[text()='Create new team']",

	"fileBrowserView.RecentlyViewed": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'desktop_tool_bar--pageViewToolBarContainer')]//span[text()='Recently viewed']",
	"fileBrowserView.Drafts": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'desktop_tool_bar--pageViewToolBarContainer')]//span[text()='Drafts']",
	"fileBrowserView.Deleted": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'desktop_tool_bar--pageViewToolBarContainer')]//span[text()='Deleted']",
	"fileBrowserView.NewDesignFile": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'new_file_creation_topbar--newFileTilesContainer')]//div[@data-testid='new-design-file-button']//text()[1]",
	"fileBrowserView.NewDesignFile.Desc": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'new_file_creation_topbar--newFileTilesContainer')]//div[@data-testid='new-design-file-button']//div",
	"fileBrowserView.NewFigJamFile": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'new_file_creation_topbar--newFileTilesContainer')]//div[@data-testid='new-whiteboard-file-button']//text()[1]",
	"fileBrowserView.NewFigJamFile.Desc": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'new_file_creation_topbar--newFileTilesContainer')]//div[@data-testid='new-whiteboard-file-button']//div",
	"fileBrowserView.ImportFile": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'new_file_creation_topbar--importFileTile')]//div[contains(@class, 'new_file_creation_topbar--tileText')]//text()[1]",
	"fileBrowserView.ImportFile.Desc": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'new_file_creation_topbar--importFileTile')]//div[contains(@class, 'new_file_creation_topbar--tileText')]//div",

	"fileBrowserView.Filter": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'tile_sort_filter--dropdownCollectionContainer')]//div[text()='Filter:']",
	// "fileBrowserView.AllFiles": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[contains(@class, 'tile_sort_filter--dropdownCollectionContainer')]//span[text()='All files']->attr:text-content,no-track",
	"fileBrowserView.Filter.Select.AllFiles": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='All files']",
	"fileBrowserView.Filter.Select.DesignFiles": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Design files']",
	"fileBrowserView.Filter.Select.FigJamFiles": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='FigJam Files']",
	"fileBrowserView.Filter.Select.Prototypes": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Prototypes']",

	"fileBrowserView.Sort": "XPATH://div[contains(@class, 'file_browser_view--fileBrowserPageViewContainer')]//div[text()='Sort:']",
	"fileBrowserView.Sort.Select.SortBy": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Sort by']",
	"fileBrowserView.Sort.Select.Alphabetical": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Alphabetical']",
	"fileBrowserView.Sort.Select.DateCreated": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Date created']",
	"fileBrowserView.Sort.Select.LastViewed": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Last viewed']",
	"fileBrowserView.Sort.Select.LastModified": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Last modified']",
	"fileBrowserView.Sort.Select.Order": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Order']",
	"fileBrowserView.Sort.Select.OldestFirst": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Oldest first']",
	"fileBrowserView.Sort.Select.NewestFirst": "XPATH://div[contains(@class, 'scroll_container--innerScrollContainer')]//a//text()[string()='Newest first']",

	"fileBrowserView.ShowAsGrid": "div[class*='file_browser_page_view--contentContainer'] span[data-tooltip='Show as grid']->attr:data-tooltip",
	"fileBrowserView.ShowAsList": "div[class*='file_browser_page_view--contentContainer'] span[data-tooltip='Show as list']->attr:data-tooltip",
}

type SelectType = "CSS" | "XPATH"
type ControlType = "Text" | "Attr"

interface AttrNode {
	Key: string
	Value: string
}

interface MatchElement {
	[key: string]: {
		type: ControlType
		node: Element
		attrList: AttrNode[]
	}
}

interface OperationRule {
	selectType: SelectType
	selectRule: string
	controlType: ControlType
	attrList: AttrNode[]
}

const parseOperationRuleFromMatchRule = function (matchRule: string): OperationRule {
	let rule: OperationRule = {
		selectType: "CSS",
		selectRule: "",
		controlType: "Text",
		attrList: [],
	}

	if (matchRule.startsWith("XPATH:")) {
		rule.selectType = "XPATH"
		matchRule = matchRule.replace("XPATH:", "")
	}

	if (matchRule.includes("->attr:")) {
		rule.controlType = "Attr"
		let ruleArr = matchRule.split("->attr:")
		if (ruleArr.length == 2) {
			rule.selectRule = ruleArr[0]
			let attrNodeStrList = ruleArr[1].split(",")
			for (let i = 0; i < attrNodeStrList.length; i++) {
				const attrNodeStr = attrNodeStrList[i]
				let attrNode: AttrNode = {
					Key: "",
					Value: "",
				}
				let attrS = attrNodeStr.split("=")
				attrNode.Key = attrS[0]
				if (attrS.length == 2) {
					attrNode.Value = attrS[1]
				}
				rule.attrList.push(attrNode)
			}
		}
	} else {
		rule.selectRule = matchRule
	}

	return rule
}

export const getTargetElement = function (originElements: Element[], runMode: RunMode): MatchElement {
	let matchElement: MatchElement = {}

	for (const element of originElements) {
		if (!element.querySelector) {
			continue
		}

		if (runMode == RunMode.Dev) {
			console.log(element.innerHTML)
		}

		for (const elementName in matchRuleDict) {
			if (!Object.prototype.hasOwnProperty.call(matchRuleDict, elementName)) {
				continue
			}

			let rule = parseOperationRuleFromMatchRule(matchRuleDict[elementName])
			let target: Element

			if (rule.selectType == "XPATH") {
				target = <Element>document.evaluate(rule.selectRule, <Element>element).iterateNext()
			} else {
				target = (<Element>element).querySelector(rule.selectRule)
			}

			if (!target) {
				target = (<Element>element).querySelector(`*[figma-i18n-id='${elementName}']`)
			}

			if (target && (target?.nodeType == 1 || target?.nodeType == 3)) {
				matchElement[elementName] = {
					type: rule.controlType,
					node: target,
					attrList: rule.attrList,
				}
			}
		}
	}

	return matchElement
}
