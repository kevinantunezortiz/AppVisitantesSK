<script>
	import favicon from '$lib/assets/favicon.svg';
	import { onMount } from 'svelte';
    import { db } from '$lib/firebase';
    import { enableNetwork, disableNetwork } from "firebase/firestore";
    let { children } = $props();

    onMount(async () => {
        // 1. Al encender la laptop, si hay WiFi, activamos la red
        if (navigator.onLine) {
            await enableNetwork(db);
        }

        // 2. Escuchar cuando el WiFi regresa (Sincronización automática)
        window.addEventListener('online', async () => {
            console.log("WiFi detectado: Sincronizando datos...");
            await enableNetwork(db);
        });

        // 3. Escuchar cuando el WiFi se va
        window.addEventListener('offline', async () => {
            console.log("WiFi perdido: Trabajando localmente...");
            await disableNetwork(db);
        });

        if ('serviceWorker' in navigator) {
            const { registerSW } = await import('virtual:pwa-register');
            registerSW({ immediate: true });
        }
    });

</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
