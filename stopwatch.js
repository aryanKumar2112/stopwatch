window.addEventListener("DOMContentLoaded", setupStopwatch);
window.addEventListener("DOMContentLoaded", setupInstallButton);

function setupStopwatch() {
  var clock = document.getElementById("clock");
  var startStop = document.getElementById("start-stop");
  var reset = document.getElementById("reset");

  var startTime = 0;
  var stopTime = 0;
  var intervalID = 0;

  startStop.addEventListener("click", function() {
    if (intervalID) {
      stopTime = Date.now();
      clearInterval(intervalID);
      intervalID = 0;
      startStop.textContent = "Start";
      return;
    }

    if (startTime > 0) {
      var pauseTime = Date.now() - stopTime;
      startTime = startTime + pauseTime;
    } else {
      startTime = Date.now();
    }

    intervalID = setInterval(function() {
      var elapsedTime = Date.now() - startTime;
      clock.textContent = formatTime(elapsedTime);
    }, 100);

    startStop.textContent = "Stop";    
  });

  reset.addEventListener("click", function() {
    startTime = intervalID ? Date.now() : 0;
    stopTime = 0;
    clock.textContent = "00:00";
  });

  function formatTime(timestamp) {
    var d = new Date(timestamp);

    var minutes = d.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    var seconds = d.getSeconds();
    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
  }
}

function setupInstallButton() {
  var request = window.navigator.mozApps.getSelf();
  request.onsuccess = function getSelfSuccess() {
    if (request.result)
      return;

    var installButton = document.getElementById("install");
    installButton.classList.remove("hidden");
    installButton.addEventListener("click", install);
  };
  request.onerror = function getSelfError() {
    console.warn("error getting self: " + request.error.name);
  };

  function install() {
    var location = window.location.href;
    var manifestURL = location.substring(0, location.lastIndexOf("/")) + "/manifest.webapp";

    var request = navigator.mozApps.install(manifestURL);
    request.onsuccess = function installSuccess() {
      document.getElementById("install").classList.add("hidden");
    };
    request.onerror = function installError() {
      console.warn("error installing app: " + request.error.name);
    };
  }
}
