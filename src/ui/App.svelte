<script lang="ts">
	import * as translator from "../translator"
	import { langStore } from "../store"
	import { onDestroy, onMount } from "svelte"
	import Menu from "./Menu.svelte"

	const homeTag = "Home"
	const designTag = "Design"

	let langInfoList = translator.langInfoList
	let selectLangID = langStore.status || langInfoList[0]?.ID
	let menuIns = null
	let pageStatus = ""

	const getHomeTargetNode = () => {
		return document.querySelectorAll("div[class^='navbar--navbarContainer']>div ")[1]
	}
	const getDesignTargetNode = () => {
		return document.querySelector("div[class*='toolbar_view--rightButtonGroup']")
	}
	const getFigJamTargetNode = () => {
		return document.querySelectorAll("div[class^='toolbar_view--buttonGroup']")[2]
	}

	let observer = new MutationObserver(function (mutations) {
			const homeNode = getHomeTargetNode()
			const designNode = getDesignTargetNode()

			if((homeNode && pageStatus == designTag) || (designNode && pageStatus == homeTag)) {
				pageStatus = pageStatus == homeTag? designTag: homeTag
				if(menuIns && menuIns.$destroy) {
					menuIns.$destroy()
				}
				menuIns = new Menu({
					target: homeNode || designNode
				})
			}

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

		let currentNode = getHomeTargetNode()
		if(currentNode) {
			pageStatus = homeTag
		} else {
			currentNode = getDesignTargetNode()
			if(currentNode) {
				pageStatus = designTag
			}
		}

		menuIns = new Menu({
			target: currentNode
		})

		menuIns.$on("langChange", (event) => {
			selectLangID = event.detail
			translator.languageConverter([document.body], selectLangID)
		})

	})

	onDestroy(() => {
		observer.disconnect()

		if(menuIns && menuIns.$destroy) {
			menuIns.$destroy()
		}
	})
</script>