<script lang="ts">
	import * as translator from "../translator"
	import { langStore } from "../store"
	import { onDestroy, onMount, createEventDispatcher } from "svelte"
	import { MenuTheme } from "../types"

	const dispath = createEventDispatcher()

	export let mode: MenuTheme

	let langInfoList = translator.langInfoList
	let openStatus = false
	let selectLangID = langStore.status || langInfoList[0]?.ID

	const toggleLanguageMenu = (status?: boolean) => {
		openStatus = status === undefined ? !openStatus : status
	}

	const closeLanguageMenu = () => {
		openStatus = false
	}

	const switchLanguage = (langID: string) => {
		selectLangID = langID
		langStore.status = langID
		toggleLanguageMenu()
		dispath("langChange", langID)
	}

	onMount(() => {
		console.log("Figma i18n menu loaded")

		window.addEventListener("click", closeLanguageMenu)
	})

	onDestroy(() => {
		window.removeEventListener("click", closeLanguageMenu)
	})
</script>

<div class="fi_lang_wrap">
	<span
		class={mode == MenuTheme.Light
			? "fi_lang-menu fi_theme-light"
			: "fi_lang-menu fi_theme-dark"}
	>
		<div
			class="fi_lang_toolbar"
			class:selected={openStatus}
			on:click|stopPropagation={() => {
				toggleLanguageMenu()
			}}
		>
			<span class="fi_svg-container">
				<svg
					class="icon"
					viewBox="0 0 1024 1024"
					version="1.1"
					xmlns="http://www.w3.org/2000/svg"
					p-id="2047"
					width="16"
					height="16"
				>
					<path
						d="M540.245333 645.888L426.410667 522.069333l1.365333-1.536a889.770667 889.770667 0 0 0 166.314667-322.048h131.413333V99.669333H411.562667V1.109333h-89.6v98.645334H7.850667v98.730666h500.906666a797.696 797.696 0 0 1-142.165333 263.936 778.581333 778.581333 0 0 1-103.594667-165.290666h-89.6c33.621333 82.176 78.677333 158.037333 133.546667 224.938666L78.848 769.706667l63.658667 69.973333 224.170666-246.613333 139.52 153.429333 34.133334-100.608z m252.501334-250.026667H703.061333l-201.813333 591.872h89.685333l50.261334-147.968h212.992l50.688 147.968h89.685333L792.746667 395.776zM675.242667 741.034667l72.618666-213.674667 72.704 213.674667H675.242667z"
						p-id="2048"
					/>
				</svg>
			</span>
			<div class="fi_chevron--chevronContainer">
				<span class="fi_svg-container">
					<svg
						class="svg"
						width="8"
						height="7"
						viewBox="0 0 8 7"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M3.646 5.354l-3-3 .708-.708L4 4.293l2.646-2.647.708.708-3 3L4 5.707l-.354-.353z"
							fill-rule="evenodd"
							fill-opacity="1"
							stroke="none"
						/>
					</svg>
				</span>
			</div>
		</div>

		{#if openStatus}
			<div class="fi_lang-container">
				{#each langInfoList as langInfo}
					<div
						class="fi_lang-container-list"
						on:click|stopPropagation={() =>
							switchLanguage(langInfo.ID)}
					>
						<span class="fi_container-icon">
							{#if selectLangID == langInfo.ID}
								<svg
									class="icon"
									viewBox="0 0 1024 1024"
									version="1.1"
									xmlns="http://www.w3.org/2000/svg"
									p-id="2047"
									width="10"
									height="10"
								>
									<path
										d="M441.6 812.8c-19.2 0-32-6.4-44.8-19.2L70.4 467.2c-25.6-25.6-25.6-64 0-89.6 25.6-25.6 64-25.6 89.6 0l281.6 281.6 441.6-428.8c25.6-25.6 64-25.6 89.6 0 25.6 25.6 25.6 64 0 89.6l-486.4 473.6C473.6 806.4 460.8 812.8 441.6 812.8z"
										p-id="2040"
									/>
								</svg>
							{/if}
						</span>
						<div class="fi_container-text">{langInfo.name}</div>
					</div>
				{/each}
			</div>
		{/if}
	</span>
</div>

<style lang="scss">
	.fi_lang-menu {
		.fi_lang_toolbar {
			height: 48px;
			width: 53px;
			cursor: default;
			display: flex;
			position: relative;
			.fi_svg-container {
				width: 30px;
				height: 100%;
				display: flex;
				align-items: center;
				justify-content: flex-end;
			}

			.fi_chevron--chevronContainer {
				width: 18px;
				flex: 0 0 auto;
				display: flex;

				.fi_svg-container {
					justify-content: center;
					transition: padding-top 0.15s;
				}
			}
		}

		.selected {
			.fi_chevron--chevronContainer {
				.fi_svg-container {
					padding-top: 3px;
				}
			}
		}

		.fi_lang_toolbar:hover .fi_chevron--chevronContainer .fi_svg-container {
			padding-top: 3px;
		}

		.fi_lang-container {
			width: 100px;
			position: absolute;
			right: 2px;
			top: 53px;
			padding: 10px 0;
			user-select: none;

			&::before {
				position: absolute;
				top: -10px;
				right: 6px;
				width: 0;
				height: 0;
				content: "";
				border: 5px solid transparent;
			}

			.fi_lang-container-list {
				width: 100%;
				height: 24px;
				display: flex;
				line-height: 24px;
				.fi_container-icon {
					width: 32px;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					font-weight: bold;
				}
				.fi_container-text {
					flex: 1;
					font-size: 12px;
					text-align: left;
				}
			}
		}
	}

	.fi_theme-dark {
		fill: #fff;
		.fi_lang_toolbar {
			&:hover {
				background: #000;
			}
		}
		.selected {
			background: rgb(24, 160, 251)!important;
		}
		.fi_lang-container {
			background: rgb(44, 44, 44);
			&::before {
				border-bottom: 5px solid rgb(44, 44, 44);
			}
			.fi_lang-container-list {
				&:hover {
					background: rgb(24, 160, 251);
				}
				.fi_container-text {
					color: #fff;
				}
			}
		}
	}
	.fi_theme-light {
		fill: rgba(0, 0, 0, 0.8);
		.fi_lang_toolbar {
			&:hover {
				background: #f0f0f0;
			}
		}
		.selected {
			background: rgb(151, 71, 255)!important;
			fill: #fff;
		}
		.fi_lang-container {
			background: #fff;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
			&::before {
				border-bottom: 5px solid rgb(44, 44, 44);
			}
			.fi_lang-container-list {
				&:hover {
					background: rgb(151, 71, 255);
					fill: #fff;
					.fi_container-text {
						color: #fff;
					}
				}
				.fi_container-text {
					color: rgba(0, 0, 0, 0.8);
				}
			}
		}
	}
</style>
