// script.js

window.onload = function() {
    const backgroundMusic = document.getElementById('background-music');
    const clickSound = new Audio('sound_effects/click.mp3');  // Add your click sound file here

    let musicStarted = false;  // Flag to check if background music has started

    // Preload the background music
    backgroundMusic.preload = "auto";
    backgroundMusic.volume = 1;  // Set volume to 100%

    // Preload the click sound
    clickSound.preload = "auto";
    clickSound.volume = 0.5;

    // Create the song spoiler sound for the purple asset
    const purpleSpoiler = new Audio('8bit/woodstock.mp3');

    // Preload the spoiler sound
    purpleSpoiler.preload = "auto";

    // Play the click sound on every click
    document.body.addEventListener('click', function() {
        // Start the background music only on the first click
        if (!musicStarted) {
            console.log("Attempting to start background music...");
            backgroundMusic.play().then(() => {
                console.log("Background music started successfully.");
                musicStarted = true;  // Set the flag to true so music starts only once
            }).catch(function(error) {
                console.log("Error starting background music:", error);
            });
        }

        // Play the click sound every time
        clickSound.play().then(() => {
            console.log("Click sound played.");
        }).catch(function(error) {
            console.log("Error playing click sound:", error);
        });
    });

    // Add a click event to the purple-click-area to play the corresponding song spoiler
    document.getElementById('purple-click-area').addEventListener('click', function(event) {
        event.stopPropagation();  // Prevent the click sound from being triggered

        // Log if the purple song spoiler plays or fails
        purpleSpoiler.play().then(() => {
            console.log("Purple spoiler sound played successfully.");
        }).catch(function(error) {
            console.log("Error playing purple spoiler sound:", error);
        });
    });

    // Initialize particles.js for dust-like square particles
    particlesJS('particles-js', {
        "particles": {
            "number": {
                "value": 150,  // Number of particles
                "density": {
                    "enable": true,
                    "value_area": 800
                }
            },
            "color": {
                "value": "#ffffff"
            },
            "shape": {
                "type": "edge",  // Change particles to squares
            },
            "opacity": {
                "value": 0.5,
                "random": true
            },
            "size": {
                "value": 3,
                "random": true
            },
            "line_linked": {
                "enable": false  // Disable lines connecting the particles
            },
            "move": {
                "enable": true,
                "speed": 1,
                "random": true
            }
        },
        "retina_detect": true
    });
};
