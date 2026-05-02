<script>
	import { db } from '$lib/firebase';
	import { collection, addDoc } from 'firebase/firestore';

	import { onMount } from 'svelte';

	onMount(() => {
		// Verificamos si bootstrap ya está disponible globalmente
		if (typeof bootstrap !== 'undefined') {
			const el = document.getElementById('carouselExampleSlidesOnly');
			const carousel = new bootstrap.Carousel(el, {
				interval: 3000,
				ride: 'carousel'
			});
		}
	});

	let generoSeleccionado = $state('');
	let grupoSeleccionado = $state('');
	let mostrarAlerta = $state(false);
	let mostrarBoton = $state(false);

	const gens = [
		{ id: 'hombres', txt: 'Hombre' },
		{ id: 'mujeres', txt: 'Mujer' },
		{ id: 'nobinarios', txt: 'No Binario' },
		{ id: 'prefiero_no_decirlo', txt: 'Prefiero no responder' }
	];
	const grupos = [
		{ id: 'lgbttqimas', txt: 'LGBTTTQI+' },
		{ id: 'infancias_adolescentes', txt: 'Infancias/Adolescentes' },
		{ id: 'adultosmayores', txt: 'Adultos Mayores' },
		{ id: 'afrodescendientes', txt: 'Personas Afrodescendientes' },
		{ id: 'personas_artesanas', txt: 'Personas Artesanas' },
		{ id: 'personas_con_discapacidad', txt: 'Personas con Discapacidad' },
		{
			id: 'personas_embarazadas',
			txt: 'Embarazadas, En Lactancia, Jefas de Familia o en Situación de Vulnerabilidad'
		},
		{ id: 'situacion_calle', txt: 'Personas en Situación de Calle' },
		{ id: 'personas_indigenas', txt: 'Personas Indígenas' },
		{ id: 'personas_jovenes', txt: 'Personas Jóvenes' },
		{ id: 'personas_migrantes', txt: 'Personas Migrantes y en situación de refugio' }
	];

	async function registrarVisitante() {
		// 1. Evitar que le den click muchas veces
		if (mostrarAlerta) return;

		const ahora = new Date();
		const nuevoVisitante = {
			genero: generoSeleccionado,
			grupo_social: grupoSeleccionado,
			anio: ahora.getFullYear().toString(),
			mes: ahora.toLocaleString('es-ES', { month: 'long' }).toLowerCase(),
			timestamp: Date.now()
		};

		// --- LOGICA DE INTERFAZ INSTANTÁNEA ---
		// Mostramos la alerta y limpiamos campos ANTES de esperar a Firebase
		mostrarAlerta = true;
		const tempGenero = generoSeleccionado; // Guardamos copia por si hay error real
		const tempGrupo = grupoSeleccionado;

		generoSeleccionado = '';
		grupoSeleccionado = '';

		try {
			// Ejecutamos la inserción sin bloquear la UI
			// Al no poner 'await' aquí, el código de abajo (setTimeout) sigue su curso
			addDoc(collection(db, 'visitas_detalladas'), nuevoVisitante);

			// El temporizador para ocultar la alerta y limpiar el estado del botón
			setTimeout(() => {
				mostrarAlerta = false;
				mostrarBoton = false;
			}, 2000);
		} catch (error) {
			console.error('Error al guardar:', error.message);
			// Si fallara algo crítico, regresamos los valores
			generoSeleccionado = tempGenero;
			grupoSeleccionado = tempGrupo;
			mostrarAlerta = false;
			alert('Hubo un error local en el Kiosco');
		}
	}
	function activarBoton() {
		if (generoSeleccionado && grupoSeleccionado) mostrarBoton = true;
	}
</script>

<main style=" font-family: sans-serif;">
	<nav class="navbar sticky-top">
		<div class="container d-flex justify-content-between align-items-center">
			<img src="/iconos/secretaria.png" class="logo-nav" alt="" />
			<img src="/iconos/mrg3.png" id="btn-admin-logo" class="logo-nav" alt="" />
			<img src="/iconos/inah.png" class="logo-nav" alt="" />
		</div>
	</nav>

	<div
		id="carouselExampleSlidesOnly"
		class="carousel slide"
		data-bs-ride="carousel"
		data-bs-interval="3000"
	>
		<div class="carousel-inner">
			<div class="carousel-item active">
				<img src="/carrousel/6.jpg" class="d-block w-100" alt="" />
			</div>
			<div class="carousel-item"><img src="/carrousel/1.jpg" class="d-block w-100" alt="" /></div>
			<div class="carousel-item"><img src="/carrousel/2.jpg" class="d-block w-100" alt="" /></div>
			<div class="carousel-item"><img src="/carrousel/3.jpg" class="d-block w-100" alt="" /></div>
			<div class="carousel-item"><img src="/carrousel/4.jpg" class="d-block w-100" alt="" /></div>
			<div class="carousel-item"><img src="/carrousel/5.jpg" class="d-block w-100" alt="" /></div>
		</div>
	</div>
	<h2 class="text-center">Registra tu Entrada Visitante</h2>
	{#if mostrarAlerta}
		<div class="alert alert-success text-center" role="alert">
			Usuario Registrado Con Exito <br /> disfruta tu visita
		</div>
	{/if}

	<div class="container">
		<p class="fw-bold mb-2">¿Cómo te identificas?</p>
		<div class="row">
			{#each gens as gen (gen.id)}
				<div class="col-md-3">
					<label class="radio-img-container">
						<input
							type="radio"
							name="genero"
							value={gen.id}
							bind:group={generoSeleccionado}
							onchange={activarBoton}
						/>
						<img src={'/iconos/' + gen.id + '.png'} class="icon-radio" alt="" />
						<span>{gen.txt}</span>
					</label>
				</div>
			{/each}
		</div>
		<p class="fw-bold mb-2">¿A qué grupo social pertenece?</p>
		<div class="row">
			{#each grupos as grupo (grupo.id)}
				<div class="col-md-6 col-lg-3">
					<label class="radio-img-container">
						<input
							type="radio"
							name="grupo_social"
							value={grupo.id}
							bind:group={grupoSeleccionado}
							onchange={activarBoton}
						/>
						<img src={'iconos/' + grupo.id + '.png'} class="icon-radio" alt="" />
						<span style="font-size: 0.85rem; line-height: 1.1;">{grupo.txt}</span>
					</label>
				</div>
			{/each}
		</div>
		<div class="text-end mt-4">
			<button
				disabled={!mostrarBoton}
				onclick={registrarVisitante}
				type="button"
				id="btn-finalizar"
				class="btn btn-lg w-100 {mostrarBoton ? 'btn-success' : 'btn-secondary opacity-50'}"
				>Terminar Registro</button
			>
		</div>
	</div>
</main>
