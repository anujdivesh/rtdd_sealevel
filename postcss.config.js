import autoprefixer from 'autoprefixer';
import { purgeCSSPlugin } from '@fullhuman/postcss-purgecss';

export default {
  plugins: [
    autoprefixer(),
    purgeCSSPlugin({
      content: [
        './rtdd/templates/**/*.html',
        './frontend/js/**/*.js',
      ],
      safelist: {
        standard: [
          'active',
          'show',
          'fade',
          'modal-backdrop',
          'text-view-mode',
          'dashboard-page',
          'is-measurement',
          'collapsing',
          'd-none',
          'd-block',
        ],
        deep: [],
        greedy: [
          /leaflet/,
          /fa-/,
          /js-/,
        ]
      }
    })
  ]
}
