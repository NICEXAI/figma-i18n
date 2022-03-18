import App from './ui/App.svelte'
import {RunMode} from "./types"


const app = new App({
	target: document.body,
	props: {
		runMode: RunMode.Dev
	}
});

export default app;