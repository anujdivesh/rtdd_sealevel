import {getQueryStringFromState, updateUrlFromState} from './url_manager.js';
import {appState} from "./sea_level.js";

const apiBaseUrl = import.meta.env.VITE_API_HOSTNAME || window.location.origin;

/**
 * Modal control functions.
 */
function openModal(name) {
    const modal = new bootstrap.Modal(document.getElementById(name));
    modal.show();
    if (name === 'search') {
        // Ensure the map recalculates its container size after the modal becomes visible
        if (typeof map !== 'undefined' && map && typeof map.invalidateSize === 'function') {
            map.invalidateSize();
        }
    }
}

function closeModal(modalId) {
    const modal = bootstrap.Modal.getInstance(document.getElementById(modalId));
    if (modal) modal.hide();
}

function closeSearchModal() {
    closeModal('search');
}

/**
 * Toggles between dashboard and text-only view.
 */
function toggleView() {
    const graphDiv = document.getElementById('graph-div');
    const diagnosticDiv = document.getElementById('diagnostics-div');
    const cardsRow = document.getElementById('cards-row');
    const button = document.getElementById('dashboard-button');

    if (!graphDiv) return;

    // Check current display state using computed style
    const graphDisplayStyle = window.getComputedStyle(graphDiv).display;
    const isGraphVisible = graphDisplayStyle !== 'none';

    console.log('Toggle view clicked. Graph visible:', isGraphVisible);

    if (isGraphVisible) {
        // Hide the charts (text-only view)
        graphDiv.style.setProperty('display', 'none', 'important');
        diagnosticDiv.style.display = 'block';
        cardsRow.classList.add('text-view-mode');
        cardsRow.classList.remove('mb-3');
        button.textContent = 'Dashboard';
        console.log('Switched to text view');
    } else {
        // Show the charts (revert to dashboard view)
        graphDiv.style.removeProperty('display');
        diagnosticDiv.style.display = 'none';
        cardsRow.classList.remove('text-view-mode');
        cardsRow.classList.add('mb-3');
        button.textContent = 'Text view';
        console.log('Switched to dashboard view');
    }
}

/**
 * Opens the sea level chart in a new window.
 */
function openChartWindow() {
    if (!appState['stn_num']) return alert('Please select a station first');
    const params = getQueryStringFromState(appState);
    window.open(`/rtdd/chart?${params}`, '_blank');
}

/**
 * Opens the temperature chart in a new window.
 */
function openTemperatureChartWindow() {
    if (!appState['stn_num']) return alert('Please select a station first');
    const params = getQueryStringFromState(appState);
    window.open(`/rtdd/temperature-chart?${params}`, '_blank');
}

/**
 * Opens the wind chart in a new window.
 */
function openWindChartWindow() {
    if (!appState['stn_num']) return alert('Please select a station first');
    const params = getQueryStringFromState(appState);
    window.open(`/rtdd/wind-chart?${params}`, '_blank');
}

function updateChartButtons() {
    const hasData = appState['timeSeries'] && appState['timeSeries'].length > 0;
    document.querySelectorAll('.btn-chart').forEach(btn => {
        btn.disabled = !hasData;
    });
}


async function downloadData(url, filename = 'data') {

    let format = "json";
    if (url.includes('format=csv')) {
        format = "csv";
    }

    if (!filename.includes('.')) {
        filename = filename + '.' + format;
    }

    try {
        // Fetch data from the URL
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Get the JSON data as text
        const jsonData = await response.text();

        // Create a Blob with the CSV data
        const blob = new Blob([jsonData], { type: 'text/json' });

        // Create a temporary URL for the blob
        const downloadUrl = window.URL.createObjectURL(blob);

        // Create a temporary anchor element and trigger download
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);

    } catch (error) {
        console.error('Download failed:', error);
        alert('Failed to download file: ' + error.message);
    }
}


function handleDownloadClick() {
    document.getElementById('download-error-message').innerHTML = "";
    const stationNumber = document.getElementById('download-station').value;
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;

    if (stationNumber === 'Select a station') {
        document.getElementById('download-error-message').innerHTML = "You need to select a station";
        return false;
    }

    const format = document.querySelector('input[name="download-format"]:checked').value;
    let url = `${apiBaseUrl}/api/get_obs?start_time=${startDate}&end_time=${endDate}&stn_num=${stationNumber}`;
    if (format === 'csv') {
        url += '&format=csv';
    }
    let stationName = stationDetails.get(stationNumber).short_name;
    downloadData(url, stationName);
}



// Expose functions to window for onclick handlers
window.openModal = openModal;
window.closeModal = closeModal;
window.closeSearchModal = closeSearchModal;
window.toggleView = toggleView;
window.openChartWindow = openChartWindow;
window.openTemperatureChartWindow = openTemperatureChartWindow;
window.openWindChartWindow = openWindChartWindow;
window.handleDownloadClick = handleDownloadClick;
window.updateChartButtons = updateChartButtons;
