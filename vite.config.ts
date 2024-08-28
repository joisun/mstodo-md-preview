import { defineConfig } from 'vite';
import monkey, { cdn }  from 'vite-plugin-monkey';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    monkey({
      entry: 'src/main.ts',
      userscript: {
        name: 'Microsoft To-Do Markdown Preview Support - mstodo-md-preview',
        author: 'Zhongyi Sun',
        namespace:'https://github.com/joisun',
        description: 'Microsoft To-Do Markdown Preview Support',
        icon: 'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://to-do.live.com/&size=64',
        match: ['https://to-do.live.com/*'],
      },
      build: {
        externalGlobals: {
          
          'highlight.js': ['hljs','https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.10.0/highlight.min.js'],
          'markdown-it': cdn.jsdelivr('markdownit', 'dist/markdown-it.min.js'),
        },
        externalResource: {
          'highlight.js/styles/tokyo-night-dark.min.css': "https://cdn.jsdelivr.net/npm/@highlightjs/cdn-assets@11.10.0/styles/tokyo-night-dark.min.css",
        },
      },
    }),
  ],
  optimizeDeps: {
    exclude: ['markdown-it']
  },
  build:{
    minify: false
  }
});
