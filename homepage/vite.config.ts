import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { readdir, rm, writeFile } from 'fs/promises'

const syncToHugo = () => {
  return {
    name: 'syncToHugo',
    closeBundle: async () => {
      const svelteBuild = './static/client'
      const assets = await readdir(svelteBuild)
      const js = assets.filter((name) =>
        name.match(/(index.)(?!.*?esm)(?!.*?css).*\w+/),
      )[0]
      const css = assets.filter((name) => name.includes('.css'))[0]
      await Promise.all([
        writeFile(`./data/react.json`, JSON.stringify({ js, css })),
        rm('./static/client/index.html'),
      ])
      console.log(`wrote ${js} to hugo data`)
    },
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  root: 'app',
  build: {
    outDir: '../static/client',
    emptyOutDir: true,
    assetsDir: '',
  },
  plugins: [react(), syncToHugo()],
})
