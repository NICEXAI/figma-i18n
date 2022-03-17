import svelte from 'rollup-plugin-svelte';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import sveltePreprocess from 'svelte-preprocess';
import typescript from '@rollup/plugin-typescript';
// import css from 'rollup-plugin-css-only';
import postcss from 'rollup-plugin-postcss'
import banner from 'rollup-plugin-banner2'
import {version, description, author} from "./package.json"

const production = !process.env.ROLLUP_WATCH;
const metaInfo = {
	"name": "Figma i18n",
	"namespace": "https://github.com/NICEXAI",
	"version": version,
	"description": description,
	"encoding": "utf-8",
	"author": author,
	"homepage": "https://github.com/NICEXAI/figma-i18n",
	"supportURL": "https://github.com/NICEXAI/figma-i18n/issues",
	"updateURL": "https://github.com/NICEXAI/figma-i18n/blob/main/dist/figma-i18n.normal.js",
	"downloadURL": "https://github.com/NICEXAI/figma-i18n/blob/main/dist/figma-i18n.normal.js",
  
	"match": "*://www.figma.com/*",
	"run-at": "document-end",
	"icon": "https://static.figma.com/app/icon/1/favicon.png",
	"license": "Apache; https://github.com/NICEXAI/figma-i18n/blob/main/LICENSE",
  
	"grant": "unsafeWindow",
	"grant": "window.console",
	"grant": "GM_getValue",
	"grant": "GM_setValue",
  }

function serve() {
	let server;

	function toExit() {
		if (server) server.kill(0);
	}

	return {
		writeBundle() {
			if (server) return;
			server = require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
				stdio: ['ignore', 'inherit', 'inherit'],
				shell: true
			});

			process.on('SIGTERM', toExit);
			process.on('exit', toExit);
		}
	};
}

export default {
	input: 'src/main.ts',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		file: 'public/build/bundle.js'
	},
	plugins: [
		svelte({
			preprocess: sveltePreprocess({ sourceMap: !production }),
			compilerOptions: {
				// enable run-time checks when not in production
				dev: !production
			}
		}),
		postcss({
			extract: false,
			minimize: true
		}),
		// we'll extract any component CSS out into
		// a separate file - better for performance
		// css({ output: 'bundle.css' }),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		typescript({
			sourceMap: !production,
			inlineSources: !production
		}),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser(),

		banner(() => {
			let maxLabelLen = 0;
			let metaItems = []
	  
			for (const label in metaInfo) {
			  if (Object.hasOwnProperty.call(metaInfo, label)) {
				const content = metaInfo[label];
				if(label.length > maxLabelLen) {
				  maxLabelLen = label.length
				}
				metaItems.push([label, content])
			  }
			}
	  
			return (
			  '// ==UserScript==\n' +
			  metaItems.reduce((str, [label, content]) => {
				label = label.trim()
				if(typeof(content) == "string") {
					content = content.trim()
				}
				
				return (
				  str +
				  `// @${
					label.length < maxLabelLen
					  ? label +
						[...new Array(maxLabelLen - label.length)]
						  .map(() => ' ')
						  .join('')
					  : label
				  } ${content}\n`
				)
			  }, '') +
			  '// ==/UserScript==\n'
			)
		})
	],
	watch: {
		clearScreen: false
	}
};
