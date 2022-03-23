const typography = require('@tailwindcss/typography');
const forms = require('@tailwindcss/forms');
const lineClamp = require('@tailwindcss/line-clamp')
const colors = require('tailwindcss/colors')
const namedGroups = require('tailwindcss-named-groups')

const config = {
	content: ['./src/**/*.{html,js,svelte,ts}'],
  darkMode: 'class',
  safelist: [
    {
      pattern: /opacity-.+/,
      variants: [
        "group-hover"
      ]
    },
    {
      pattern: /flex/,
      variants: [
        "group-hover"
      ]
    },
    {
      pattern: /block/,
      variants: [
        "group-hover"
      ]
    },
    {
      pattern: /hidden/,
      variants: [
        "group-hover"
      ]
    }
  ],
	theme: {
		extend: {
      colors: {
        gray: colors.slate,
        'brandBlue': {
          100: '#8BCCF1',
          200: '#64BBEC',
          300: '#3DAAE7',
          400: '#1699E2',
          500: '#148ACB',
          600: '#127AB5',
          700: '#0F6B9E',
          800: '#0D5C88',
          900: '#0B4D71'
        },
        'brandTeal': '#1eb4d4'
      },
			fontFamily: {
        sans: ['Inter var', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', '"Helvetica Neue"', 'Arial', 'sans-serif'],
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace']
      },
      listStyleType: {
        square: 'square'
      }  
		},
    namedGroups: ['1', '2', '3', '4']
	},
	plugins: [forms, typography, namedGroups, lineClamp]
};

module.exports = config;