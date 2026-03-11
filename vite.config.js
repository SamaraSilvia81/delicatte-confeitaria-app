import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  // ← ISSO É O QUE FALTAVA
  // O GitHub Pages serve o site em /delicatte-confeitaria-app/
  // Sem esse base, o Vite gera caminhos como /assets/index.js
  // e o browser procura em samarasilvia81.github.io/assets/ — não existe.
  // Com o base correto, gera /delicatte-confeitaria-app/assets/index.js — existe.
  base: '/delicatte-confeitaria-app/',

  build: {
    rollupOptions: {
      input: {
        main:        resolve(__dirname, 'index.html'),
        login:       resolve(__dirname, 'src/pages/login.html'),
        profile:     resolve(__dirname, 'src/pages/profile.html'),
        adminPanel:  resolve(__dirname, 'src/admin/index.html'),
        adminLogin:  resolve(__dirname, 'admin/index.html'),
      },
    },
  },
  server: {
    port: 3000,
    open: true,
    fs: { strict: false },
  },
  plugins: [
    {
      name: 'admin-route',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/admin' || req.url === '/admin/') {
            req.url = '/admin/index.html'
          }
          next()
        })
      }
    }
  ]
})
