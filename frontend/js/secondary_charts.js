import { getStateFromUrl, APP_DEFAULTS } from './url_manager.js';



const apiBaseUrl = import.meta.env.VITE_API_HOSTNAME || window.location.origin;
/**
 * Shared initialisation for all secondary chart pages.
 */
document.addEventListener("DOMContentLoaded", function () {
    // Only run if we are on a secondary chart page (determined by existence of certain elements)
    // and NOT on the dashboard (which has a map)
    if (!document.getElementById('map') && (
        document.getElementById('sea-level-chart') || 
        document.getElementById('pressure-chart') || 
        document.getElementById('wind-chart'))) {
        
        Object.assign(appState, APP_DEFAULTS, getStateFromUrl());
        const urlParams = new URLSearchParams(window.location.search);
        const stnNum = urlParams.get('stn_num');
        
        loadStationsForChart(stnNum);
    }
});

/**
 * Simplified version of loadStations that just loads the data for chart-only views.
 */
function loadStationsForChart(stnNum) {
    const url = `${apiBaseUrl}/api/stations/`;
    fetch(url)
        .then(function (res) {
            return res.json();
        })
        .then(function (json) {
            // Populate stationMap and stationDetails
            json.forEach(station => {
                stationMap[station.stn_num] = station.disp_name;
                stationDetails.set(station.stn_num, station);
            });

            // If station number is provided, load that station's data
            if (stnNum) {
                refreshPageForChart(stnNum);
            }
        });
}

/**
 * Simplified version of refreshPage for chart-only views.
 */
function refreshPageForChart(stn_num) {
    let endTime = new Date();
    let startTime = new Date();
    let hours = appState['displayHours'];
    let step = 1;
    if (hours > 100) {
        step = 10;
    }

    startTime.setHours(startTime.getHours() - hours);

    let url0 = `${apiBaseUrl}/api/get_latest_obs?stn_num=${stn_num}`;
    let url1 = `${apiBaseUrl}/api/get_obs?start_time=${startTime.toISOString()}&end_time=${endTime.toISOString()}&stn_num=${stn_num}&step=${step}`;

    fetch(url0)
        .then(res => res.json())
        .then(function (json0) {
            appState['latest'] = json0;
        });

    return fetch(url1)
        .then(res => res.json())
        .then(function (json1) {
            json1.sort((a, b) => new Date(a.utc) - new Date(b.utc));
            appState['timeSeries'] = json1;

            let ts = appState['timeSeries'];
            if (ts && ts.length > 0) {
                appState['startTime'] = new Date(ts[0].utc);
                appState['endTime'] = new Date(ts[ts.length - 1].utc);
            } else {
                appState['startTime'] = startTime;
                appState['endTime'] = endTime;
            }
            appState['stn_num'] = stn_num;
            appState['stn_name'] = stationMap[stn_num];

            // Update header
            const stnNameEl = document.getElementById('station-name');
            if (stnNameEl) {
                stnNameEl.innerHTML = `${appState['stn_name']} (${stn_num})`;
            }
            const stnMetaEl = document.getElementById('station-metadata');
            if (stnMetaEl && appState['latest'] && appState['latest'][0]) {
                stnMetaEl.innerHTML = `Last observation: ${formatTime(appState['latest'][0].utc, stn_num)}`;
            }

            // Determine which charts to refresh based on page elements
            if (document.getElementById('sea-level-chart')) {
                // Fetch tide predictions only for sea level chart
                return fetchTidePredictions(stn_num).then(() => {
                    mergeTideObs();
                    refreshSeaLevelChartPlotly();
                });
            } else if (document.getElementById('pressure-chart') || document.getElementById('temperature-chart')) {
                if (document.getElementById('pressure-chart')) refreshPressureChart(stn_num);
                if (document.getElementById('temperature-chart')) refreshTemperatureChart(stn_num);
            } else if (document.getElementById('wind-chart')) {
                refreshWindChart(stn_num);
            }
        })
        .catch(function (error) {
            console.error('Error loading chart data:', error);
            alert('Failed to load chart data');
        });
}

/**
 * Fetches tide predictions for the current observation range.
 */
function fetchTidePredictions(stn_num) {
    let tideStartTime = new Date(appState['startTime']);
    tideStartTime.setHours(tideStartTime.getHours() - 12);
    let tideEndTime = new Date(appState['endTime']);
    tideEndTime.setHours(tideEndTime.getHours() + 12);

    let url2 = `${apiBaseUrl}/api/tide_predictions/?start_time=${tideStartTime.toISOString().substring(0, 19)}&end_time=${tideEndTime.toISOString().substring(0, 19)}&stn_num=${stn_num}`;

    return fetch(url2)
        .then(res => {
            if (!res.ok) {
                console.log('No tide predictions available');
                return [];
            }
            return res.json();
        })
        .then(json2 => {
            appState['tidePredictions'] = json2;
        })
        .catch(function (error) {
            console.log('Tide predictions fetch failed:', error);
            appState['tidePredictions'] = [];
        });
}

/**
 * Watermark annotation configuration to add to charts on download
 */
const watermarkAnnotation = {
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
};

/**
 * Creates a custom download button that adds watermark only to exported image
 */
function createDownloadButtonWithWatermark(chartId) {
    return {
        name: 'Download with watermark',
        icon: Plotly.Icons.camera,
        click: function(gd) {
            const currentAnnotations = gd.layout.annotations || [];
            const annotationsWithWatermark = [...currentAnnotations, watermarkAnnotation];

            Plotly.relayout(gd, { annotations: annotationsWithWatermark }).then(function() {
                Plotly.downloadImage(gd, {
                    format: 'png',
                    filename: chartId,
                    width: 1200,
                    height: 700
                }).then(function() {
                    Plotly.relayout(gd, { annotations: currentAnnotations });
                });
            });
        }
    };
}

/**
 * Plotly config with custom download button
 */
function getPlotlyConfig(chartId) {
    return {
        responsive: true,
        modeBarButtonsToRemove: ['toImage'],
        modeBarButtonsToAdd: [createDownloadButtonWithWatermark(chartId)]
    };
}


/**
 * Function to create atmospheric pressure chart.
 */
function refreshPressureChart(stn_num) {
    const shortName = stationDetails.get(stn_num).short_name;
    const isPsi = appState.pressureUnit === 'psi';
    const unit = isPsi ? 'psi' : 'hPa';
    const titleEl = document.querySelectorAll('.chart-title')[0];
    if (titleEl) titleEl.innerHTML = `Atmospheric Pressure (${unit})`;
    
    const ts = appState['timeSeries'];
    const isLct = appState.timezone === 'lct';

    const times = [];
    const pressures = [];

    ts.forEach(function(obs) {
        if (obs.pressure !== null && obs.pressure !== undefined) {
            times.push(toDisplayDate(obs.utc));
            pressures.push(isPsi ? hPaToPsi(obs.pressure) : obs.pressure);
        }
    });

    const trace = {
        x: times,
        y: pressures,
        type: 'scatter',
        mode: 'lines',
        name: 'Atmospheric Pressure',
        line: { color: '#0d6efd', width: 2 }
    };

    const layout = {
        autosize: true,
        xaxis: {
            title: `Time (${isLct ? 'Local' : 'UTC'})`,
            type: 'date'
        },
        yaxis: {
            title: `Pressure (${unit})`
        },
        margin: { t: 50, r: 50, b: 80, l: 60 },
        hovermode: 'closest',
        showlegend: true,
        legend: {
            orientation: 'h',
            x: 1,
            y: 1.15,
            xanchor: 'right',
            yanchor: 'bottom'
        },
        annotations: [watermarkAnnotation]
    };

    const config = {
        responsive: true,
        toImageButtonOptions: {
            filename: `${shortName}_pressure`, // The desired filename (without extension)
            format: 'png'                  // Optional: desired format (png, jpeg, webp, svg)
        }
    }
    Plotly.newPlot('pressure-chart', [trace], layout, config);
}

/**
 * Function to create temperature chart.
 */
function refreshTemperatureChart(stn_num) {
    const shortName = stationDetails.get(stn_num).short_name;
    const isF = appState.tempUnit === 'fahrenheit';
    const unit = isF ? '°F' : '°C';
    const titleEl = document.querySelectorAll('.chart-title')[1];
    if (titleEl) titleEl.innerHTML = `Water and Air Temperature (${unit})`;
    
    const ts = appState['timeSeries'];
    const isLct = appState.timezone === 'lct';

    const times = [];
    const waterTemps = [];
    const airTemps = [];

    ts.forEach(function(obs) {
        const time = toDisplayDate(obs.utc);

        if (obs.wtr_temp !== null && obs.wtr_temp !== undefined) {
            times.push(time);
            waterTemps.push(isF ? celsiusToFahrenheit(obs.wtr_temp) : obs.wtr_temp);
        } else {
            waterTemps.push(null);
        }

        if (obs.air_temp !== null && obs.air_temp !== undefined) {
            if (times.length === 0 || times[times.length - 1]?.getTime() !== time.getTime()) {
                times.push(time);
            }
            airTemps.push(isF ? celsiusToFahrenheit(obs.air_temp) : obs.air_temp);
        } else {
            airTemps.push(null);
        }
    });

    const waterTrace = {
        x: times,
        y: waterTemps,
        type: 'scatter',
        mode: 'lines',
        name: 'Water Temperature',
        line: { color: '#0d6efd', width: 2 }
    };

    const airTrace = {
        x: times,
        y: airTemps,
        type: 'scatter',
        mode: 'lines',
        name: 'Air Temperature',
        line: { color: '#dc3545', width: 2 }
    };

    const layout = {
        autosize: true,
        xaxis: {
            title: `Time (${isLct ? 'Local' : 'UTC'})`,
            type: 'date'
        },
        yaxis: {
            title: `Temperature (${unit})`
        },
        margin: { t: 30, r: 50, b: 80, l: 60 },
        hovermode: 'closest',
        showlegend: true,
        legend: {
            orientation: 'h',
            x: 1,
            y: 1.15,
            xanchor: 'right',
            yanchor: 'bottom'
        },
        annotations: [watermarkAnnotation]
    };
    const config = {
        responsive: true,
        toImageButtonOptions: {
            filename: `${shortName}_temperature`, // The desired filename (without extension)
            format: 'png'                  // Optional: desired format (png, jpeg, webp, svg)
        }
    }
    Plotly.newPlot('temperature-chart', [waterTrace, airTrace], layout, config);
}

/**
 * Function to create combined wind speed, gust and direction chart.
 */
function refreshWindChart(stn_num) {
    const speedUnit = appState.speedUnit === 'knots' ? 'knots' : 
                      appState.speedUnit === 'kmh' ? 'km/h' : 'm/s';
    const directionType = appState.windDirectionType === 'oceanographic' ? 'Oceanographic' : 'Meteorological';
    
    const ts = appState['timeSeries'];
    const isLct = appState.timezone === 'lct';

    const times = [];
    const speeds = [];
    const gusts = [];
    const shortName = stationDetails.get(stn_num).short_name;

    ts.forEach(function(obs) {
        const time = toDisplayDate(obs.utc);
        times.push(time);
        
        let s = obs.wind_spd;
        let g = obs.wind_spd_max;
        
        if (appState.speedUnit === 'knots') {
            s = s != null ? msToKnots(s) : null;
            g = g != null ? msToKnots(g) : null;
        } else if (appState.speedUnit === 'kmh') {
            s = s != null ? msToKmh(s) : null;
            g = g != null ? msToKmh(g) : null;
        }
        
        speeds.push(s);
        gusts.push(g);
    });

    const speedTrace = {
        x: times,
        y: speeds,
        type: 'scatter',
        mode: 'lines',
        name: 'Wind Speed',
        line: { color: '#0d6efd', width: 2 }
    };

    const gustTrace = {
        x: times,
        y: gusts,
        type: 'scatter',
        mode: 'lines',
        name: 'Gust Speed',
        line: { color: '#dc3545', width: 2, dash: 'dot' }
    };

    // Downsample direction arrows
    const totalPoints = ts.length;
    const targetArrows = 25;
    const skip = Math.max(1, Math.floor(totalPoints / targetArrows));

    const arrowTimes = [];
    const arrowY = [];
    const arrowRotations = [];
    const arrowText = [];

    // Determine Y position for arrows (top of chart)
    const validGusts = gusts.filter(v => v != null);
    const maxVal = validGusts.length > 0 ? Math.max(...validGusts) : 0;
    const arrowPos = maxVal > 0 ? maxVal * 1.15 : 5;

    let plotName = appState['disp_name'];

    for (let i = 0; i < ts.length; i += skip) {
        const obs = ts[i];
        if (obs.wind_dir != null) {
            let dir = obs.wind_dir;
            if (appState.windDirectionType === 'oceanographic') {
                dir = (dir + 180) % 360;
            }
            
            arrowTimes.push(toDisplayDate(obs.utc));
            arrowY.push(arrowPos);
            arrowRotations.push(dir);
            arrowText.push(`${Math.round(dir)}° (${directionType})`);
        }
    }

    // Ensure the last arrow is the latest observation
    const latestObs = ts[ts.length - 1];
    if (latestObs && latestObs.wind_dir != null && arrowTimes.length > 0) {
        const latestDate = toDisplayDate(latestObs.utc);
        const lastArrowDate = arrowTimes[arrowTimes.length - 1];
        
        if (latestDate.getTime() !== lastArrowDate.getTime()) {
            let dir = latestObs.wind_dir;
            if (appState.windDirectionType === 'oceanographic') {
                dir = (dir + 180) % 360;
            }
            
            // Replace the last element
            arrowTimes[arrowTimes.length - 1] = latestDate;
            arrowRotations[arrowRotations.length - 1] = dir;
            arrowText[arrowText.length - 1] = `${Math.round(dir)}° (${directionType})`;
        }
    }

    const directionTrace = {
        x: arrowTimes,
        y: arrowY,
        type: 'scatter',
        mode: 'markers',
        name: `Direction (${directionType})`,
        marker: {
            symbol: 'arrow-bar-up',
            size: 20,
            angle: arrowRotations,
            line: { width: 1, color: '#6c757d' },
            color: '#6c757d'
        },
        hoverinfo: 'x+text',
        text: arrowText
    };

    const layout = {
        autosize: true,
        title: {
            text: `Wind Speed, Gust (${speedUnit}) and Direction`,
            font: { size: 16 },
            xref: 'paper',
            x: 0,
            y: 0.95,
            yanchor: 'bottom'
        },
        xaxis: {
            title: `Time (${isLct ? 'Local' : 'UTC'})`,
            type: 'date'
        },
        yaxis: {
            title: `Speed (${speedUnit})`,
            rangemode: 'tozero'
        },
        margin: { t: 60, r: 50, b: 80, l: 60 },
        hovermode: 'closest',
        showlegend: true,
        legend: {
            orientation: 'h',
            x: 1,
            y: 1.1,
            xanchor: 'right',
            yanchor: 'bottom'
        },
        annotations: [watermarkAnnotation]
    };


    const config = {
        responsive: true,
        toImageButtonOptions: {
            filename: `${shortName}_wind`, // The desired filename (without extension)
            format: 'png'                  // Optional: desired format (png, jpeg, webp, svg)
        }
    }
    Plotly.newPlot('wind-chart', [speedTrace, gustTrace, directionTrace], layout, config);
}
