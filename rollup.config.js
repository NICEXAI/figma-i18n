import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import banner from 'rollup-plugin-banner2'
import {name, version, description, author} from "./package.json"

const metaInfo = {
  "name": "Figma i18n",
  "namespace": "https://github.com/NICEXAI",
  "version": version,
  "description": description,
  "encoding": "utf-8",
  "author": author,
  "homepage": "https://github.com/NICEXAI/figma-cn",
  "supportURL": "https://github.com/NICEXAI/figma-cn/issues",
  "updateURL": "https://github.com/NICEXAI/figma-cn/blob/main/dist/figma-i18n.js",
  "downloadURL": "https://github.com/NICEXAI/figma-cn/blob/main/dist/figma-i18n.js",

  "match": "*://www.figma.com/file/*",
  "run-at": "document-start",
  "icon": "https://static.figma.com/app/icon/1/favicon.png",
  "license": "Apache; https://github.com/NICEXAI/figma-cn/blob/main/LICENSE",

  "grant": "unsafeWindow",
  "grant": "window.console",
  "grant": "GM_getValue",
  "grant": "GM_setValue",
}

export default {
  input: './src/index.ts',
  output: {
    dir: 'dist',
    format: 'iife',
    entryFileNames: `${name}.normal.js`,
  },
  plugins: [
    resolve(), 
    commonjs(), 
    typescript(),
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
          content = content.trim()
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
};