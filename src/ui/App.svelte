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
		
		const homeTarget = getHomeTargetNode()
		const editorTarget = getEditorTargetNode()

		if (homeTarget || editorTarget) {
			menuIns = new Menu({
				target: homeTarget || editorTarget,
				props: {
					mode,
				},
			})

			menuIns.$on("langChange", event => {
				selectLangID = event.detail
				translator.languageConverter([document.body], selectLangID)
			})
		}
	}

	let observer = new MutationObserver(function (mutations) {
		initMenuController()

		if (runMode == RunMode.Dev) {
			for (const mutation of mutations) {
				const nodes = mutation.addedNodes
				if (!nodes || nodes.length == 0) {
					continue
				}

				nodes.forEach(node => {
					let element = <Element>node
					console.log(element.innerHTML)
				})
			}
		}

		translator.languageConverter([document.body], selectLangID)
	})

	onMount(() => {
		console.log("Figma i18n loaded")

		translator.languageConverter([document.body], selectLangID)

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
