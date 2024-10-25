window.onload = function() {
    // -----------------------------
    // Inizializzazione della pagina
    // -----------------------------
    console.log("Pagina caricata - esecuzione di window.onload");

    // ------------------------------------
    // Variabili e costanti globali
    // ------------------------------------
    const backgroundVideo = document.getElementById('background');
    const backgroundMusic = document.getElementById('background-music');
    const clickSound = new Audio('sound_effects/click.mp3');
    const successSound = new Audio('sound_effects/pickup.mp3');
    const glitchSound = new Audio('sound_effects/glitch.mp3'); 
    
    let musicStarted = false;
    let currentPlayingAudio = null;
    let currentAnimationInterval = null;
    let originalParticleSpeeds = [];

    const allSongsDiscoveredDelay = 7000; // Delay time in milliseconds (7 seconds)
    let discoveredSongsCount = 0; // Counter for discovered songs

    // Select the outro video and end screen elements
    const outroVideo = document.getElementById('outro-video');
    const endScreen = document.getElementById('end-screen');

    // Oggetto per tracciare se ciascuna canzone è già stat trovata
    let hasFoundItem = {};

    // -----------------------------
    // Impostazioni delle particelle
    // -----------------------------
    const particleSettings = {
        "particles": {
            "number": {
                "value": 150,
                "density": { "enable": true, "value_area": 800 }
            },
            "color": { "value": "#ffffff" },
            "shape": { "type": "edge" },
            "opacity": { "value": 0.5, "random": true },
            "size": { "value": 3, "random": true },
            "line_linked": { "enable": false },
            "move": { "enable": true, "speed": 1, "random": true }
        },
        "retina_detect": true
    };

    // Inizializza le particelle
    particlesJS('particles-js', particleSettings);
    console.log("Particles.js inizializzato con velocità normale.");

    // --------------------------------
    // Precaricamento e impostazione audio e video
    // --------------------------------

    // Video di background
    backgroundVideo.playbackRate = 0.4; // Adjust the speed as desired

    // Musica di background
    backgroundMusic.preload = "auto";
    backgroundMusic.volume = 1;
    console.log("Musica di background caricata");

    // Suono di click
    clickSound.preload = "auto";
    clickSound.volume = 0.3;

    // Suono di successo
    successSound.preload = "auto";
    successSound.volume = 1;
    console.log("Suoni di click e success caricati");

    //Suono glitch
    glitchSound.preload = 'auto';
    glitchSound.volume = 1; 

    // ----------------------------
    // Definizione degli assets
    // ----------------------------
    const assets = [
        { name: 'purple', clickAreaId: 'purple-click-area', spoilerSrc: 'spoilers_mp3/woodstock_trimmed.mp3' },
        { name: 'red', clickAreaId: 'red-click-area', spoilerSrc: 'spoilers_mp3/pantone_186_trimmed.mp3' },
        { name: 'grey', clickAreaId: 'grey-click-area', spoilerSrc: 'spoilers_mp3/cache_trimmed.mp3' },
        { name: 'lazul', clickAreaId: 'lazul-click-area', spoilerSrc: 'spoilers_mp3/lattosio_freestyle_trimmed.mp3' },
        { name: 'yellow', clickAreaId: 'yellow-click-area', spoilerSrc: 'spoilers_mp3/notturno_trimmed.mp3' },
    ];

    // Precarica gli audio degli spoiler e inizializza 'hasFoundItem'
    assets.forEach(asset => {
        asset.spoilerAudio = new Audio(asset.spoilerSrc);
        asset.spoilerAudio.preload = 'auto';
        asset.spoilerAudio.volume = 1;
        console.log(`${asset.spoilerSrc} caricato`);

        hasFoundItem[asset.name] = false;
    });

    // -----------------------------
    // Gestione della schermata iniziale
    // -----------------------------
    const startingScreen = document.getElementById('starting-screen');
    console.log("Schermata iniziale trovata:", startingScreen);

    startingScreen.addEventListener('click', function() {
        console.log("Schermata iniziale cliccata - nascondi la schermata e avvia la musica di background");
        startingScreen.style.display = 'none';
        backgroundMusic.play().then(() => {
            musicStarted = true;
            console.log("Musica di background avviata");
        }).catch(error => console.log("Errore nell'avviare la musica di background:", error));
    });

    // -----------------------------
    // Event listener sul corpo della pagina
    // -----------------------------
    document.body.addEventListener('click', function(event) {
        if (startingScreen.style.display !== 'none') {
            console.log("La schermata iniziale è ancora visibile - nessuna azione eseguita");
            return;
        }

        clickSound.play().catch(error => console.log("Errore nel riprodurre il suono di click:", error));
        stopCurrentPlayingAudio();
    });

    // -----------------------------------
    // Funzione per fermare l'audio corrente
    // -----------------------------------
    function stopCurrentPlayingAudio() {
        if (currentPlayingAudio) {
            console.log("Ferma l'audio corrente:", currentPlayingAudio.src);
            currentPlayingAudio.pause();
            currentPlayingAudio.currentTime = 0;
            stopAnimations();
            resetParticleSpeed();
            changeBackgroundSpeed(0.4);
        }
    }

    // -------------------------------------------
    // Funzione per gestire il click sugli spoiler
    // -------------------------------------------

    function handleSpoilerClick(asset) {
        return function(event) {
            event.stopPropagation();
            console.log("Spoiler cliccato:", asset.spoilerAudio.src);
            stopCurrentPlayingAudio();
            currentPlayingAudio = asset.spoilerAudio;

            // Play success sound and increment discoveredSongsCount if it’s a new discovery
            if (!hasFoundItem[asset.name]) {
                successSound.play().then(() => {
                    console.log("Suono di successo riprodotto per asset:", asset.name);
                    hasFoundItem[asset.name] = true;
                    discoveredSongsCount++; // Increment the count for new discoveries

                    // Check if all songs are discovered
                    if (discoveredSongsCount === 5) {
                        setTimeout(triggerOutro, allSongsDiscoveredDelay); // Wait and trigger outro
                    }
                }).catch(error => console.log("Errore nel riprodurre il suono di successo:", error));
            }
            
            // Play the spoiler audio
            asset.spoilerAudio.play().then(() => {
                console.log("Riproduzione spoiler avviata:", asset.spoilerAudio.src);
                startAnimations();
                increaseParticleSpeed(5);
                changeBackgroundSpeed(0.8)
            }).catch(error => console.log("Errore nel riprodurre il suono dello spoiler:", error));
        };
    }

    // -------------------------------------
    // Aggiungi i listener di click per ogni asset
    // -------------------------------------
    assets.forEach(asset => {
        const clickArea = document.getElementById(asset.clickAreaId);
        if (clickArea) {
            clickArea.addEventListener('click', handleSpoilerClick(asset));
            console.log(`Listener di click aggiunto per ${asset.name}`);
        } else {
            console.warn(`Area cliccabile non trovata per ${asset.name}`);
        }
    });

    // -----------------------------
    // Funzioni per gestire le animazioni
    // -----------------------------
    function showRandomAnimation() {
        console.log("Tentativo di mostrare un'animazione...");
        document.querySelectorAll('.sound-animation').forEach(animation => {
            animation.style.display = 'none';
        });

        const randomIndex = Math.floor(Math.random() * 2) + 1;
        const randomAnimation = document.getElementById(`sound${randomIndex}`);
        if (randomAnimation) {
            console.log("Mostrando animazione:", randomAnimation.id);
            randomAnimation.style.display = 'block';

            setTimeout(() => {
                randomAnimation.style.display = 'none';
                console.log("Animazione nascosta:", randomAnimation.id);
            }, 150); // Durata dell'animazione (puoi regolarla)
        } else {
            console.warn("Animazione casuale non trovata:", `sound${randomIndex}`);
        }
    }

    function startAnimations() {
        console.log("Avvio delle animazioni...");
        if (!currentAnimationInterval) {
            currentAnimationInterval = setInterval(showRandomAnimation, 2000); // Intervallo di 2 secondi
        }
    }

    function changeBackgroundSpeed(speed){
        console.log("Cambiamento della velocità dell'animazione di background")
        backgroundVideo.playbackRate = speed;
    }

    function stopAnimations() {
        console.log("Interruzione delle animazioni...");
        if (currentAnimationInterval) {
            clearInterval(currentAnimationInterval);
            currentAnimationInterval = null;
            document.querySelectorAll('.sound-animation').forEach(animation => {
                animation.style.display = 'none';
                console.log("Animazione nascosta:", animation.id);
            });
        }
    }

    // -----------------------------
    // Gestione delle particelle
    // -----------------------------
    // Memorizza la velocità originale delle particelle per un reset sicuro
    function storeOriginalParticleSpeeds() {
        originalParticleSpeeds = [];
        if (window.pJSDom && pJSDom[0]) {
            pJSDom[0].pJS.particles.array.forEach(particle => {
                originalParticleSpeeds.push({ vx: particle.vx, vy: particle.vy });
            });
            console.log("Velocità originali delle particelle memorizzate");
        } else {
            console.warn("pJSDom non definito - impossibile memorizzare le velocità delle particelle");
        }
    }

    // Aumenta la velocità delle particelle senza reimpostare la posizione
    function increaseParticleSpeed(mult) {
        console.log("Aumento della velocità delle particelle senza reimpostare la posizione...");
        if (window.pJSDom && pJSDom[0]) {
            pJSDom[0].pJS.particles.array.forEach(particle => {
                particle.vx *= mult;  // Aumenta la velocità orizzontale
                particle.vy *= mult;  // Aumenta la velocità verticale
            });
        } else {
            console.warn("pJSDom non definito - impossibile aumentare la velocità delle particelle");
        }
    }

    // Aumenta il numero di particelle
    function increaseParticleNum(newCount) {
        console.log("Aumento del numero di particelle...");

        if (window.pJSDom && pJSDom[0]) {
            // Set the new particle count in the configuration
            pJSDom[0].pJS.particles.number.value = newCount;

            // Reinitialize particles to apply the new count
            pJSDom[0].pJS.fn.particlesRefresh();
            console.log(`Numero di particelle impostato a ${newCount}`);
        } else {
            console.warn("pJSDom non definito - impossibile aumentare il numero di particelle");
        }
    }

    // Reset delle velocità delle particelle alle loro velocità originali
    function resetParticleSpeed() {
        console.log("Reset delle particelle alla loro velocità originale...");
        if (window.pJSDom && pJSDom[0]) {
            pJSDom[0].pJS.particles.array.forEach((particle, index) => {
                if (originalParticleSpeeds[index]) {
                    particle.vx = originalParticleSpeeds[index].vx;  // Ripristina la velocità orizzontale
                    particle.vy = originalParticleSpeeds[index].vy;  // Ripristina la velocità verticale
                }
            });
        } else {
            console.warn("pJSDom non definito - impossibile resettare la velocità delle particelle");
        }
    }

    // Function to trigger the outro video
    function triggerOutro() {
        console.log("Tutte le canzoni scoperte! Esecuzione del video di chiusura.");

        // Stop all audio, animations, and particle effects
        stopCurrentPlayingAudio();
        stopAnimations();
        backgroundMusic.pause();

        // Play glitch sound with the outro video
        glitchSound.play().then(() => {
            console.log("Suono di glitch avviato con il video di chiusura.");
        }).catch(error => console.log("Errore nel riprodurre il suono di glitch:", error));

        // Display the outro video and apply fade-in transition
        increaseParticleNum(500);
        increaseParticleSpeed(10);

        const outroVideo = document.getElementById('outro-video');
        outroVideo.style.display = 'block'; // Make it visible
        setTimeout(() => {
            outroVideo.style.opacity = '1'; // Trigger the transition to fade in
        }, 50); // Small delay to ensure display change is processed

        outroVideo.play().then(() => {
            console.log("Video di chiusura in riproduzione.");
        }).catch(error => console.log("Errore nel riprodurre il video di chiusura:", error));
    }


    // Event listener to detect the end of the outro video
    outroVideo.addEventListener('ended', function() {
        // Hide the outro video and display the end screen with "404"
        outroVideo.style.display = 'none';
        endScreen.style.display = 'flex';
        console.log("Video di chiusura completato. Schermo nero con 404 visualizzato.");
    });

    // Memorizza le velocità originali quando le particelle vengono inizializzate
    storeOriginalParticleSpeeds();
};
