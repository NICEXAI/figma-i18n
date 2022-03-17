<script lang="ts">
	import * as translator from "../translator"
	import { langStore } from "../store"
	import { onDestroy, onMount } from "svelte"
	import { RunMode, MenuTheme } from "../types"
	import Menu from "./Menu.svelte"

	export let runMode: RunMode

	let langInfoList = translator.langInfoList
	let selectLangID = langStore.status || langInfoList[0]?.ID
	let menuIns = null
	let mode = MenuTheme.Dark

	const getHomeTargetNode = () => {
		return document.querySelectorAll("div[class^='navbar--navbarContainer']>div ")[1]
	}
	const getEditorTargetNode = () => {
		return document.querySelector("div[class*='toolbar_view--rightButtonGroup']")
	}
	const getMenuTargetNode = () => {
		return document.querySelector("div[class='fi_lang_wrap']")
	}

	const isDesignPage = () => {
		return !!document.querySelector("div[class*='delightful_toolbar--delightfulToolbarMask']")
	}

	const initMenuController = () => {
		const menuNode = getMenuTargetNode()
		let curMode = isDesignPage() ? MenuTheme.Light : MenuTheme.Dark
		if (menuNode && mode == curMode) {
			return
		}

		if (menuIns && menuIns.$destroy) {
			menuIns.$destroy()
		}

		mode = curMode

		menuIns = new Menu({
			target: getHomeTargetNode() || getEditorTargetNode(),
			props: {
				mode,
			},
		})

		menuIns.$on("langChange", event => {
			selectLangID = event.detail
			translator.languageConverter([document.body], selectLangID, runMode)
		})
	}

	let observer = new MutationObserver(function (mutations) {
		initMenuController()

		let originElements: Element[] = []

		for (const mutation of mutations) {
			const nodes = mutation.addedNodes
			if (!nodes || nodes.length == 0) {
				continue
			}

			nodes.forEach(node => {
				originElements.push(<Element>node)
			})
		}

		// translator.languageConverter(originElements, selectLangID)
		translator.languageConverter([document.body], selectLangID, runMode)
	})

	onMount(() => {
		console.log("Figma i18n loaded")

		translator.languageConverter([document.body], selectLangID, runMode)

		observer.observe(document.body, {
			childList: true,
			subtree: true,
			characterData: true,
		})

		initMenuController()
	})

	onDestroy(() => {
		observer.disconnect()

		if (menuIns && menuIns.$destroy) {
			menuIns.$destroy()
		}
	})
</script>
