import {createDegreeMarks, showWindDirection} from './compass.js';
import {getStateFromUrl, updateUrlFromState, APP_DEFAULTS, getQueryStringFromState} from './url_manager.js';

const apiBaseUrl = import.meta.env.VITE_API_HOSTNAME || window.location.origin;
const stationMap = {};  // A map that maps station numbers onto station objects
const reverseStationMap = new Map(); // a map that maps station names onto station objects
const stationLayerMap = new Map();
const displayNames = [];
let map;
const stationDetails = new Map();
let allStations = [];
let intervalId;
export let appState = {};

/**
 * Mapping of HTML element IDs to their corresponding property names in appState.
 */
const UI_MAPPINGS = {
    'speed-units': 'speedUnit',
    'pressure-units': 'pressureUnit',
    'display-hours': 'displayHours',
    'timezone': 'timezone',
    'update-interval': 'updateInterval',
    'wind-direction-type': 'windDirectionType',
    'temperature-units': 'tempUnit',
    'distance-units': 'distanceUnit',
    'station-select': 'stn_num'
};

// Expose variables to window for inline scripts
window.appState = appState;
window.stationMap = stationMap;
window.stationDetails = stationDetails;
window.getQueryStringFromState = getQueryStringFromState;
window.getStateFromUrl = getStateFromUrl;
window.APP_DEFAULTS = APP_DEFAULTS;
window.celsiusToFahrenheit = celsiusToFahrenheit;
window.metersToFeet = metersToFeet;
window.hPaToPsi = hPaToPsi;
window.msToKnots = msToKnots;
window.msToKmh = msToKmh;


document.addEventListener("DOMContentLoaded", function () {
    initialise();
});

// Initialize the compass
/*
document.addEventListener('DOMContentLoadedXXX', function() {
    createDegreeMarks();
    showWindDirection(0); // Start pointing north
});
 */


function initialise() {
    // Only initialise dashboard functionality if on a page with a map
    if (!document.getElementById('map')) {
        return;
    }

    // Merge defaults with URL state
    const urlState = getStateFromUrl();
    Object.assign(appState, APP_DEFAULTS, urlState);

    initMap();
    loadStations();
    closeSearchModal();

    // Attach event listeners to settings elements
    Object.keys(UI_MAPPINGS).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener('change', () => updateState(id));
        } else {
            console.warn(`Element with ID '${id}' not found`);
        }
    });

    // Re-populate station dropdown when network changes
    document.getElementById('network-select').addEventListener('change', populateStationDropdown);

    window.addEventListener('popstate', () => {
        const newState = getStateFromUrl();
        Object.assign(appState, newState);
        syncUIToState();
        if (appState.stn_num) refreshPage(appState.stn_num);
    });

    const mapModal = document.getElementById('search');
    if (mapModal) {
        mapModal.addEventListener('shown.bs.modal', function () {
            map.invalidateSize();
        });
    }

    // Need to resize diag charts when modal is shown otherwise the latest data is not visible.
    const diagnosticsModal = document.getElementById('diagnostics');
    if (diagnosticsModal) {
        diagnosticsModal.addEventListener('shown.bs.modal', function () {
            Plotly.Plots.resize('enclosure-battery-chart');
            Plotly.Plots.resize('enclosure-temperature-chart');
        });
    }

    if (document.getElementById('degreeMarks')) {
        createDegreeMarks();
        showWindDirection(0, null);
    }

    if (document.getElementById('start-date')) {
        initDownloadModal();
    }

}

/**
 * Synchronises UI components (dropdowns, title) with the current appState.
 */
function syncUIToState() {
    // Loop through each mapping and update the corresponding UI element
    Object.entries(UI_MAPPINGS).forEach(([id, stateKey]) => {
        const el = document.getElementById(id);
        const value = appState[stateKey];
        if (el && value !== undefined) el.value = value;
    });

    if (appState.stn_name && appState.stn_num) {
        document.title = `Pacific Sea Level Dashboard - ${appState.stn_name}`;
    }
}

// On startup, check if there is a station number in the URL
function checkStartup() {
    syncUIToState();
    if (appState.stn_num) {
        refreshPage(appState.stn_num);
    }
}

function shortDate(date) {
    // Given a date object, return a string
    // of the form yyyy-mm-dd

    const datePart = date.toISOString(date).split('T')[0];
    return datePart;
}


function initDownloadModal() {

    let endDate = new Date();
    let startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    document.getElementById('start-date').value = shortDate(startDate);
    document.getElementById('end-date').value = shortDate(endDate);


}


// Given a URL like 'www.example.com?name=martin&age=23...
// return a dictionary: {"name":martin", "age":23...}
function parseUrl(params) {
    return Object.fromEntries(
        Array.from(params.entries()).map(([key, value]) => {
            const numValue = Number(value);
            return [key, !isNaN(numValue) && value !== '' ? numValue : value];
        })
    );
}


function updateState(id) {
    const value = document.getElementById(id).value;
    appState[UI_MAPPINGS[id]] = isNumeric(value) ? Number(value) : value;

    updateUrlFromState(appState);

    if (id === 'station-select' || id === 'display-hours') {
        refreshPage(appState['stn_num']);
        return;
    }

    if (id === 'update-interval') {
        modifyUpdateInterval();
        return;
    }

    refreshText();
    refreshCompass();
    refreshSeaLevelChartPlotly();
}


function initMap() {
    const mapElement = document.getElementById('map');
    if (!mapElement || typeof L === 'undefined') {
        console.log('Map element not found or Leaflet (L) not defined. Skipping map initialisation.');
        return;
    }

    map = L.map('map', {
        maxZoom: 20,
        minZoom: 3
    }).setView([-27.0, 130.0], 3);
// todo: check copyright on map
    const url = 'https://maps.eatlas.org.au/maps/wms';
    L.tileLayer.wms(url,
        {
            layers: "ea-be:World_Bright-Earth-e-Atlas-basemap"
        }).addTo(map);

    map.attributionControl.addAttribution("<a href='https://e-atlas.org.au/data/uuid/ac57aa5a-233b-4c2c-bd52-1fb40a31f639'>Bright Earth eAtlas</a>");

    const legend = L.control({position: 'bottomleft'});
    legend.onAdd = function () {
        const div = L.DomUtil.create('div');
        div.style.cssText = 'background:white;padding:8px 10px;border-radius:4px;line-height:1.8;font-size:13px;';
        div.innerHTML = [
            ['#18B104', 'Active'],
            ['#FC0006', '1 – 24 hours'],
            ['#000000', '> 24 hours'],
        ].map(([color, label]) =>
            `<span style="display:inline-block;width:12px;height:12px;border-radius:50%;background:${color};margin-right:6px;vertical-align:middle;"></span>${label}`
        ).join('<br>');
        return div;
    };
    legend.addTo(map);

    // Expose map to window for other modules
    window.map = map;
}


function formatValue(siValue, type) {
    if (type === 'speed') {
        if (appState['speedUnit'] === 'knots') {
            return msToKnots(siValue).toFixed(1) + '<sup>knots</sup>';
        } else if (appState['speedUnit'] === 'kmh') {
            return msToKmh(siValue).toFixed(1) + '<sup>km/h</sup>';
        }
        return siValue.toFixed(1) + '<sup>m/s</sup>';
    }

    if (type === 'temp') {
        if (appState['tempUnit'] === 'celsius') {
            return siValue.toFixed(1) + '<sup>°C</sup>';
        } else {
            return (celsiusToFahrenheit(siValue)).toFixed(1) + '<sup>°F</sup>'
        }
    }

    if (type === 'pressure') {
        if (appState['pressureUnit'] === 'psi') {
            return hPaToPsi(siValue).toFixed(2) + '<sup>psi</sup>';
        }
        return siValue.toFixed(1) + '<sup>hPa</sup>';
    }

    if (type === 'dist') {
        if (appState['distanceUnit'] === 'feet') {
            return metersToFeet(siValue).toFixed(2) + '<sup>ft</sup>'
        }

        return siValue.toFixed(2) + '<sup>m</sup>';
    }

    if (type === 'direction') {
        if (appState['windDirectionType'] === 'oceanographic') {
            return `<span>${((siValue + 180) % 360).toFixed(0)}</span><sup>°</sup>`;
        }
        return `<span>${siValue.toFixed(0)}</span><sup>°</sup>`;
    }

    if (type === 'voltage') {
        return `<span>${siValue.toFixed(1)}</span><sup>V</sup>`;
    }
}


/**
 * Gets the IANA timezone string for a given station.
 * @param {string|number} stationNumber The station number.
 * @returns {string} The timezone string, or 'UTC' if not found.
 */
function getStationTimezone(stationNumber) {
    let details = stationDetails.get(stationNumber);

    if (!details) {
        // Handle potential type mismatch in Map keys
        if (typeof stationNumber === 'string') {
            details = stationDetails.get(Number(stationNumber));
        } else if (typeof stationNumber === 'number') {
            details = stationDetails.get(String(stationNumber));
        }
    }

    return details ? details.timezone : 'UTC';
}

/**
 * Calculates the millisecond offset for the current station when local time is selected.
 * @param {string|number} stationNumber The station number.
 * @returns {number} Offset in milliseconds.
 */
function getStationOffset(stationNumber) {
    if (appState.timezone !== 'lct') return 0;

    const timezone = getStationTimezone(stationNumber);
    if (!timezone || timezone === 'UTC') return 0;

    try {
        const testDate = new Date();
        const utcTime = testDate.getTime();
        const localTimeStr = testDate.toLocaleString('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });

        // Use regex to parse the locale string
        // Example: "08/01/2026, 14:05:32"
        // Capture groups: 1=day, 2=month, 3=year, 4=hour, 5=minute, 6=second
        const match = localTimeStr.match(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/);
        if (!match) return 0;

        const [, month, day, year, hour, minute, second] = match;
        const localTime = Date.UTC(year, month - 1, day, hour, minute, second);
        return localTime - utcTime;
    } catch (error) {
        console.error('Error calculating station offset:', error);
        return 0;
    }
}

/**
 * Adjusts a UTC date for display based on the current timezone setting.
 * @param {Date|string|number} utcDate The UTC date to adjust.
 * @returns {Date} A new Date object adjusted for local display if needed.
 */
function toDisplayDate(utcDate) {
    const date = new Date(utcDate);
    const offset = getStationOffset(appState.stn_num);
    return new Date(date.getTime() + offset);
}

/**
 * Formats a UTC time string for display, accounting for the current timezone setting.
 * @param {string} val ISO 8601 UTC time string.
 * @param {string|number} stationNumber The station number.
 * @returns {string} Formatted time string.
 */
function formatTime(val, stationNumber) {
    // If UTC:
    if (appState.timezone === 'utc') {
        return val + ' (UTC)';
    }
    const timezone = getStationTimezone(stationNumber);
    if (timezone === 'UTC') {
        return val + ' (UTC)';
    }
    // If local time:
    const localTime = convertUTCToTimezone(val, timezone);
    // Includes UTC fallback
    return localTime ? `${localTime} (local)` : `${val} (UTC)`;
}

// Expose functions to window for inline scripts
window.formatTime = formatTime;
window.getStationTimezone = getStationTimezone;
window.getStationOffset = getStationOffset;
window.toDisplayDate = toDisplayDate;
window.mergeTideObs = mergeTideObs;
window.refreshSeaLevelChartPlotly = refreshSeaLevelChartPlotly;

/**
 * Converts a UTC time string to a local time string for a specific timezone.
 * @param {string} utcTimeString ISO 8601 UTC time string.
 * @param {string} timezone IANA timezone string.
 * @returns {string|null} Formatted local time string or null on error.
 */
function convertUTCToTimezone(utcTimeString, timezone) {
    try {
        if (!utcTimeString || !timezone) {
            throw new Error('Both UTC time string and timezone are required');
        }

        // Ensure Z suffix for UTC parsing if no offset is present
        const dateStr = (utcTimeString.endsWith('Z') || utcTimeString.includes('+'))
            ? utcTimeString
            : utcTimeString + 'Z';

        const utcDate = new Date(dateStr);

        if (isNaN(utcDate.getTime())) {
            throw new Error('Invalid UTC time string');
        }

        return utcDate.toLocaleString('en-AU', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    } catch (error) {
        console.error('Error converting timezone:', error.message);
        return null;
    }
}


function celsiusToFahrenheit(celsius) {
    return (celsius * 9 / 5) + 32;
}


function hPaToPsi(hPa) {
    return hPa * 0.0145037738;
}


function msToKnots(ms) {
    return ms * 1.94384;
}

function msToKmh(ms) {
    return ms * 3.6;
}

function metersToFeet(meters) {
    return meters * 3.28084;
}


function jsonToGeoJson(input) {

    return ({
        "type": "FeatureCollection",
        "features": input.map(d => ({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [d.longitude, d.latitude],
            },
            "properties": {...d},
        })),
    });
}


function updateHeader() {
    const stn_num = appState['stn_num'];
    const stn_name = appState['stn_name'];

    // updateHeader is called when a station is loaded/changed.
    // We want this to be a history entry i.e. user clicks back in browser 
    // and it goes to the prev station.
    updateUrlFromState(appState, true);
    syncUIToState();
}


function updateStationSelect(feature) {
    const stnNum = feature.properties.stn_num;
    const network = stationDetails.get(stnNum).network;
    const networkSelect = document.getElementById('network-select');
    const stationSelect = document.getElementById('station-select');
    networkSelect.value = network;
    populateStationDropdown();
    stationSelect.value = stnNum;
}


function clearFields(fields) {
    const set = (id) => { const el = document.getElementById(id); if (el) el.innerHTML = '--'; };
    set('air-temperature');
    set('mslp');
    set('water-level');
    set('water-temperature');
    set('wind-speed');
    set('gust-speed');
    set('wind-direction');
    set('enclosure-temperature');
    set('enclosure-temperature-modal');
    set('battery-voltage');
    set('battery-voltage-modal');
    set('residual');
}


function isNumeric(value) {
    return !isNaN(value) && isFinite(value);
}


function noNull(value, type) {
// return text if value is null
    if (!value || !isNumeric(value)) return '--';
// if (decimals === 0) return value;
    return formatValue(value, type);
}


function refreshEnclosureBattery() {
    const ts = appState['timeSeries'];
    const data = ts.filter(obs => new Date(obs.utc).getMinutes() % 5 === 0);

    const isLct = appState.timezone === 'lct';
    const xData = data.map(item => toDisplayDate(item.utc));

    const trace = {
        x: xData,
        y: data.map(item => item.battery_voltage),
        type: 'scatter',
        mode: 'lines',
        name: 'Battery Voltage',
        line: {color: '#3498db', width: 2},
        fill: 'tozeroy',
        fillcolor: 'rgba(52, 152, 219, 0.1)'
    };

    const layout = {
        margin: {t: 10, r: 10, b: 40, l: 40},
        xaxis: {title: `Time (${isLct ? 'Local' : 'UTC'})`},
        yaxis: {title: 'Voltage (V)'},
        font: {family: 'Roboto', size: 12},
        annotations: [{
            text: "COSPPac",
            x: 0.08,
            y: 0.08,
            xref: 'paper',
            yref: 'paper',
            xanchor: 'center',
            yanchor: 'left',
            showarrow: false,
            font: {
                size: 12,
                color: 'rgba(0, 0, 0, 0.15)'
            }
        }]
    };

    Plotly.newPlot('enclosure-battery-chart', [trace], layout, {responsive: true});
}


function modifyUpdateInterval() {

    const intervalMs = document.getElementById('update-interval').value * 60 * 1000;

    if (intervalId) {
        clearInterval(intervalId);
    }

    // Only set up a new interval if a station is selected
    if (appState['stn_num']) {
        intervalId = setInterval(() => {
            refreshPage(appState['stn_num']);
        }, intervalMs);
    }

    return intervalId;
}


function refreshEnclosureTemperature() {
    const ts = appState['timeSeries'];
    const data = ts.filter(obs => new Date(obs.utc).getMinutes() % 5 === 0);

    const isLct = appState.timezone === 'lct';
    const xData = data.map(item => toDisplayDate(item.utc));

    const trace = {
        x: xData,
        y: data.map(item => item.enclosure_temperature),
        type: 'scatter',
        mode: 'lines',
        name: 'Enclosure Temp',
        line: {color: '#3498db', width: 2},
        fill: 'tozeroy',
        fillcolor: 'rgba(52, 152, 219, 0.1)'
    };

    const layout = {
        margin: {t: 10, r: 10, b: 40, l: 40},
        xaxis: {title: `Time (${isLct ? 'Local' : 'UTC'})`},
        yaxis: {title: 'Temp (°C)'},
        font: {family: 'Roboto', size: 12}
    };

    Plotly.newPlot('enclosure-temperature-chart', [trace], layout, {responsive: true});
}


function refreshText() {
    let values = appState['timeSeries'];
    //if (values.length === 0) {
    //    clearFields();
    //    alert("No data found.");
    //    return;
    //}

    // let stationNumber = values[0].stn_num;
    let stationNumber = appState['stn_num'];
    let endTimeLoc = appState['mrgData'].get(Date.parse(appState['endTime']));
    if (!appState['latest'] || appState['latest'].length === 0) {
        clearFields();
        return;
    }
    let current = appState['latest'][0];
    // let residual = current.wtr_level - endTimeLoc.height;
    // Handle case where tide predictions might not be available
    let predictedHeight = endTimeLoc && endTimeLoc.height ? endTimeLoc.height : null;
    let residual = predictedHeight !== null ? current.wtr_level - predictedHeight : null;
    document.getElementById('station-info').innerHTML = `${appState.stn_name} (${stationNumber})`;
    document.getElementById('station-metadata').innerHTML = `Last observation: ${formatTime(current.utc, stationNumber)}`;
    document.getElementById('air-temperature').innerHTML = noNull(current.air_temp, 'temp');
    document.getElementById('water-temperature').innerHTML = noNull(current.wtr_temp, 'temp');
    document.getElementById('mslp').innerHTML = noNull(current.pressure, 'pressure');
    document.getElementById('water-level').innerHTML = noNull(current.wtr_level, 'dist');
    document.getElementById('wind-speed').innerHTML = noNull(current.wind_spd, 'speed');
    document.getElementById('gust-speed').innerHTML = noNull(current.wind_spd_max, 'speed');
    document.getElementById('wind-direction').innerHTML = noNull(current.wind_dir, 'direction');
    if (appState.windDirectionType === 'oceanographic') {
        document.getElementById('direction-type').innerHTML = 'Oceanographic';
        if (document.getElementById('direction-type-rose')) {
            document.getElementById('direction-type-rose').innerHTML = 'Oceanographic';
        }
    } else {
        document.getElementById('direction-type').innerHTML = 'Meteorological';
        if (document.getElementById('direction-type-rose')) {
            document.getElementById('direction-type-rose').innerHTML = 'Meteorological';
        }
    }
    // document.getElementById('direction-type') = appState
    document.getElementById('battery-voltage').innerHTML = noNull(current.battery_voltage, 'voltage');
    document.getElementById('battery-voltage-modal').innerHTML = noNull(current.battery_voltage, 'voltage');
    document.getElementById('enclosure-temperature').innerHTML = noNull(current.enclosure_temperature, 'temp');
    document.getElementById('enclosure-temperature-modal').innerHTML = noNull(current.enclosure_temperature, 'temp');
    // document.getElementById('predicted').innerHTML = noNull(endTimeLoc.height, 'dist');
    document.getElementById('predicted').innerHTML = noNull(predictedHeight, 'dist');
    document.getElementById('residual').innerHTML = noNull(residual, 'dist');
}


function displayErrorNoData(stn_num) {
    const stn_name = stationMap[stn_num];
    alert(`No data found for ${stn_name} (${stn_num}).`);
}


function mergeNewTimeSeriesData(existingData, newData) {
    // Merge new time series data with existing data
    // existingData: array of observation objects
    // newData: array of new observation objects
    // Returns: merged array sorted by time

    if (!existingData || existingData.length === 0) {
        return newData;
    }

    // Create a map of existing data by UTC timestamp for efficient lookup
    const existingMap = new Map(existingData.map(obj => [obj.utc, obj]));

    // Add new data, replacing any duplicates
    newData.forEach(obj => {
        existingMap.set(obj.utc, obj);
    });

    // Convert back to array and sort by time
    const merged = Array.from(existingMap.values());
    merged.sort((a, b) => new Date(a.utc) - new Date(b.utc));

    return merged;
}


function trimOldData(data, displayHours) {
    // Remove data points that are outside the display window
    // Keep some buffer to ensure smooth transitions
    const bufferHours = 12; // Keep extra 12 hours of data
    const cutoffTime = new Date();
    cutoffTime.setHours(cutoffTime.getHours() - displayHours - bufferHours);

    return data.filter(obj => new Date(obj.utc) >= cutoffTime);
}


function mergeTideObs() {
    // Assume that the range of the tide prediction is always longer than
    // the observations
    let tp = appState['tidePredictions'];
    let ts = appState['timeSeries'];

    // Handle case where there are no tide predictions
    let startTime, endTime;
    if (!tp || tp.length === 0) {
        // Use observation time range if no predictions available
        if (!ts || ts.length === 0) {
            appState['mrgData'] = new Map();
            return;
        }
        startTime = new Date(ts[0].utc);
        endTime = new Date(ts[ts.length - 1].utc);
    } else {
        startTime = new Date(tp[0].utc);
        endTime = new Date(tp[tp.length - 1].utc);
    }


    let mrgData = generateTimeMap(startTime, endTime);

    // To make it easy to locate items, we will convert obs and
    // predictions to maps...
    // const prdMap = new Map(tp.map(obj => [Date.parse(obj.utc), obj]));
    const prdMap = new Map((tp || []).map(obj => [Date.parse(obj.utc), obj]));
    const obsMap = new Map(ts.map(obj => [Date.parse(obj.utc), obj]));

    mrgData.forEach((value, key) => {
        let newObject = {};
        if (obsMap.has(key)) {
            newObject = obsMap.get(key);
        }
        if (prdMap.has(key)) {
            newObject['height'] = prdMap.get(key).height;
        }
        mrgData.set(key, newObject);
    });

    appState['mrgData'] = mrgData;
}


function refreshPage(stn_num) {
    let endTime = new Date();
    let startTime = new Date();
    let hours = appState['displayHours'];
    let step = 1;
    if (hours > 100) {
        step = 10;
    }

    // Determine if this is an incremental refresh or a full load
    let isStationChange = appState['stn_num'] !== stn_num;

    // Check if the requested station matches the station of the currently loaded data
    // This catches cases where appState.stn_num was updated before calling this function
    if (!isStationChange && appState['timeSeries'] && appState['timeSeries'].length > 0) {
        if (appState['timeSeries'][0].stn_num != stn_num) {
            isStationChange = true;
        }
    }

    const isDisplayHoursChange = appState['lastDisplayHours'] !== hours;
    const hasExistingData = appState['timeSeries'] && appState['timeSeries'].length > 0;
    const isIncrementalRefresh = hasExistingData && !isStationChange && !isDisplayHoursChange;

    // For incremental refresh, only fetch data since last fetch time
    if (isIncrementalRefresh && appState['lastFetchTime']) {
        // Fetch only new data since last fetch, with a small overlap to ensure no gaps
        startTime = new Date(appState['lastFetchTime']);
        startTime.setMinutes(startTime.getMinutes() - 5); // 5 minute overlap to avoid gaps
        console.log(`Incremental refresh: fetching from last observation (${appState['lastFetchTime']}) minus 5min = ${startTime.toISOString()} to ${endTime.toISOString()}`);
    } else {
        // Full load: fetch entire display window
        startTime.setHours(startTime.getHours() - hours);
        console.log(`Full load: fetching ${hours} hours of data from ${startTime.toISOString()} to ${endTime.toISOString()}`);
    }

    let url1 = `${apiBaseUrl}/api/get_obs?start_time=${startTime.toISOString()}&end_time=${endTime.toISOString()}&stn_num=${stn_num}&step=${step}`;

    return fetch(url1)
        .then(res => res.json())
        .then(function (json1) {

            json1.sort((a, b) => new Date(a.utc) - new Date(b.utc));
            console.debug("Date: " + new Date() + " Len: " + json1.length);
            // Merge new data with existing data if incremental refresh
            if (isIncrementalRefresh) {
                appState['timeSeries'] = mergeNewTimeSeriesData(appState['timeSeries'], json1);
                // Trim old data to prevent memory buildup
                appState['timeSeries'] = trimOldData(appState['timeSeries'], hours);
            } else {
                appState['timeSeries'] = json1;
            }

            // Update last fetch time to the timestamp of the last actual observation
            // This prevents gaps when observations lag behind real-time

            let ts = appState['timeSeries'];
            appState['latest'] = ts.length > 0 ? [ts[ts.length - 1]] : [];
            if (ts && ts.length > 0) {
                appState['lastFetchTime'] = ts[ts.length - 1].utc;
                appState['startTime'] = new Date(ts[0].utc);
                appState['endTime'] = new Date(ts[ts.length - 1].utc);
                console.log(`Updated lastFetchTime to last observation: ${appState['lastFetchTime']}, total observations: ${ts.length}`);
            } else {
                appState['lastFetchTime'] = endTime.toISOString();
                appState['startTime'] = startTime;
                appState['endTime'] = endTime;
                console.log(`No observations received, setting lastFetchTime to current time: ${appState['lastFetchTime']}`);
            }
            appState['lastDisplayHours'] = hours;

            // For tide predictions, we need to fetch a range that extends beyond observation window
            // On incremental refresh, only update if we're getting close to the edge of prediction window
            let needNewTidePredictions = !isIncrementalRefresh;

            if (isIncrementalRefresh && appState['tidePredictions'] && appState['tidePredictions'].length > 0) {
                // Check if current time is within 6 hours of the end of tide prediction window
                const lastTidePrediction = new Date(appState['tidePredictions'][appState['tidePredictions'].length - 1].utc);
                const hoursUntilEnd = (lastTidePrediction - endTime) / (1000 * 60 * 60);
                needNewTidePredictions = hoursUntilEnd < 6;
                console.debug(`Tide predictions check: ${hoursUntilEnd.toFixed(1)} hours until end of prediction window`);
            }

            if (needNewTidePredictions) {
                startTime = new Date(appState['startTime']);
                // Add/Subtract 12 hours to ensure that we include an inflection point on either side
                startTime.setHours(startTime.getHours() - 12);
                let tideEndTime = new Date(appState['endTime']);
                tideEndTime.setHours(tideEndTime.getHours() + 12);
                startTime = startTime.toISOString().substring(0, 19);
                tideEndTime = tideEndTime.toISOString().substring(0, 19);
                console.log(`Fetching new tide predictions from ${startTime} to ${tideEndTime}`);
                // populateStationSelect(json1);
                let url2 = `${apiBaseUrl}/api/tide_predictions/?start_time=${startTime}&end_time=${tideEndTime}&stn_num=${stn_num}`;
                // return fetch(url2);
                return fetch(url2)
                    .then(res => {
                        // Check if the response is ok (status 200-299)
                        if (!res.ok) {
                            if (res.status === 404) {
                                console.log('No tide predictions available for this station');
                            } else {
                                console.log(`Tide predictions fetch returned status ${res.status}`);
                            }
                            return [];
                        }
                        // Handle both Response objects and our custom promise
                        if (res.json) {
                            return res.json();
                        }
                        return res;
                    })
                    .catch(function (error) {
                        console.log('Tide predictions fetch failed, continuing with observations only:', error);
                        // Return empty array for tide predictions if fetch fails
                        return [];
                    });

            } else {
                // Return existing tide predictions without fetching
                console.log('Reusing existing tide predictions (no fetch needed)');
                // return Promise.resolve({ json: () => Promise.resolve(appState['tidePredictions']) });
                return Promise.resolve(appState['tidePredictions'] || []);
            }
        })

        .then(function (json2) {
            // dateRange = getDateRange(json1);
            appState['tidePredictions'] = json2;
            appState['stn_num'] = stn_num;
            appState['stn_name'] = stationMap[stn_num];
            mergeTideObs();
            updateHeader();
            refreshText();
            refreshCompass();
            refreshEnclosureBattery();
            refreshEnclosureTemperature()
            refreshSeaLevelChartPlotly(); // called after both are complete
            window.updateChartButtons?.();

            // Set up or restart the auto-refresh interval
            modifyUpdateInterval();
        })
        //.catch(function () {
        //    displayErrorNoData(stn_num);
        .catch(function (error) {
            // Only show error if we don't have observation data
            //if (!appState['timeSeries'] || appState['timeSeries'].length === 0) {
            //     displayErrorNoData(stn_num);
            //} else {
            console.log('Error occurred but observations were loaded successfully:', error);
            //}
        });
}


function refreshCompass() {
    const values = appState['timeSeries'];
    if (!values || values.length === 0) return;
    const current = values[values.length - 1];
    showWindDirection(current.wind_dir, current.wind_spd);
}


function markerStyle(status) {
    let colour;
    const green = '#18B104';
    const red = '#FC0006';
    const black = '#000000';
    if (status < 1) {
        colour = green;
    } else if (status < 24) {
        colour = red;
    } else {
        colour = black;
    }

    return {
        radius: 5,
        color: '#131313',
        // fillColor: "#ff7800",
        fillColor: colour,
        weight: 2,
        opacity: 1,
        fillOpacity: 1
    }
}


function populateStationDropdown() {
    const network = document.getElementById('network-select').value;
    const select = document.getElementById('station-select');
    select.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.text = 'Select a station';
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    const filtered = allStations
        .filter(s => s.network === network)
        .sort((a, b) => a.disp_name.localeCompare(b.disp_name));

    for (const station of filtered) {
        const option = document.createElement('option');
        option.text = station.disp_name;
        option.value = station.stn_num;
        select.appendChild(option);
    }
}

function populateStationSelect(stations) {
    allStations = stations;

    const download = document.getElementById('download-station');

    stations.sort((a, b) => a.disp_name.localeCompare(b.disp_name));

    for (const station of stations) {
        stationMap[station.stn_num] = station.disp_name;
        stationDetails.set(station.stn_num, station);
        reverseStationMap.set(station.disp_name, station);
        displayNames.push(station.disp_name);

        const option = document.createElement('option');
        option.text = station.disp_name;
        option.value = station.stn_num;
        download.appendChild(option);
    }

    populateStationDropdown();
}


function onEachFeature(feature, layer) {

    const title = feature.properties.disp_name;
    const subtitle = feature.properties.stn_num;

    layer.bindPopup('<div style="width: 160px;"><b>' + title + '</b><br>' + subtitle +
        '<p> </div>');

    layer.on('mouseover', function () {
        this.openPopup();
    });
    layer.on('mouseout', function () {
        this.closePopup()
    });

    layer.on('click', function () {
        refreshPage(subtitle);
        updateStationSelect(feature);
        closeSearchModal();
    });

    stationLayerMap.set(subtitle, feature);
}


function loadStations() {
    const url = `${apiBaseUrl}/api/stations/`;
    fetch(url)
        .then(function (res) {
            return res.json();
        })
        .then(function (json) {
            populateStationSelect(json);

            let gjson = jsonToGeoJson(json);
            L.geoJson(gjson, {
                pointToLayer: function (feature, latlng) {
                    return L.circleMarker(latlng, markerStyle(feature.properties.status));
                },
                onEachFeature: onEachFeature
            }).addTo(map);
            checkStartup();
        })
}


function generateTimeMap(startDate, endDate) {
    const tmpMap = new Map();

    // Create a new date object starting from the start date
    const currentDate = new Date(startDate);

    // Loop through each minute from start to end
    while (currentDate <= endDate) {
        // Create a key in HH:MM format
        const key = Date.parse(currentDate.toISOString());
        tmpMap.set(key, null);

        // Add one minute
        currentDate.setMinutes(currentDate.getMinutes() + 1);
    }

    return tmpMap;
}

function refreshSeaLevelChartPlotly() {
    const rangeStart = new Date(appState['endTime']);
    rangeStart.setHours(rangeStart.getHours() - appState['displayHours'] - 1);
    const rangeStartMs = rangeStart.getTime();

    const isLct = appState.timezone === 'lct';
    const isFeet = appState.distanceUnit === 'feet';

    const obsX = [], obsY = [];
    for (const obs of (appState['timeSeries'] || [])) {
        if (Date.parse(obs.utc) < rangeStartMs) continue;
        obsX.push(toDisplayDate(obs.utc));
        obsY.push(isFeet && obs.wtr_level != null ? metersToFeet(obs.wtr_level) : obs.wtr_level);
    }

    const predX = [], predY = [];
    for (const p of (appState['tidePredictions'] || [])) {
        if (Date.parse(p.utc) < rangeStartMs) continue;
        predX.push(toDisplayDate(p.utc));
        predY.push(isFeet && p.height != null ? metersToFeet(p.height) : p.height);
    }

    const validMin = (arr) => arr.reduce((m, v) => v != null && v < m ? v : m, Infinity);
    const minLevel = Math.min(validMin(obsY), validMin(predY));
    const minLevelOrNull = isFinite(minLevel) ? minLevel : null;

    const stationName = stationDetails.get('' + Number(appState['stn_num'])).short_name;

    try {
        let layout = {
            autosize: true,
            margin: {t: 40, r: 30, b: 70, l: 50},
            font: {
                family: 'Roboto'
            },
            title: {
                text: `Sea Level: ${appState.stn_name} (${appState.stn_num})`,
                font: {
                    family: 'Roboto',
                    size: 20
                },
                xref: 'paper',
                x: 0,
                y: 0.95,
                yanchor: 'bottom'
            },
            showlegend: true,
            legend: {
                orientation: 'h',
                x: 1,
                y: 1.05,
                xanchor: 'right',
                yanchor: 'bottom'
            },
            xaxis: {
                title: {
                    text: `Time (${isLct ? 'Local' : 'UTC'})`,
                    font: {
                        family: 'Roboto',
                        size: 14,
                        color: '#7f7f7f'
                    }
                },
            },
            yaxis: {
                range: [minLevelOrNull != null ? minLevelOrNull - 0.5 : null, null],
                title: {
                    text: `Height in ${isFeet ? 'ft' : 'm'}`,
                    font: {
                        family: 'Roboto',
                        size: 14,
                        color: '#7f7f7f'
                    }
                }
            },
            annotations: [{
                text: "COSPPac",
                x: 0.08,
                y: 0.08,
                xref: 'paper',
                yref: 'paper',
                xanchor: 'center',
                yanchor: 'left',
                showarrow: false,
                font: {
                    size: 12,
                    color: 'rgba(0, 0, 0, 0.15)'
                }
            }]
        };


        const chartData = [
            {
                x: obsX,
                y: obsY,
                type: 'line',
                name: 'Observed'
            },
            {
                x: predX,
                y: predY,
                type: 'line',
                name: 'Predicted'
            },
        ];
        // document.getElementById('latest_reading').innerHTML = labels.slice(-1)[0] + " UTC";
        const config = {
            responsive: true,
            toImageButtonOptions: {
                filename: `${stationName}_sealevel`, // The desired filename (without extension)
                format: 'png'                        // Optional: desired format (png, jpeg, webp, svg)
            }
        }

        Plotly.newPlot('sea-level-chart', chartData, layout, config);
    } catch (err) {
        console.error(err);
    }
}


function plotAtmosphere(data) {

    let labels = data.map(row => row.utc);
    let x = labels.map(row => row.substring(12));
    let y1 = data.map(row => row.air_temp);
    let y2 = data.map(row => row.pressure);

    let temperatureTrace = {
        x: x,
        y: y1,
        name: 'Temperature (°C)',
        type: 'line',
        yaxis: 'y',
        line: {color: 'red'}
    };

    let pressureTrace = {
        x: x,
        y: y2,
        name: 'Pressure (hPa)',
        type: 'line',
        yaxis: 'y2',
        line: {color: 'blue'}
    };


    let layout = {
        font: {
            family: 'Roboto'
        },
        title: {
            text: 'Atmosphere',
            font: {
                family: 'Roboto',
                size: 14
            },
            xref: 'paper',
            x: 0.05,
        },
        xaxis: {
            title: {
                text: 'Time (UTC)',
                font: {
                    family: 'Roboto',
                    size: 14,
                    color: '#7f7f7f'
                }
            },
        },
        yaxis: {
            title: {
                text: 'Temperature (°C)',
                font: {
                    family: 'Roboto',
                    size: 14,
                    color: '#7f7f7f'
                }
            }
        },
        yaxis2: {
            title: 'Pressure (hPa)',
            range: 'auto',
            titlefont: {color: 'blue'},
            tickfont: {color: 'blue'},
            overlaying: 'y',
            side: 'right'
        },

        legend: {
            orientation: "v",     // Vertical legend
            x: 1.02,              // Slightly outside the plot area to the right
            y: 1,
            xanchor: "right",
            yanchor: "bottom"
        },
        margin: {r: 100}      // Add right margin for the legend space
    }

    Plotly.newPlot('other_chart', [temperatureTrace, pressureTrace], layout);
}
