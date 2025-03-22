let timer;
let timeLeft;
let isRunning = false;
let isPaused = false;
let currentMode = 'workout';
let repetitionsLeft = 0;
let totalRepetitions = 0;

// Audio for notifications
const workoutEndSound = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
const restEndSound = new Audio('https://assets.mixkit.co/active_storage/sfx/1434/1434-preview.mp3');

// Configure sounds
workoutEndSound.volume = 0.8;
restEndSound.volume = 0.8;

// Fixed intervals
const WORKOUT_TIME = 30; // 30 seconds workout
const REST_TIME = 10;    // 10 seconds rest

document.getElementById('start-timer').addEventListener('click', startTimer);
document.getElementById('reset-timer').addEventListener('click', resetTimer);

function stopAllSounds() {
    workoutEndSound.pause();
    restEndSound.pause();
    workoutEndSound.currentTime = 0;
    restEndSound.currentTime = 0;
}

function switchMode() {
    currentMode = currentMode === 'workout' ? 'rest' : 'workout';
    document.getElementById('mode-select').value = currentMode;
    document.getElementById('timer-display').style.color = currentMode === 'workout' ? '#4CAF50' : '#f44336';

    // Set the appropriate time based on mode
    timeLeft = currentMode === 'workout' ? WORKOUT_TIME : REST_TIME;
}

function startTimer() {
    if (isRunning && !isPaused) return;

    const repetitions = parseInt(document.getElementById('time-input').value);

    if (isNaN(repetitions) || repetitions <= 0) {
        alert("Please enter a valid number of repetitions.");
        return;
    }

    if (!isRunning) {
        totalRepetitions = repetitions;
        repetitionsLeft = repetitions;
        timeLeft = WORKOUT_TIME;
        isRunning = true;
        isPaused = false;
        currentMode = 'workout';
        document.getElementById('mode-select').value = 'workout';
        document.getElementById('start-timer').textContent = 'Pause';
        document.getElementById('timer-display').style.color = '#4CAF50';
        stopAllSounds();
        startTimerInterval();
    } else if (isPaused) {
        isPaused = false;
        document.getElementById('start-timer').textContent = 'Pause';
        startTimerInterval();
    } else {
        isPaused = true;
        document.getElementById('start-timer').textContent = 'Resume';
        clearInterval(timer);
        stopAllSounds();
    }
}

function startTimerInterval() {
    clearInterval(timer); // Clear any existing interval
    timer = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timer);

            // Play appropriate end sound
            if (currentMode === 'workout') {
                workoutEndSound.play().catch(error => console.log("Workout end sound failed:", error));
            } else {
                restEndSound.play().catch(error => console.log("Rest end sound failed:", error));
            }

            if (currentMode === 'workout') {
                // Switch to rest mode
                switchMode();
                // Start the timer again for rest period
                startTimerInterval();
            } else {
                // Rest is over, check if we have more repetitions
                repetitionsLeft--;
                if (repetitionsLeft > 0) {
                    // Start next workout
                    currentMode = 'workout';
                    document.getElementById('mode-select').value = 'workout';
                    timeLeft = WORKOUT_TIME;
                    document.getElementById('timer-display').style.color = '#4CAF50';
                    // Start the timer again for workout period
                    startTimerInterval();
                } else {
                    // Workout complete
                    isRunning = false;
                    isPaused = false;
                    document.getElementById('start-timer').textContent = 'Start Timer';
                    document.getElementById('timer-display').style.color = 'white';
                    stopAllSounds();
                    alert('Workout complete!');
                    return;
                }
            }
        }

        timeLeft--;
        updateDisplay();
    }, 1000);
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    isPaused = false;
    currentMode = 'workout';
    document.getElementById('mode-select').value = 'workout';
    timeLeft = 0;
    repetitionsLeft = 0;
    totalRepetitions = 0;
    document.getElementById('start-timer').textContent = 'Start Timer';
    document.getElementById('timer-display').style.color = 'white';
    stopAllSounds();
    updateDisplay();
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const displayText = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    if (isRunning) {
        document.getElementById('timer-display').textContent =
            `${displayText} (${repetitionsLeft}/${totalRepetitions} reps)`;
    } else {
        document.getElementById('timer-display').textContent = displayText;
    }
}