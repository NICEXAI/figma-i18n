import App from './ui/App.svelte';

const app = new App({
	target: document.querySelector("div[class*='toolbar_view--rightButtonGroup']"),
});

export default app;