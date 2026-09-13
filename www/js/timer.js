// Timer Controller with Voice Guidance

let timerProject = null;
let currentPointIndex = 0;
let currentKeywordIndex = 0;
let timeRemaining = 0;
let timerInterval = null;
let isRunning = false;
let isMuted = false;
let synth = null;

// ==================== INITIALIZATION ====================

function initTimer(project) {
    timerProject = project;
    currentPointIndex = 0;
    currentKeywordIndex = 0;
    isRunning = false;
    isMuted = false;

    // Initialize speech synthesis
    synth = window.speechSynthesis;

    // Setup UI
    setupTimerUI();
    setupTimerControls();

    // Load first point
    loadPoint(0);
}

function setupTimerUI() {
    document.getElementById('timerProjectName').textContent = timerProject.name;

    // Exit button
    document.getElementById('exitTimer').addEventListener('click', () => {
        if (confirm(translate('confirm-exit') || 'Are you sure you want to exit the timer?')) {
            stopTimer();
            showView('projects');
        }
    });
}

function setupTimerControls() {
    const playPauseBtn = document.getElementById('playPauseBtn');
    const prevBtn = document.getElementById('prevPointBtn');
    const nextBtn = document.getElementById('nextPointBtn');
    const muteBtn = document.getElementById('muteBtn');

    playPauseBtn.addEventListener('click', togglePlayPause);
    prevBtn.addEventListener('click', () => changePoint(-1));
    nextBtn.addEventListener('click', () => changePoint(1));
    muteBtn.addEventListener('click', toggleMute);
}

// ==================== TIMER CONTROL ====================

function loadPoint(index) {
    if (index < 0 || index >= timerProject.points.length) {
        return;
    }

    // Stop current timer
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }

    currentPointIndex = index;
    currentKeywordIndex = 0;

    const point = timerProject.points[index];

    // Set time
    timeRemaining = point.duration;

    // Update UI
    document.getElementById('currentPointTitle').textContent = point.title || `Point ${index + 1}`;
    updateTimeDisplay();
    updateProgressBars();
    renderKeywords(point.keywords || []);

    // Speak point title
    if (!isMuted) {
        speak(point.title || `Point ${index + 1}`);
        playBeep('start');
    }

    // Reset play button
    isRunning = false;
    updatePlayPauseButton();
}

function togglePlayPause() {
    if (isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    if (timerProject.points.length === 0) {
        alert(translate('no-points') || 'No points to present');
        return;
    }

    isRunning = true;
    updatePlayPauseButton();

    // Speak first keyword if at start
    if (currentKeywordIndex === 0 && timeRemaining > 0) {
        const point = timerProject.points[currentPointIndex];
        if (point.keywords && point.keywords.length > 0) {
            if (!isMuted) {
                speak(point.keywords[0]);
            }
        }
    }

    timerInterval = setInterval(() => {
        if (timeRemaining > 0) {
            timeRemaining--;
            updateTimeDisplay();
            updateProgressBars();
            checkKeywordTransition();
        } else {
            // Point finished
            handlePointFinished();
        }
    }, 1000);
}

function pauseTimer() {
    isRunning = false;
    updatePlayPauseButton();

    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function stopTimer() {
    pauseTimer();
    if (synth) {
        synth.cancel();
    }
}

function updatePlayPauseButton() {
    const btn = document.getElementById('playPauseBtn');
    if (isRunning) {
        btn.innerHTML = `⏸️ <span>${translate('btn-pause')}</span>`;
    } else {
        btn.innerHTML = `▶️ <span>${translate('btn-play')}</span>`;
    }
}

function changePoint(direction) {
    const newIndex = currentPointIndex + direction;

    if (newIndex >= 0 && newIndex < timerProject.points.length) {
        pauseTimer();
        loadPoint(newIndex);
    }
}

function handlePointFinished() {
    pauseTimer();

    if (!isMuted) {
        playBeep('finish');
    }

    // Check if there are more points
    if (currentPointIndex < timerProject.points.length - 1) {
        // Auto-advance to next point after 1 second
        setTimeout(() => {
            changePoint(1);
        }, 1000);
    } else {
        // Presentation finished
        if (!isMuted) {
            speak(translate('presentation-finished') || 'Presentation finished!');
        }

        setTimeout(() => {
            if (confirm(translate('presentation-complete') || 'Presentation complete! Return to projects?')) {
                showView('projects');
            }
        }, 2000);
    }
}

// ==================== KEYWORDS ====================

function renderKeywords(keywords) {
    const keywordsList = document.getElementById('keywordsList');

    if (keywords.length === 0) {
        keywordsList.innerHTML = '<p style="text-align: center; color: var(--text-secondary);">No keywords for this point</p>';
        return;
    }

    keywordsList.innerHTML = keywords.map((keyword, index) => `
        <div class="keyword-item ${index === 0 ? 'active' : ''}" id="keyword-${index}">
            ${escapeHtml(keyword)}
        </div>
    `).join('');
}

function checkKeywordTransition() {
    const point = timerProject.points[currentPointIndex];

    if (!point.keywords || point.keywords.length === 0) {
        return;
    }

    const duration = point.duration;
    const elapsed = duration - timeRemaining;
    const keywordCount = point.keywords.length;

    // Calculate time per keyword
    const timePerKeyword = duration / keywordCount;

    // Determine current keyword based on elapsed time
    const newKeywordIndex = Math.floor(elapsed / timePerKeyword);

    if (newKeywordIndex !== currentKeywordIndex && newKeywordIndex < keywordCount) {
        // Keyword transition
        currentKeywordIndex = newKeywordIndex;

        // Update UI
        updateKeywordHighlight();

        // Speak new keyword
        if (!isMuted) {
            speak(point.keywords[currentKeywordIndex]);
            playBeep('keyword');
        }
    }
}

function updateKeywordHighlight() {
    const point = timerProject.points[currentPointIndex];

    if (!point.keywords || point.keywords.length === 0) {
        return;
    }

    point.keywords.forEach((_, index) => {
        const keywordElement = document.getElementById(`keyword-${index}`);
        if (keywordElement) {
            if (index < currentKeywordIndex) {
                keywordElement.classList.remove('active');
                keywordElement.classList.add('completed');
            } else if (index === currentKeywordIndex) {
                keywordElement.classList.remove('completed');
                keywordElement.classList.add('active');
            } else {
                keywordElement.classList.remove('active', 'completed');
            }
        }
    });
}

// ==================== UI UPDATES ====================

function updateTimeDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    document.getElementById('currentTime').textContent =
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function updateProgressBars() {
    // Point progress
    const point = timerProject.points[currentPointIndex];
    const pointProgress = ((point.duration - timeRemaining) / point.duration) * 100;
    document.getElementById('pointProgress').style.width = `${Math.min(pointProgress, 100)}%`;

    // Total progress
    let totalElapsed = 0;

    for (let i = 0; i < currentPointIndex; i++) {
        totalElapsed += timerProject.points[i].duration;
    }

    totalElapsed += (point.duration - timeRemaining);

    const totalProgress = (totalElapsed / timerProject.totalTime) * 100;
    document.getElementById('totalProgress').style.width = `${Math.min(totalProgress, 100)}%`;

    // Progress text
    document.getElementById('totalProgressText').textContent =
        `${currentPointIndex + 1} / ${timerProject.points.length}`;
}

// ==================== AUDIO ====================

function toggleMute() {
    isMuted = !isMuted;
    const muteBtn = document.getElementById('muteBtn');
    muteBtn.textContent = isMuted ? '🔇' : '🔊';

    if (isMuted && synth) {
        synth.cancel();
    }
}

function speak(text) {
    if (!synth || isMuted || !text) {
        return;
    }

    // Cancel any ongoing speech
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set language based on current language setting
    const lang = getLanguage();
    utterance.lang = lang === 'pt' ? 'pt-BR' : 'en-US';

    // Set voice properties
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    synth.speak(utterance);
}

function playBeep(type) {
    if (isMuted) return;

    // Create audio context for beeps
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Different frequencies for different beep types
    switch (type) {
        case 'start':
            oscillator.frequency.value = 880; // A5
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.2);
            break;
        case 'keyword':
            oscillator.frequency.value = 660; // E5
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.1);
            break;
        case 'finish':
            // Two-tone beep
            oscillator.frequency.value = 880;
            gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.15);

            // Second tone
            setTimeout(() => {
                const oscillator2 = audioContext.createOscillator();
                const gainNode2 = audioContext.createGain();
                oscillator2.connect(gainNode2);
                gainNode2.connect(audioContext.destination);
                oscillator2.frequency.value = 1100;
                gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
                gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
                oscillator2.start(audioContext.currentTime);
                oscillator2.stop(audioContext.currentTime + 0.15);
            }, 150);
            break;
    }
}
