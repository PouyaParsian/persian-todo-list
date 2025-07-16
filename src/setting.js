// Check if localStorage is available
function isLocalStorageAvailable() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}

// Select DOM elements
const settingBtn = document.querySelector('.setting-button');
const settingMenu = document.querySelector('.menu');
const body = document.querySelector('body');
const fontRadios = document.querySelectorAll('input[name="font"]');
const themeRadios = document.querySelectorAll('input[name="theme"]');

// Toggle settings menu
settingBtn.addEventListener('click', () => {
    settingMenu.classList.toggle('active');
});

// Font management
function applyFont(font) {
    body.classList.remove('shabnam', 'vazir');
    body.classList.add(font);
}

fontRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (isLocalStorageAvailable()) {
            localStorage.setItem('font', radio.value);
        }
        applyFont(radio.value);
    });
});

const defaultFont = 'shabnam';
const savedFont = isLocalStorageAvailable() ? localStorage.getItem('font') || defaultFont : defaultFont;
applyFont(savedFont);
fontRadios.forEach(radio => {
    radio.checked = radio.value === savedFont;
});

// Theme management
function applyTheme(theme) {
    body.classList.remove('light', 'dark');
    body.classList.add(theme);
}

themeRadios.forEach(radio => {
    radio.addEventListener('change', () => {
        if (isLocalStorageAvailable()) {
            localStorage.setItem('theme', radio.value);
        }
        applyTheme(radio.value);
    });
});

const defaultTheme = 'dark';
const savedTheme = isLocalStorageAvailable() ? localStorage.getItem('theme') || defaultTheme : defaultTheme;
applyTheme(savedTheme);
themeRadios.forEach(radio => {
    radio.checked = radio.value === savedTheme;
});