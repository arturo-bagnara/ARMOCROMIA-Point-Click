// script.js

window.onload = function() {
    const backgroundMusic = document.getElementById('background-music');
    const clickSound = new Audio('sound_effects/click.mp3');  // Add your click sound file here

    let musicStarted = false;  // Flag to check if background music has started
    let currentPlayingAudio = null;  // Track the currently playing audio

    // Preload the background music
    backgroundMusic.preload = "auto";
    backgroundMusic.volume = 1;  // Set volume to 100%

    // Preload the click sound
    clickSound.preload = "auto";
    clickSound.volume = 0.4;

    // Create the song spoiler sounds for all assets
    const purpleSpoiler = new Audio('spoilers_mp3/woodstock.mp3'); 
    const redSpoiler = new Audio('spoilers_mp3/pantone_186.mp3');  
    const greySpoiler = new Audio('spoilers_mp3/cache.mp3'); 
    const lazulSpoiler = new Audio('spoilers_mp3/lattosio_freestyle.mp3'); 
    const yellowSpoiler = new Audio('spoilers_mp3/notturno.mp3'); 

    // Preload all the spoiler sounds
    [purpleSpoiler, redSpoiler, greySpoiler, lazulSpoiler, yellowSpoiler].forEach(spoiler => spoiler.preload = "auto");

    // Function to stop the current song spoiler
    function stopCurrentPlayingAudio() {
        if (currentPlayingAudio) {
            currentPlayingAudio.pause();
            currentPlayingAudio.currentTime = 0;  // Reset audio
        }
    }

    // Play the click sound on every click and stop any currently playing song
    document.body.addEventListener('click', function() {
        // Start the background music only on the first click
        if (!musicStarted) {
            backgroundMusic.play().then(() => musicStarted = true).catch(error => console.log("Error starting background music:", error));
        }

        // Play the click sound every time
        clickSound.play().catch(error => console.log("Error playing click sound:", error));

        // Stop any currently playing audio
        stopCurrentPlayingAudio();
    });

    // Handle spoiler playing with event.stopPropagation() for each clickable area
    function handleSpoilerClick(spoiler) {
        return function(event) {
            event.stopPropagation();  // Prevent the click sound from being triggered
            stopCurrentPlayingAudio();  // Stop the current audio
            currentPlayingAudio = spoiler;  // Set the new audio as currently playing

            // Play the selected spoiler audio
            spoiler.play().catch(error => console.log("Error playing spoiler sound:", error));
        };
    }

    // Add click event listeners to the respective clickable areas
    document.getElementById('purple-click-area').addEventListener('click', handleSpoilerClick(purpleSpoiler));
    document.getElementById('red-click-area').addEventListener('click', handleSpoilerClick(redSpoiler));
    document.getElementById('grey-click-area').addEventListener('click', handleSpoilerClick(greySpoiler));
    document.getElementById('lazul-click-area').addEventListener('click', handleSpoilerClick(lazulSpoiler));
    document.getElementById('yellow-click-area').addEventListener('click', handleSpoilerClick(yellowSpoiler));

    // Initialize particles.js for dust-like square particles
    particlesJS('particles-js', {
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
    });
};
