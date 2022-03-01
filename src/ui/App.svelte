<script lang="ts">
	import * as translator from "../translator"
	import { langStore } from "../store"
	import { onDestroy, onMount } from "svelte"
	import Menu from "./Menu.svelte"

	let langInfoList = translator.langInfoList
	let selectLangID = langStore.status || langInfoList[0]?.ID
	let menuIns = null

	const getHomeTargetNode = () => {
		return document.querySelectorAll(
			"div[class^='navbar--navbarContainer']>div "
		)[1]
	}
	const getEditorTargetNode = () => {
		return document.querySelector(
			"div[class*='toolbar_view--rightButtonGroup']"
		)
	}
	const getMenuTargetNode = () => {
		return document.querySelector("div[class='fi_lang_wrap']")
	}

	const initMenuController = () => {
		const menuNode = getMenuTargetNode()
		if(menuNode) {
			return
		}

		if (menuIns && menuIns.$destroy) {
			menuIns.$destroy()
		}

		menuIns = new Menu({
			target: getHomeTargetNode() || getEditorTargetNode(),
		})

		menuIns.$on("langChange", event => {
			selectLangID = event.detail
			translator.languageConverter([document.body], selectLangID)
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

		translator.languageConverter(originElements, selectLangID)
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
