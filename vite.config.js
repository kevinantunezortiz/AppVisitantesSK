import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
	plugins: [
		sveltekit(),

		VitePWA({
			registerType: 'autoUpdate',
			manifest: {
				name: 'Registro Museo Regional',
				short_name: 'MuseoApp',
				theme_color: '#0d6efd', // Azul Bootstrap
				icons: [
					{
						src: 'icono-192.png',
						sizes: '192x192',
						type: 'image/png'
					},
					{
						src: 'icono-512.png',
						sizes: '512x512',
						type: 'image/png'
					}
				]
			},
			workbox: {
				// 1. Incluye explícitamente el index.html en el precache
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],

				// 2. Mapea la raíz al archivo index.html
				modifyURLPrefix: {
					'': '/'
				},

				// 3. ESTA ES LA SOLUCIÓN AL ERROR:
				// Si el navegador pide "/" o cualquier ruta, dale el index.html que ya tiene guardado
				navigateFallback: '/index.html',
				cleanupOutdatedCaches: true,

				// Permite que la app tome el control de inmediato
				clientsClaim: true,
				skipWaiting: true
			}
		})
	]
});
