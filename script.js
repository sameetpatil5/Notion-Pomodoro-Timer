// Load Pomodoro settings from local storage
const pomodoroSettings = {
  get focus() {
    return parseInt(localStorage.getItem('focusInterval')) || 25;
  },
  get shortBreak() {
    return parseInt(localStorage.getItem('shortBreakInterval')) || 5;
  },
  get longBreak() {
    return parseInt(localStorage.getItem('longBreakInterval')) || 15;
  },
  get focusCount() {
    return parseInt(localStorage.getItem('focusCount')) || 4;
  },
  get sessionCount() {
    return parseInt(localStorage.getItem('sessionCount')) || 4;
  },
  get autoStart() {
    return localStorage.getItem('autoStart') === 'true' || false;
  },
};

// Load UI settings from local storage
const uiSettings = {
  get backgroundColor() {
    return localStorage.getItem('backgroundColor') || '#F1F1EF';
  },
  get fontColor() {
    return localStorage.getItem('fontColor') || '#37352F';
  },
  get font() {
    return localStorage.getItem('font') || 'Rubik';
  },
  get darkMode() {
    return localStorage.getItem('darkMode') === 'true' || false;
  },
  get hideFootnote() {
    return localStorage.getItem('hideFootnote') === 'true' || false;
  },
};

// Global variables
let timeLeft;
let timerInterval;

// Load first time flag from local storage to apply default prefrences
const appState = {
  get isFirstTime() {
    // Return 'false' if 'isFirstTime' is 'false' in localStorage, otherwise return 'true'
    return localStorage.getItem('isFirstTime') === 'false' ? false : true;
  },
};

// Load completed pomodoros, sessions & current interval from local storage
const pomodoroState = {
  get focusCompleted() {
    return parseInt(localStorage.getItem('focusCompleted')) || 0;
  },
  get sessionCompleted() {
    return parseInt(localStorage.getItem('sessionCompleted')) || 0;
  },
  get currentInterval() {
    return localStorage.getItem('currentInterval') || 'pomodoro';
  },
};
// DOM elements

// Timer elements
const timeLeftEl = document.getElementById('time-left');

// Button elements

// Interval Buttons elements
const pomodoroIntervalBtn = document.getElementById('pomodoro-interval-btn');
const shortBreakIntervalBtn = document.getElementById('short-break-interval-btn');
const longBreakIntervalBtn = document.getElementById('long-break-interval-btn');

// Control buttons elements
const startStopBtn = document.getElementById('start-stop-btn');
const resetBtn = document.getElementById('reset-btn');
const settingsBtn = document.getElementById('settings-btn');
const closeModalBtn = document.querySelectorAll('.close-btn');
const saveBtn = document.getElementById('save-btn');
const optionBtn = document.getElementById('option-btn');
const helpBtn = document.getElementById("help-btn");

// Modal elements
const settingsModal = document.getElementById('settings-modal');
const helpModal = document.getElementById("help-modal");
const optionModal = document.getElementById('option-modal');

// Miscallaneous elements
const HideFootNote = document.getElementById('hide-footnote');

// Animation elements
const ripple = document.getElementById('ripple');

// Initialize bootstrap tooltips
const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
  delay: { "show": 1000, "hide": 200 }
}))

// Event Listeners

// Event listener to initialize active interval button
document.addEventListener('DOMContentLoaded', () => {
  initializeTimer();
});

// Event listeners for interval buttons
pomodoroIntervalBtn.addEventListener('click', () => {
  setActiveButton(pomodoroIntervalBtn);  // Set Focus button as active
  currentInterval = 'pomodoro';
  timeLeft = pomodoroSettings.focus * 60;
  updateTimeLeftTextContent();
  resetTimer();
});

shortBreakIntervalBtn.addEventListener('click', () => {
  setActiveButton(shortBreakIntervalBtn);  // Set Short Break button as active
  currentInterval = 'short-break';
  timeLeft = pomodoroSettings.shortBreak * 60;
  updateTimeLeftTextContent();
  resetTimer();
});

longBreakIntervalBtn.addEventListener('click', () => {
  setActiveButton(longBreakIntervalBtn);  // Set Long Break button as active
  currentInterval = 'long-break';
  timeLeft = pomodoroSettings.longBreak * 60;
  updateTimeLeftTextContent();
  resetTimer();
});

// Event listener for start/stop button
startStopBtn.addEventListener('click', () => {
  toggleStartStop();
});

// Event listener for start/stop button using keyboard shortcuts [:Space]
document.addEventListener('keydown', (event) => {
  // Check if the space bar was pressed
  if (event.code === 'Space') {
    event.preventDefault();

    // Toggle start/stop logic only when window in focus
    if (document.hasFocus()) {
      toggleStartStop();
    }
  }
});

// Event listener to Reset the Timer on double click [:dblclick]
window.addEventListener('dblclick', (event) => {
  const timerContainer = document.getElementById('timer-container');
  if (timerContainer.contains(event.target)) {
    resetTimer();
  }
});

// Event listener to reset timer using keyboard shortcuts [:ctrl + Space]
document.addEventListener('keydown', (event) => {
  if (event.ctrlKey && event.code === 'Space') {
    event.preventDefault(); 
    resetTimer();
  }
});

// Event listener for Focus Interval button
document.addEventListener('keydown', (event) => {
  if (event.altKey && event.code === 'Digit1') {
    pomodoroIntervalBtn.click();
    resetTimer();
  }
});

// Event listener for Short Break Interval button
document.addEventListener('keydown', (event) => {
  if (event.altKey && event.code === 'Digit2') {
    shortBreakIntervalBtn.click();
    resetTimer();
  }
});

// Event listener for Long Break Interval button
document.addEventListener('keydown', (event) => {
  if (event.altKey && event.code === 'Digit3') {
    longBreakIntervalBtn.click();
    resetTimer();
  }
});

// Event listener for option button to show options tooltip
optionBtn.addEventListener('click', () => {
  if (!optionModal.classList.contains('show')) {
    bootstrap.Tooltip.getInstance('#option-btn').disable()
  } else {
      bootstrap.Tooltip.getInstance('#option-btn').enable();
      bootstrap.Tooltip.getInstance('#option-btn').hide(200);
  }
});

// Event listener for option button to show options
optionBtn.addEventListener('click', (event) => {
  // optionBtn.classList.toggle('active');
  event.stopPropagation();
  const icon = optionBtn.querySelector('i');

  if (icon.classList.contains('fa-o')) {
    icon.classList.replace('fa-o', 'fa-times');
    optionBtn.classList.add('active');
    optionModal.classList.add('show');
  } else {
    icon.classList.replace('fa-times', 'fa-o');
    optionBtn.classList.remove('active');
    optionModal.classList.remove('show');
  }
});

// Close option modal if clicked outside of option modal 
window.addEventListener('click', (event) => {
  // Prevent closing the modal when clicking on the option button or inside the modal
  if (event.target === optionBtn || optionModal.contains(event.target)) return;

  // Check if any modal is open
  let isModalOpen = false;
  const modals = document.querySelectorAll('.modal');
  modals.forEach((modal) => {
    if (modal.style.display === 'flex' && isModalOpen ===false) {
      isModalOpen = true;
    }
  });

  // Close modal only if it's active and visible
  if (optionBtn.classList.contains('active') && optionModal.classList.contains('show') && !isModalOpen) {
    const icon = optionBtn.querySelector('i');
    icon.classList.replace('fa-times', 'fa-o');
    optionBtn.classList.remove('active');
    optionModal.classList.remove('show');
  }
});

// Event listner to open option model using keyboard shortcut [alt+o]
document.addEventListener('keydown', (event) => {
  if (event.altKey && event.code === 'KeyO') {
    optionBtn.click();
  }
});

// Event listener for escape key to close modals
window.addEventListener('keydown', (event) => {
  if (event.code === 'Escape') {
    const modals = document.querySelectorAll('.modal');
    modals.forEach((modal) => {
      if (modal.style.display === 'flex') {
        toggleModal(modal, null, 'close');
      }
    });
  }
})

// Event listener for outside click to close modals
window.addEventListener('click', (event) => {
  const modals = document.querySelectorAll('.modal'); // Common class for all modals
  modals.forEach((modal) => {
    if (event.target === modal) {
      toggleModal(modal, null, 'close');
    }
  });
});

// Event listener for help button to open/close help modal
helpBtn.addEventListener('click', () => {
  toggleModal(helpModal, helpBtn, 'open');
});

// Event listener for help model to open using keyborad shortcut [alt+H]
document.addEventListener('keydown', (event) => {
  if (event.altKey && event.code === 'KeyH') {
    toggleModal(helpModal, helpBtn);
  }
})

// Event listener for reset button
resetBtn.addEventListener('click', () => {
  // Hard Reset the timer
  // TODO: Add hard reset popup/ modal to confirm/ confirm
  localStorage.clear();
  resetTimer();
  location.reload();
});

// Event listener to hard reset using keyborad shortcut [alt+R]
document.addEventListener('keydown', (event) => {
  if (event.altKey && event.code === 'KeyR') {
    resetBtn.click();
  }
})

// Event listeners for settings to open/close modal
settingsBtn.addEventListener('click', () => {
  toggleModal(settingsModal, settingsBtn, 'open');
});

// Event listener for settings model to open using keyborad shortcut [alt+S]
document.addEventListener('keydown', (event) => {
  if (event.altKey && event.code === 'KeyS') {
    toggleModal(settingsModal, settingsBtn);
  }
})

// Event listener for close buttons for all modals
closeModalBtn.forEach((btn) => btn.addEventListener('click', (event) => {
  event.stopPropagation();
  toggleModal(settingsModal, settingsBtn, 'close');
  toggleModal(helpModal, helpBtn, 'close');
}));

// Event listener for outside click to close modals
window.addEventListener('click', (event) => {
  const modals = document.querySelectorAll('.modal'); // Common class for all modals
  modals.forEach((modal) => {
    if (event.target === modal) {
      toggleModal(modal, null, 'close');
    }
  });
});

// Event listeners for each setting change (to update UI dynamically)
document.getElementById('background-color').addEventListener('change', updateUISettings);
document.getElementById('font-color').addEventListener('change', updateUISettings);
document.getElementById('font').addEventListener('change', updateUISettings);
document.getElementById('dark-mode').addEventListener('change', updateUISettings);
document.getElementById('hide-footnote').addEventListener('change', updateUISettings);

// Event listener for tab buttons navigation
document.addEventListener("DOMContentLoaded", () => {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons and contents
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to the clicked button and corresponding content
      button.classList.add("active");
      document.getElementById(button.dataset.tab).classList.add("active");
    });
  });
});


// Event listener for dark mode toggle to filter Background color and Font color options
document.addEventListener('DOMContentLoaded', () => {
  const darkModeToggle = document.getElementById('dark-mode');

  const filterOptions = () => {
    const isDarkMode = darkModeToggle.checked;
    const theme = isDarkMode ? 'dark' : 'light';

    // Filter background color options
    [...document.getElementById('background-color').options].forEach(option => {
      option.style.display = option.dataset.theme === theme ? 'block' : 'none';
    });

    // Filter font color options
    [...document.getElementById('font-color').options].forEach(option => {
      option.style.display = option.dataset.theme === theme ? 'block' : 'none';
    });
  };

  // Initial filter
  filterOptions();

  // Update options when toggle changes
  darkModeToggle.addEventListener('change', filterOptions);
});

// Event listener for save button to save preferences
saveBtn.addEventListener('click', (event) => {
  event.stopPropagation();
  try {
    // Retrieve new UI preferences from input fields or selectors
    const newBackgroundColor = document.getElementById('background-color').value;
    const newFontColor = document.getElementById('font-color').value;
    const newFont = document.getElementById('font').value;
    const newDarkMode = document.getElementById('dark-mode').checked ? 'true' : 'false';
    const newHideFootnote = document.getElementById('hide-footnote').checked ? 'true' : 'false';

    // Save new UI settings to localStorage
    localStorage.setItem('backgroundColor', newBackgroundColor);
    localStorage.setItem('fontColor', newFontColor);
    localStorage.setItem('font', newFont);
    localStorage.setItem('darkMode', newDarkMode);
    localStorage.setItem('hideFootnote', newHideFootnote);

    // Retrieve new Pomodoro settings from input fields
    const newFocusInterval = parseInt(document.getElementById('focus-interval').value, 10);
    const newShortBreakInterval = parseInt(document.getElementById('short-break-interval').value, 10);
    const newLongBreakInterval = parseInt(document.getElementById('long-break-interval').value, 10);
    const newFocusCount = parseInt(document.getElementById('focus-count').value, 10);
    const newSessionCount = parseInt(document.getElementById('session-count').value, 10);
    const newAutoStart = document.getElementById('auto-start').checked ? 'true' : 'false';

    // Apply the new settings to the timer
    updatePomodoroSettings(newFocusInterval, newShortBreakInterval, newLongBreakInterval, newFocusCount, newSessionCount, newAutoStart);
    updateUISettings();

    // Apply the new preferences
    applyUserPreferences();
  } catch (error) {
    console.error('Error saving preferences:', error);
  } finally {
    // Close the settings modal
    toggleModal(settingsModal, settingsBtn, 'close');
  }
});

// Funtions

// Function to start the timer
function startTimer() {
  setStartStopButtonState();

  if (timerInterval) return; 
  timerInterval = setInterval(() => {
    if (timeLeft > 0) {
      timeLeft--;
      updateTimeLeftTextContent();
    } else {
      clearInterval(timerInterval);
      timerInterval = null;
      timerHandler();
    }
  }, 1000);
}

// Function to stop the timer
function stopTimer() {
  resetStartStopButtonState();

  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

// Handle timer completion logic (e.g., auto-start next interval or notify user)
function timerHandler() {
  // TODO: Implement Auto Start logic
  // if (pomodoroSettings.autoStart) {
  if (true) {
    if (currentInterval === 'pomodoro') {
      focusCompleted++;
      if (focusCompleted % pomodoroSettings.focusCount === 0) {
        currentInterval = 'long-break';
        timeLeft = pomodoroSettings.longBreak * 60;
        setActiveButton(longBreakIntervalBtn);
      } else {
        currentInterval = 'short-break';
        timeLeft = pomodoroSettings.shortBreak * 60;
        setActiveButton(shortBreakIntervalBtn);
      }
    } else {
      currentInterval = 'pomodoro';
      timeLeft = pomodoroSettings.focus * 60;
      setActiveButton(pomodoroIntervalBtn);
    }
    startTimer(); // Auto-start next interval
  } else {
    alert('Timer completed!');
  }
}

// Function to reset the timer
function resetTimer() {
  // Reset the animation (allows retriggering)
  ripple.classList.remove('animate');
  void ripple.offsetWidth; // Trigger reflow to restart animation

  // Add the animation class
  ripple.classList.add('animate');

  stopTimer(); // Stop the timer

  // Add fade-out animation to text
  timeLeftEl.classList.add('fade-out');

  setTimeout(() => {
    // Update the timer value after fade-out
    // Update the timer based on the current interval
    initializeTimer();
    resetStartStopButtonState();

    // Fade in the text
    timeLeftEl.classList.remove('fade-out');
    timeLeftEl.classList.add('fade-in');
  }, 300); // Match the fade-out duration in CSS

  // Remove the fade-in class after animation
  setTimeout(() => {
    timeLeftEl.classList.remove('fade-in');
  }, 600); // Allow fade-in to complete
}

// Function to set the start/stop button state to active
function setStartStopButtonState() {
  startStopBtn.textContent = 'Stop';
  startStopBtn.classList.add('active');
}

// Function to reset the start/stop button active state
function resetStartStopButtonState() {
  startStopBtn.textContent = 'Start';
  startStopBtn.classList.remove('active');
}

// Funtion to toggle Start/Stop for timer
function toggleStartStop() {
  if (startStopBtn.textContent === 'Start') {
    startTimer();  // Start the timer
    // startStopBtn.textContent = 'Stop';
    // startStopBtn.classList.add('active');
    setStartStopButtonState();
  } else {
    stopTimer();  // Stop the timer
    // startStopBtn.textContent = 'Start';
    // startStopBtn.classList.remove('active');
    resetStartStopButtonState();
  }
}

// Function to set an interval button as active and reset the others
function setActiveButton(activeButton) {
  const intervalButtons = [pomodoroIntervalBtn, shortBreakIntervalBtn, longBreakIntervalBtn];
  intervalButtons.forEach((btn) => btn.classList.remove('active'));
  activeButton.classList.add('active');

  // Save the active interval to localStorage
  if (activeButton === pomodoroIntervalBtn) {
    localStorage.setItem('currentInterval', 'pomodoro');
  } else if (activeButton === shortBreakIntervalBtn) {
    localStorage.setItem('currentInterval', 'short-break');
  } else if (activeButton === longBreakIntervalBtn) {
    localStorage.setItem('currentInterval', 'long-break');
  }
}

// Function to update the time left text content for timer
function updateTimeLeftTextContent() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timeLeftEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Function to hide the tooltip
function hideTooltip() {
    setTimeout(() => {
        bootstrap.Tooltip.getInstance('#option-btn').hide();
    }, 100);
}

// Function to toggle modal visibility on close button click and outside window click
function toggleModal(modal, button, action = 'toggle') {
  const isActive = modal.style.display === 'flex';

  if (button == null && action === 'close') {
    modal.style.display = 'none';
    settingsBtn.classList.remove('active');
    helpBtn.classList.remove('active');
  }

  if (action === 'toggle') {
    modal.style.display = isActive ? 'none' : 'flex';
    button?.classList.toggle('active', !isActive);
  } else if (action === 'open') {
    modal.style.display = 'flex';
    button?.classList.add('active');
  } else if (action === 'close') {
    modal.style.display = 'none';
    button?.classList.remove('active');
  }
}

// Function to initialize page on first load
function applyPreferences() {
  // TODO: Implement initialize logic
  if (appState.isFirstTime) {
    localStorage.setItem('isFirstTime', 'false');
    // Apply default preferences
  } else {
    applyUserPreferences();
  }
}

// Function to apply the user's saved preferences
function applyUserPreferences() {

  // Apply the UI preferences
  document.body.style.backgroundColor = uiSettings.backgroundColor;
  document.body.style.color = uiSettings.fontColor;
  // timeLeftEl.style.color = fontColor;
  // Update the buttons' font and background color
  const buttons = document.querySelectorAll('.interval-btn, #start-stop-btn, #option-btn, #settings-btn, #reset-btn, #help-btn');
  // TODO: fix the buttons
  buttons.forEach((button) => {
    button.style.color = fontColor;
    button.style.backgroundColor = backgroundColor;
    button.style.borderColor = fontColor;
  });

  // Highlight the default interval button on page load
  // setActiveButton(pomodoroIntervalBtn);
  initializeTimer();
}

// Function to update the Pomodoro settings
function updatePomodoroSettings(newFocus, newShortBreak, newLongBreak, newFocusCount, newSessionCount, newAutoStart) {
  // Compare the current settings (from localStorage) with the new ones
  const settingsChanged = 
    pomodoroSettings.focus !== newFocus || 
    pomodoroSettings.shortBreak !== newShortBreak || 
    pomodoroSettings.longBreak !== newLongBreak || 
    pomodoroSettings.focusCount !== newFocusCount || 
    pomodoroSettings.sessionCount !== newSessionCount;

  // If any core settings changed, reset progress
  if (settingsChanged) {
    localStorage.setItem('focusCompleted', 0);
    localStorage.setItem('sessionCompleted', 0);
    localStorage.setItem('currentInterval', 'pomodoro');
  }

  // Save the new settings to localStorage
  localStorage.setItem('focusInterval', newFocus);
  localStorage.setItem('shortBreakInterval', newShortBreak);
  localStorage.setItem('longBreakInterval', newLongBreak);
  localStorage.setItem('focusCount', newFocusCount);
  localStorage.setItem('sessionCount', newSessionCount);
  localStorage.setItem('autoStart', newAutoStart);

  // Update the Pomodoro timer based on the new settings
  initializeTimer();
}

// Function to update the UI settings dynamically 
function updateUISettings() {
  const newBackgroundColor = document.getElementById('background-color').value;
  const newFontColor = document.getElementById('font-color').value;
  const newFont = document.getElementById('font').value;
  const newDarkMode = document.getElementById('dark-mode').checked ? 'true' : 'false';
  const newHideFootnote = document.getElementById('hide-footnote').checked ? 'true' : 'false';

  // Apply changes immediately to UI
  document.body.style.backgroundColor = newBackgroundColor;
  document.body.style.color = newFontColor;
  document.body.style.fontFamily = newFont;

  // Toggle dark mode if applicable
  if (newDarkMode === 'true') {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }

  // Toggle hide footnote if applicable
  if (newHideFootnote === 'true') {
    document.getElementById('main-foot-note').style.display = 'none';
  } else {
    document.getElementById('main-foot-note').style.display = 'block';
  }
}

function initializeTimer() {
  const currentInterval = pomodoroState.currentInterval;

  if (currentInterval === 'short-break') {
    setActiveButton(shortBreakIntervalBtn);
    timeLeft = pomodoroSettings.shortBreak * 60;
  } else if (currentInterval === 'long-break') {
    setActiveButton(longBreakIntervalBtn);
    timeLeft = pomodoroSettings.longBreak * 60;
  } else if (currentInterval === 'pomodoro') {
    setActiveButton(pomodoroIntervalBtn);
    timeLeft = pomodoroSettings.focus * 60;
  }

  updateTimeLeftTextContent();
}

applyPreferences();