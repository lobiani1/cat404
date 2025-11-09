const cat = document.getElementById("cat");

const frameWidth = 32;

const totalRunFrames = 8;
const totalWalkFrames = 8;
const totalIdleFrames = 4;

const frameRate = 100;
const scaleFactor = 2;

// Y-Coordinates
const idleRowY = 0;
const walkRowY = -128;
const runRowY = -160;
const lickRowY = -64;
const groomRowY = -96;

let frame = 0;
let currentState = "idle";
let lastState = "idle";
let lastFrameTime = 0;

// IDLE LOGIC VARIABLES
let idleTimer = 0;
const idleTimeoutDuration = 5000;
let idleAnimationIndex = 0;

// Initial Positioning
const CAT_SCALED_WIDTH = frameWidth * scaleFactor;
const CAT_SCALED_HEIGHT = frameWidth * scaleFactor;
const BOTTOM_OFFSET = 20;

let catX = window.innerWidth / 2 - CAT_SCALED_WIDTH / 2;
let catY = window.innerHeight - CAT_SCALED_HEIGHT - BOTTOM_OFFSET;
let targetX = catX;
let targetY = catY;

cat.style.left = Math.round(catX) + "px";
cat.style.top = Math.round(catY) + "px";

function animateCat(timestamp) {
  if (!lastFrameTime) lastFrameTime = timestamp;
  const deltaTime = timestamp - lastFrameTime;

  // Movement Logic
  const dx = targetX - catX;
  const dy = targetY - catY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const walkThreshold = 10;
  const runThreshold = 100;
  let speed = 0;

  // Check if the target is far enough to move
  if (distance >= runThreshold) {
    currentState = "run";
    speed = 0.15;
  } else if (distance >= walkThreshold) {
    currentState = "walk";
    speed = 0.08;
  } else {
    currentState = "idle";
    speed = 0;
  }

  //  IDLE TIMER LOGIC
  if (currentState === "idle") {
    idleTimer += timestamp - lastFrameTime;

    if (idleTimer >= idleTimeoutDuration) {
      idleAnimationIndex = (idleAnimationIndex % 2) + 1;
      idleTimer = 0;
    }
  } else {
    idleTimer = 0;
    idleAnimationIndex = 0;
  }

  if (currentState !== "idle") {
    catX += dx * speed;
    catY += dy * speed;

    // Flipping and Scaling
    const flip = dx < 0 ? -1 : 1;
    cat.style.transform = `scale(${flip * scaleFactor}, ${scaleFactor})`;
  }

  cat.style.left = Math.round(catX) + "px";
  cat.style.top = Math.round(catY) + "px";

  if (deltaTime >= frameRate) {
    let currentRowY;
    let frameLimit = totalIdleFrames;

    if (currentState !== lastState) {
      frame = 0;
    }

    if (currentState === "run") {
      currentRowY = runRowY;
      frameLimit = totalRunFrames;
    } else if (currentState === "walk") {
      currentRowY = walkRowY;
      frameLimit = totalWalkFrames;
    } else {
      if (idleAnimationIndex === 1) {
        currentRowY = lickRowY;
      } else if (idleAnimationIndex === 2) {
        currentRowY = groomRowY;
      } else {
        currentRowY = idleRowY;
      }
    }

    frame = (frame + 1) % frameLimit;

    cat.style.backgroundPosition = `-${frame * frameWidth}px ${currentRowY}px`;

    lastFrameTime = timestamp;
    lastState = currentState;
  }

  requestAnimationFrame(animateCat);
}

requestAnimationFrame(animateCat);

document.addEventListener("mousemove", (e) => {
  targetX = e.clientX;
  targetY = e.clientY;
  idleTimer = 0;
  idleAnimationIndex = 0;
});

const meow = document.getElementById("meow");

function playMeow() {
  meow.currentTime = 0;
  meow.play();
}

cat.addEventListener("click", playMeow);
