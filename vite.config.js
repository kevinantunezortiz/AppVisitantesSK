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
				// Esto hace que TODOS los archivos del build se guarden localmente
				globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
				navigateFallback:'index.html',
				navigateFallbackDenylist: [/^\/api/],
			}
		})
	]
});