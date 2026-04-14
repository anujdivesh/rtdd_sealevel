/**
 * Manages the application state in the URL query parameters.
 */

/**
 * Default application settings.
 * The order of keys here determines the order in the URL query string.
 */
export const APP_DEFAULTS = {
    displayHours: 24,
    timezone: 'utc',
    updateInterval: 5,
    windDirectionType: 'meteorological',
    speedUnit: 'ms',
    tempUnit: 'celsius',
    distanceUnit: 'meter',
    pressureUnit: 'hPa'
};

/**
 * Returns an object representing the state parsed from the current URL.
 */
export function getStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const state = {};

    for (const [key, value] of params) {
        let val = value;
        
        // Handle numeric values
        if (!isNaN(val) && val.trim() !== '') {
            val = Number(val);
        }

        state[key] = val;
    }
    return state;
}

/**
 * Updates the URL query parameters based on the provided state.
 * @param {Object} state The current app state.
 * @param {boolean} push Whether to use pushState (new history entry) or replaceState.
 */
export function updateUrlFromState(state, push = false) {
    const params = new URLSearchParams();

    // Only include settings available in the settings modal and the station number.
    const allowedKeys = ['stn_num', ...Object.keys(APP_DEFAULTS)];

    for (const key of allowedKeys) {
        const value = state[key];
        
        // Skip if value is undefined or null
        if (value === undefined || value === null) continue;

        // Skip if value matches default (unless it's stn_num which has no default)
        if (key !== 'stn_num' && value === APP_DEFAULTS[key]) continue;

        params.set(key, value);
    }

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    
    if (push) {
        window.history.pushState(state, '', newUrl);
    } else {
        window.history.replaceState(state, '', newUrl);
    }
}

/**
 * Returns a query string representing the current allowed settings in the state.
 * Used for secondary chart pages.
 */
export function getQueryStringFromState(state) {
    const params = new URLSearchParams();
    const allowedKeys = ['stn_num', ...Object.keys(APP_DEFAULTS)];

    for (const key of allowedKeys) {
        const value = state[key];
        if (value === undefined || value === null) continue;
        if (key !== 'stn_num' && value === APP_DEFAULTS[key]) continue;
        params.set(key, value);
    }
    return params.toString();
}



