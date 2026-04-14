// Main entry point for Vite

// CSS Imports
import '../css/style.css';
import 'leaflet/dist/leaflet.css';

// JS Imports
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
    faMagnifyingGlass,
    faSliders,
    faWater,
    faTemperatureHigh,
    faWind,
    faHome,
    faBriefcase,
    faEnvelope,
    faCalendar,
    faTasks,
    faUser,
    faNewspaper,
    faTools,
    faCloudSun,
    faCalculator,
    faBookmark,
    faChartLine,
    faCode,
    faUserShield,
    faStethoscope
} from '@fortawesome/free-solid-svg-icons';

// Add icons to library
library.add(
    faMagnifyingGlass,
    faSliders,
    faWater,
    faTemperatureHigh,
    faWind,
    faHome,
    faBriefcase,
    faEnvelope,
    faCalendar,
    faTasks,
    faUser,
    faNewspaper,
    faTools,
    faCloudSun,
    faCalculator,
    faBookmark,
    faChartLine,
    faCode,
    faUserShield,
    faStethoscope
);

// Replace <i> tags with <svg>
dom.watch();

import * as bootstrap from 'bootstrap';
import L from 'leaflet';

// Tree-shakeable Plotly
import Plotly from 'plotly.js/dist/plotly-basic.js';

// Expose dependencies to window for inline scripts
window.bootstrap = bootstrap;
window.L = L;
window.Plotly = Plotly;

// App-specific JS
import './sea_level.js';
import './dashboard.js';
import './secondary_charts.js';
