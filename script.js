window.onload = function() {
    console.log("Pagina caricata - esecuzione di window.onload");

    const backgroundMusic = document.getElementById('background-music');
    const clickSound = new Audio('sound_effects/click.mp3');
    const successSound = new Audio('sound_effects/pickup.mp3');  // Success sound

    let musicStarted = false;
    let currentPlayingAudio = null;
    let currentAnimationInterval = null;

    // Oggetto per tracciare se il suono di successo è già stato riprodotto per ogni asset
    let hasPlayedSuccessSoundPerAsset = {
        purple: false,
        red: false,
        grey: false,
        lazul: false,
        yellow: false
    };

    // Particles initialization
    let particleSettings = {
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

    particlesJS('particles-js', particleSettings);
    console.log("Particles.js inizializzato con velocità normale.");

    backgroundMusic.preload = "auto";
    backgroundMusic.volume = 1;
    console.log("Musica di background caricata");

    clickSound.preload = "auto";
    clickSound.volume = 0.3;
    successSound.preload = "auto";  // Preload success sound
    successSound.volume = 1;  // Set the volume for success sound
    console.log("Suoni di click e success caricati");

    const purpleSpoiler = new Audio('spoilers_mp3/woodstock.mp3');
    const redSpoiler = new Audio('spoilers_mp3/pantone_186.mp3');
    const greySpoiler = new Audio('spoilers_mp3/cache.mp3');
    const lazulSpoiler = new Audio('spoilers_mp3/lattosio_freestyle.mp3');
    const yellowSpoiler = new Audio('spoilers_mp3/notturno.mp3');

    [purpleSpoiler, redSpoiler, greySpoiler, lazulSpoiler, yellowSpoiler].forEach(spoiler => {
        spoiler.preload = "auto";
        spoiler.volume = 1;
        console.log(`${spoiler.src} caricato`);
    });

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

    document.body.addEventListener('click', function(event) {
        if (startingScreen.style.display !== 'none') {
            console.log("La schermata iniziale è ancora visibile - nessuna azione eseguita");
            return;
        }

        clickSound.play().catch(error => console.log("Errore nel riprodurre il suono di click:", error));
        stopCurrentPlayingAudio();
    });

    function stopCurrentPlayingAudio() {
        if (currentPlayingAudio) {
            console.log("Ferma l'audio corrente:", currentPlayingAudio.src);
            currentPlayingAudio.pause();
            currentPlayingAudio.currentTime = 0;
            stopAnimations();
            resetParticleSpeed(); // Reset particle speed to normal
        }
    }

    // Funzione per gestire il click sugli spoiler con riproduzione suono success
    function handleSpoilerClick(spoiler, assetName) {
        return function(event) {
            event.stopPropagation();
            console.log("Spoiler cliccato:", spoiler.src);
            stopCurrentPlayingAudio();
            currentPlayingAudio = spoiler;

            // Riproduci il suono di success **solo la prima volta per ogni asset**
            if (!hasPlayedSuccessSoundPerAsset[assetName]) {
                successSound.play().then(() => {
                    console.log("Suono di successo riprodotto per asset:", assetName);
                    hasPlayedSuccessSoundPerAsset[assetName] = true;  // Imposta il flag a true dopo il primo click su quell'asset
                }).catch(error => console.log("Errore nel riprodurre il suono di successo:", error));
            }

            // Riproduci lo spoiler audio
            spoiler.play().then(() => {
                console.log("Riproduzione spoiler avviata:", spoiler.src);
                startAnimations();
                increaseParticleSpeed();  // Aumenta la velocità delle particelle
            }).catch(error => console.log("Errore nel riprodurre il suono dello spoiler:", error));
        };
    }

    // Aggiungi i listener di click per ogni asset con il nome dell'asset
    document.getElementById('purple-click-area').addEventListener('click', handleSpoilerClick(purpleSpoiler, 'purple'));
    document.getElementById('red-click-area').addEventListener('click', handleSpoilerClick(redSpoiler, 'red'));
    document.getElementById('grey-click-area').addEventListener('click', handleSpoilerClick(greySpoiler, 'grey'));
    document.getElementById('lazul-click-area').addEventListener('click', handleSpoilerClick(lazulSpoiler, 'lazul'));
    document.getElementById('yellow-click-area').addEventListener('click', handleSpoilerClick(yellowSpoiler, 'yellow'));

    console.log("Aggiunti listener di click alle aree cliccabili");

    // Funzioni per gestire le animazioni
    function showRandomAnimation() {
        console.log("Tentativo di mostrare un'animazione...");
        document.querySelectorAll('.sound-animation').forEach(animation => {
            animation.style.display = 'none';
        });

        const randomIndex = Math.floor(Math.random() * 2) + 1;
        const randomAnimation = document.getElementById(`sound${randomIndex}`);
        console.log("Mostrando animazione:", randomAnimation.id);
        randomAnimation.style.display = 'block';

        setTimeout(() => {
            randomAnimation.style.display = 'none';
            console.log("Animazione nascosta:", randomAnimation.id);
        }, 200); // Durata dell'animazione (puoi regolarla)
    }

    function startAnimations() {
        console.log("Avvio delle animazioni...");
        if (!currentAnimationInterval) {
            currentAnimationInterval = setInterval(showRandomAnimation, 2000); // Intervallo di 2 secondi
        }
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

    // Memorizza la velocità originale delle particelle per un reset sicuro
    let originalParticleSpeeds = [];

    // Funzione per memorizzare le velocità originali delle particelle
    function storeOriginalParticleSpeeds() {
        originalParticleSpeeds = [];
        pJSDom[0].pJS.particles.array.forEach(particle => {
            originalParticleSpeeds.push({ vx: particle.vx, vy: particle.vy });
        });
        console.log("Velocità originali memorizzate");
    }

    // Aumenta la velocità delle particelle senza reimpostare la posizione
    function increaseParticleSpeed() {
        console.log("Aumento della velocità delle particelle senza reimpostare la posizione...");
        pJSDom[0].pJS.particles.array.forEach(particle => {
            particle.vx *= 5;  // Aumenta la velocità orizzontale
            particle.vy *= 5;  // Aumenta la velocità verticale
        });
    }

    // Reset delle velocità delle particelle alle loro velocità originali
    function resetParticleSpeed() {
        console.log("Reset delle particelle alla loro velocità originale...");
        pJSDom[0].pJS.particles.array.forEach((particle, index) => {
            particle.vx = originalParticleSpeeds[index].vx;  // Ripristina la velocità orizzontale
            particle.vy = originalParticleSpeeds[index].vy;  // Ripristina la velocità verticale
        });
    }

    // Memorizza le velocità originali quando le particelle vengono inizializzate
    storeOriginalParticleSpeeds();
};
