document.addEventListener("DOMContentLoaded", function() {
  var canvas = document.createElement("canvas");
  var ctx = canvas.getContext("2d");
  var trailDots = [];
  var shColor="rgba(255, 0, 0, 1)";
  var strStyle="rgba(255, 0, 0, .7)";

  function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
  }

  function drawLines() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 5;
    ctx.shadowBlur = 10; // Apply a bloom effect
    ctx.shadowColor = shColor; // "rgba(255, 0, 0, 1)";
    ctx.strokeStyle = strStyle; // "rgba(255, 0, 0, .7)"; // Make the trail lighter
    ctx.beginPath();

    if (trailDots.length > 1) {
        ctx.moveTo(trailDots[0].x, trailDots[0].y);
        for (var i = 1; i < trailDots.length; i++) {
            var dot1 = trailDots[i - 1];
            var dot2 = trailDots[i];

            var distance = Math.sqrt(
                Math.pow(dot2.x - dot1.x, 2) + Math.pow(dot2.y - dot1.y, 2)
            );
            var steps = Math.ceil(distance / 8);

            for (var j = 0; j <= steps; j++) {
                var t = j / steps;
                var bumpSide = j % 2 === 0 ? 1 : -1;
                var cx = dot1.x + (dot2.x - dot1.x) * 0.5;
                var cy = dot1.y + (dot2.y - dot1.y) * 0.5 - distance * 0.2 * bumpSide;
                var x = Math.pow(1 - t, 2) * dot1.x + 2 * (1 - t) * t * cx + Math.pow(t, 2) * dot2.x;
                var y = Math.pow(1 - t, 2) * dot1.y + 2 * (1 - t) * t * cy + Math.pow(t, 2) * dot2.y;
                ctx.lineTo(x, y);
            }
        }
    }

    ctx.stroke();
}

function fadeDots() {
  trailDots = trailDots.filter(dot => {
    dot.alpha -= .5 / fps;
    return dot.alpha > 0;
  });
}

function changeColor(){
    if( shColor=="rgba(255, 0, 0, 1)"){
        shColor="rgba(0, 255, 255, 1)";
        strStyle="rgba(0, 255, 255, .7)";
    }
    else{
        shColor="rgba(255, 0, 0, 1)";
        strStyle="rgba(255, 0, 0, .7)";
    }
}

document.body.appendChild(canvas);
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

document.addEventListener("mousemove", function(e) {
    var dot = {
        x: e.clientX,
        y: e.clientY,
        alpha: 1
    };
    trailDots.push(dot);

    fadeDots();
    drawLines();
});

setInterval(function() {
    //fadeDots();
    drawLines();
}, 250);
setInterval(function() {
    fadeDots();
    //drawLines();
}, .5/fps);
setInterval(changeColor, 500);

});

document.addEventListener("DOMContentLoaded", function() {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  document.body.appendChild(canvas);
  const prev = canvas.previousSibling;
  prev.before(canvas);

function drawBackground() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const desiredFps = 60;
    const desiredSquareSize = 20;
    const minSquareSize = 1;
    
    const squares = [];
    
    async function drawSquares() {
        
        var currentFps = fps;
        
        const adjustedSquareSize = Math.max(
            desiredSquareSize * (desiredFps / currentFps) * (isLowFps*4+1),
            minSquareSize
            );
        const numCols = Math.ceil(canvas.width / adjustedSquareSize);
        const numRows = Math.ceil(canvas.height / adjustedSquareSize);
            
        for (let row = 0; row < numRows; row += 1) {
            for (let col = 0; col < numCols; col += 1) {
                const index = row * numCols + col;
    
                if (!squares[index]) {
                    const grayValue = Math.floor(Math.random() * 51) + 50;
                    squares[index] = `rgb(${grayValue}, ${grayValue}, ${grayValue})`;
                }
    
                ctx.fillStyle = squares[index];
                ctx.fillRect(col * adjustedSquareSize, row * adjustedSquareSize, adjustedSquareSize, adjustedSquareSize);
            }
        }
    
        // Request the next frame
        requestAnimationFrame(drawBackground);
    }

    drawSquares();
}

drawBackground();

  //window.addEventListener("resize", drawBackground);
  checkFps();
});


const times = [];
let fps;

function refreshLoop() {
  window.requestAnimationFrame(() => {
    const now = performance.now();
    while (times.length > 0 && times[0] <= now - 1000) {
      times.shift();
    }
    times.push(now);
    fps = times.length;
    refreshLoop();
  });
}

refreshLoop();

function showFps() {
    const fpsValue = document.getElementById("fps-value");
    const fpsGrade = document.getElementById("fps-grade");

    fpsValue.textContent = `FPS: ${fps}`;

    let grade;
    if (fps >= 120) {
        grade = "Massive";
    } else if (fps >= 90) {
        grade = "Very Good";
    } else if (fps >= 60) {
        grade = "Good";
    } else if (fps >= 45) {
        grade = "Good Enough";
    } else if (fps >= 30) {
        grade = "Playable";
    } else if (fps >= 15) {
        grade = "Cyberpunk";
    } else if (fps >= 5) {
        grade = "Powerpoint";
    } else {
        grade = "Calculator";
    }

    fpsGrade.textContent = `Grade: ${grade}`;
}

setInterval(showFps, 10);

let isLowFps = false;
let lowFpsCounter = 0;
var header = document.getElementsByTagName("header")[0];
var section = document.getElementsByTagName("section")[0];
var lastTime = 0;
var currentTime;
const fpsThreshold = 30;

function checkFps() {
    currentTime = performance.now();
    if(!lastTime) {
        lastTime = currentTime;
    }
    
    if (fps < fpsThreshold) {
        lowFpsCounter+=fpsThreshold/fps;
    } else {
        lowFpsCounter = 0;
        isLowFps = false;
    }

    if (lowFpsCounter >= 500 && !isLowFps) {
        isLowFps = true;
        removeBackdropEffects();
        setDarkBackground();
        console.log("Set low fps");
    }

    if (!isLowFps || lowFpsCounter < 500) {
        requestAnimationFrame(checkFps);
    }

    lastTime = performance.now();
}

function removeBackdropEffects() {
    document.getElementsByTagName("header")[0].style.backdropFilter = 'none';
    for (let i = 0; i < document.getElementsByTagName("section").length; i++) {
        document.getElementsByTagName("section")[i].style.backdropFilter = 'none';
    }
}

function setDarkBackground() {
    document.getElementsByTagName("header")[0].style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    for (let i = 0; i < document.getElementsByTagName("section").length; i++) {
        document.getElementsByTagName("section")[i].style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    }
}