import Spheres1Background from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.17/build/backgrounds/spheres1.cdn.min.js';

(function () {
    const second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24;

    // Setting the specific countdown date 
    const countDownDate = new Date("Jun 28, 2025 16:00:00").getTime();
    const x = setInterval(function() {
        const now = new Date().getTime(),
              distance = countDownDate - now;

        document.getElementById("days").innerText = Math.floor(distance / (day));
        document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour));
        document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute));
        document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);

        // Display a message when the countdown ends
        if (distance < 0) {
            document.getElementById("headline").innerText = "It's done!";
            document.getElementById("countdown").style.display = "none";
            document.getElementById("content").style.display = "block";
            clearInterval(x);
        }
    }, 1000);

   import Spheres1Background from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.17/build/backgrounds/spheres1.cdn.min.js';

(function () {
    const second = 1000,
          minute = second * 60,
          hour = minute * 60,
          day = hour * 24;

    // Setting the specific countdown date to January 23, 2025, at 11 AM
    const countDownDate = new Date("Jan 23, 2025 11:00:00").getTime();
    const x = setInterval(function() {
        const now = new Date().getTime(),
              distance = countDownDate - now;

        document.getElementById("days").innerText = Math.floor(distance / (day));
        document.getElementById("hours").innerText = Math.floor((distance % (day)) / (hour));
        document.getElementById("minutes").innerText = Math.floor((distance % (hour)) / (minute));
        document.getElementById("seconds").innerText = Math.floor((distance % (minute)) / second);

        // Display a message when the countdown ends
        if (distance < 0) {
            document.getElementById("headline").innerText = "It's done!";
            document.getElementById("countdown").style.display = "none";
            document.getElementById("content").style.display = "block";
            clearInterval(x);
        }
    }, 1000);

    // Initialize ball effect with additional golden balls
    const bg = Spheres1Background(document.getElementById('webgl-canvas'), {
        count: 51,
        minSize: 0.5,
        maxSize: 1,
        gravity: 0.5
    });

    // Add original and golden colors
    bg.spheres.setColors([
        0x1e90ff, // Original color (blue)
        0x000000, // Original color (black)
        0x708090, // Original color (grey)
        0xFFD700  // New golden color
    ]);

    document.getElementById('gravity-btn').addEventListener('click', () => {
        bg.spheres.config.gravity = bg.spheres.config.gravity === 0 ? 1 : 0;
    });

    document.getElementById('colors-btn').addEventListener('click', () => {
        bg.spheres.setColors([0xffffff * Math.random(), 0xffffff * Math.random(), 0xffffff * Math.random()]);
    });
})();

