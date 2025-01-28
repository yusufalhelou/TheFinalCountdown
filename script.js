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
}());
