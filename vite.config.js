import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
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
    // Rota /admin serve o painel de login admin
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
