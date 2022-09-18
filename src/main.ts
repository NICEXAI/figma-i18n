import App from './ui/App.svelte'
import {RunMode} from "./types"


const app = new App({
	target: document.body,
	props: {
		runMode: RunMode.Prod
	}
});

export default app;