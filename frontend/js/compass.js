
import { appState } from './sea_level.js';

// Create degree marks
export function createDegreeMarks() {
    const degreeMarks = document.getElementById('degreeMarks');

    // Create marks every 10 degrees
    for (let i = 0; i < 360; i += 10) {
        const mark = document.createElement('div');
        mark.className = i % 30 === 0 ? 'degree-mark major' : 'degree-mark';
        mark.style.transform = `translateX(-50%) rotate(${i}deg)`;
        degreeMarks.appendChild(mark);
    }

    // Responsive scaling for the compass so that it fits within the container on smaller screens
    const wrapper = document.querySelector('.compass-scale-wrapper');
    const container = document.querySelector('.compass-container');
    if (wrapper && container) {
        const observer = new ResizeObserver(entries => {
            for (let entry of entries) {
                const width = entry.contentRect.width;
                // Base width is 300px
                const scale = Math.min(1, width / 300);
                container.style.transform = `scale(${scale})`;
            }
        });
        observer.observe(wrapper);
    }
}


// Convert degrees to cardinal direction
function degreesToCardinal(degrees) {
    const directions = [
        "North", "North-Northeast", "Northeast", "East-Northeast",
        "East", "East-Southeast", "Southeast", "South-Southeast",
        "South", "South-Southwest", "Southwest", "West-Southwest",
        "West", "West-Northwest", "Northwest", "North-Northwest"
    ];

    const index = Math.round(degrees / 22.5) % 16;
    return directions[index];
}

// Main function to show wind direction
export function showWindDirection(dir, speed) {
    const windArrow = document.getElementById('windArrow');
    const windDirectionText = document.getElementById('windDirectionText');
    const windDegrees = document.getElementById('windDegrees');

    // Hide arrow if wind speed is zero or null
    if (speed === null || speed === undefined || speed === 0) {
        windArrow.classList.add('hidden');
        windDirectionText.textContent = '--';
        windDegrees.textContent = '--';
        return;
    }

    // Show arrow
    windArrow.classList.remove('hidden');

    // Ensure direction is within 0-360 range
    let direction = parseFloat(dir);
    if (isNaN(direction)) {
        direction = 0;
    }

    // TODO: clean this up.  This is a bit messy because we are
    // checking the oceanographic/meteorological wind type twice.

    if (appState.windDirectionType === 'oceanographic') {
        direction = direction + 180;
    }
    direction = ((direction % 360) + 360) % 360;

    // Rotate arrow to show wind direction
    windArrow.style.transform = `translate(-50%, -100%) rotate(${direction}deg)`;

    // Update text displays
    windDirectionText.textContent = degreesToCardinal(direction);
    windDegrees.textContent = `${Math.round(direction)}°`;
}
