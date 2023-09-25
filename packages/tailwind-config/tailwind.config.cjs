/** @type {import('tailwindcss').Config} */
/** @type {number} */

const baseWidth = 48;
const basePixel = 6;
const widths = Array.from(Array(13).keys())
  .map((num) => `${num * baseWidth + basePixel * (num > 0 ? num - 1 : 0)}px`)
  .map((val, idx) => ({ [`grid-${idx}`]: val }))
  .reduce((acc, val) => ({ ...acc, ...val }), {});

// dont override tailwind defaults
const customSizes = {
  0.75: 3,
  2.25: 9,
  3.75: 15,
  4.5: 18,
  6.75: 27,
  7.5: 30,
  10.5: 42,
  13.5: 54,
  15: 60,
  18: 72,
  21: 84,
  25.5: 102,
  30: 120,
  31.5: 126,
  37.5: 150,
  40.5: 162,
  41: 164,
  42: 168,
  45: 180,
  49.5: 198,
  63: 252,
  64.5: 258,
  76: 304,
  81: 324,
  90: 360,
  96.5: 396,
  141: 564,
  150: 600,
};

const contentPaths = [
  '../../node_modules/daisyui/dist/**/*.js',
  '../../node_modules/react-daisyui/dist/**/*.js',
  '../../packages/forms/src/**/*.tsx',
  '../../packages/ui/src/**/*.tsx',
  '../../apps/web/src/pages/**/*.{js,ts,jsx,tsx}',
  '../../apps/docs/src/**/*.tsx',
  '../../packages/digital-acquisitions/src/**/*.{js,ts,jsx,tsx}',
];

module.exports = {
  content: contentPaths,
  theme: {
    extend: {
      borderRadius: {
        1.5: 3,
      },
      boxShadow: {
        snackbar: '0px 0px 10px #00000026',
      },
      colors: {
        'fmg-green': {
          DEFAULT: '#209400',
          3: 'rgba(32, 148, 0, 0.03)',
          5: 'rgba(32, 148, 0, 0.05)',
          10: 'rgba(32, 148, 0, 0.1)',
          20: 'rgba(32, 148, 0, 0.2)',
          25: 'rgba(32, 148, 0, 0.25)',
        },
        incomplete: 'hsla(38, 84%, 60%, 1)', // #EFAE41
        field: {
          bg: {
            DEFAULT: 'rgba(242, 242, 242, 1)', // #F2F2F2
            hover: 'rgba(229, 229, 229, 1)', // #E5E5E5
            focused: 'rgba(231, 232, 233, 1)', // #E7E8E9
          },
          fill: {
            'black-24': 'rgba(60, 60, 60, 1)', // #3C3C3C
            'black-48': 'rgba(120, 120, 120, 1)', // #787878
            'black-75': 'rgba(190, 190, 190, 1)', // #BEBEBE
          },
          border: {
            DEFAULT: '#E5E5E5', // #E5E5E5
            disabled: 'rgba(229, 229, 229, 1)', // #E5E5E5
          },
          text: {
            placeholder: 'rgba(126, 129, 133, 1)', // #7E8185
          },
          'multi-value': {
            border: 'rgba(255, 255, 255, 1)', // #E3E4E7
            remove: 'rgba(120, 120, 120, 1)', // #787878
          },
        },
        black: {
          DEFAULT: '#000',
          47: 'hsla(0, 0%, 47%, 1)', // #787878
          86: 'hsla(0, 0%, 86%, 1)', // #DCDCDC
        },
        'multi-value': {
          DEFAULT: 'hsla(225, 8%, 90%, 1)', // #E3E4E8 Chrome, #E3E4E7 XD
          remove: 'hsla(0, 0%, 47%, 1)', // #787878
        },
        light: '#00A8CB',
        'pale-light': 'rgba(229, 246, 250, 1)', // #E5F6FA
        link: {
          DEFAULT: 'rgba(0, 168, 203, 1)', // #00A8CB,
          disabled: 'rgba(194, 196, 200, 1)', // #C2C4C8
        },
        'warning-light': '#EFAE41',
        text: {
          DEFAULT: 'rgba(25, 30, 38, 1)', // #191E26
          primary: 'rgba(25, 30, 38, 1)',
          secondary: 'rgba(25, 30, 38, .75)',
          placeholder: 'rgba(25, 30, 38, .5)', // #191e2680
          disabled: 'rgba(25, 30, 38, .5)',
          affix: 'rgba(132, 135, 139, 1)' // #84878B
        },
        disabled: {
          DEFAULT: 'rgba(235, 236, 238, 1)', // #EBECEEFF
          content: 'rgba(194, 196, 200, 1)', // #C2C4C8
        },
        error: {
          DEFAULT: '#A62F1F',
          focus: '#8D281A',
          20: 'rgba(166, 47, 31, 0.2)',
        },
        // named by percent of gray
        gray: {
          DEFAULT: 'rgba(0, 0, 0, 0.05)',
          hover: 'rgba(0, 0, 0, 0.10)',
          5: 'rgba(0, 0, 0, 0.05)', //#0000000D
          10: 'rgba(0, 0, 0, 0.10)', //#0000001A
          15: 'rgba(0, 0, 0, 0.15)', //#00000026
          20: 'rgba(0, 0, 0, 0.20)',
          25: 'rgba(0, 0, 0, 0.25)',
          30: 'rgba(0, 0, 0, 0.30)',
          75: 'rgba(0, 0, 0, 0.75)',
          100: 'rgba(0, 0, 0, 1)',
        },
        blue: {
          216: {
            DEFAULT: 'hsla(216, 100%, 50%, 1)',
            border: 'rgba(230, 232, 235, 1)', // 'hsla(216, 11%, 91%, 1)', // #E6E8EB
            active: 'hsla(216, 2%, 60%, 1)', // #97999C
          },
          217: {
            DEFAULT: 'hsla(217, 100%, 50%, 1)', // #636F82
            content: 'hsla(217, 14%, 45%, 1)', // #97999C
          },
          220: {
            DEFAULT: 'hsla(220, 100%, 50%, 1)',
            bg: 'hsla(220, 3%, 78%, 1)', // #C5C6C8
          },
          225: {
            DEFAULT: 'hsla(225, 100%, 50%, 1)',
            active: 'hsla(225, 2%, 60%, 1)', // #97989B
          },
          240: {
            DEFAULT: 'hsla(240, 100%, 50%, 1)',
            'hover-10': 'hsla(240, 6%, 91%, 1)', // #E6E6E9
            'hover-20': 'hsla(240, 8%, 95%, 1', // #F1F1F3
            hover: 'hsla(240, 8%, 97%, 1)', // #F8F8F9
            bg: 'rgba(248, 248, 249, 1)', // 'hsla(240, 8%, 97%, 1)', // #F8F8F9
            pressed: 'hsla(240, 2%, 92%, 1)', // #EAEAEB
            active: 'hsla(240, 8%, 95%, 1)', // #F1F1F3
          },
        },
        loading: {
          DEFAULT: 'rgba(237, 237, 238, 1)', // #EDEDEE
          dark: 'rgba(227, 227, 228, 1)'// E3E3E4
        },
        tabs: {
          bg: '#F1F1F3',
          hover: '#E6E6E8',
          light: '#7C7F83',
          dark: '#191E26',
        },
        'fmg-gray': {
          DEFAULT: 'rgba(25, 30, 38, 1)',
          50: 'rgba(248, 248, 249, 1)', //#F8F8F9
          60: 'rgba(246, 246, 246, 1)', //#F6F6F6
          80: 'rgba(242, 242, 242, 1)',
          110: 'rgba(241, 241, 243, 1)',
          140: 'rgba(235, 236, 238, 1)',
          170: 'rgba(231, 232, 233, 1)',
          200: 'rgba(230, 232, 235, 1)', //#E6E8EB
          230: 'rgba(229, 229, 229, 1)',
          300: 'rgba(227, 228, 231, 1)', //#E3E4E7
          330: 'rgba(213, 214, 214, 1)',
          360: 'rgba(209, 210, 212, 1)',
          390: 'rgba(197, 198, 199, 1)',
          420: 'rgba(194, 196, 200, 1)',
          450: 'rgba(190, 190, 190, 1)',
          480: 'rgba(178, 180, 182, 1)', //#B2B4B6
          510: 'rgba(163, 165, 168, 1)', //##A3A5A8
          540: 'rgba(151, 153, 156, 1)',
          570: 'rgba(139, 142, 146, 1)', //#8B8E92
          600: 'rgba(136, 136, 136, 1)',
          630: 'rgba(126, 129, 133, 1)',
          660: 'rgba(124, 127, 131, 1)',
          690: 'rgba(120, 120, 120, 1)',
          710: 'rgba(117, 120, 124, 1)', //#75787C
          720: 'rgba(108, 111, 116, 1)',
          750: 'rgba(82, 86, 92, 1)',
          780: 'rgba(75, 79, 85, 1)',
          810: 'rgba(71, 75, 81, 1)', //#474B51
          840: 'rgba(60, 60, 60, 1)',
          870: 'rgba(57, 57, 57, 1)',
          900: 'rgba(32, 32, 32, 0.5)',
          930: 'rgba(25, 30, 38, 1)',
        },
      },
      fontSize: {
        sm: ['12px', '14px'],
        base: ['14px', '18px'],
        md: ['16px', '20px'],
        lg: ['18px', '22px'],
        xl: ['20px', '24px'],
        'xxl-1': ['23px', '24px'],
      },
      fontFamily: {
        sans: ['Heebo', 'sans-serif'],
        mono: ['Heebo', 'sans-serif'],
        serif: ['Heebo', 'sans-serif'],
      },
      ringWidth: {
        6: '6px',
      },
      borderSpacing: {
        ...customSizes,
      },
      // By default the spacing scale is inherited by the
      // padding, margin, width, height, maxHeight, gap, inset, space, and translate core plugins
      spacing: {
        ...customSizes,
      },
      inset: {
        ...customSizes,
      },
      width: {
        ...customSizes,
        ...widths,
      },
      minWidth: {
        ...customSizes,
      },
      maxWidth: {
        ...customSizes,
      },
      borderWidth: {
        1.5: 3,
      },
      minHeight: {
        ...customSizes,
      },
      opacity: {
        15: 0.15,
      },
      gridTemplateColumns: {
        // Simple 16 column grid
        //3: 'repeat(3, minmax(0, 1fr))',
        // Complex site-specific column configuration
        footer: '200px minmax(900px, 1fr) 100px',
      },
      screens: {
        ...require('./screens.json'),
      },
      backgroundPosition: {
        'header-desktop': 'right -65px bottom 0',
        'header-mobile': 'left -870px bottom 0',
      },
      transitionDelay: {
        350: '350ms',
        400: '400ms',
      },
      transitionTimingFunction: {
        'segmented-bounce': 'cubic-bezier(.27,.97,.51,1.1)',
        'segmented-bounce-icons': 'cubic-bezier(.27,.97,.51,1.2)',
      },
      animation: {
        snackbarIn: 'snackbarIn 0.5s both ease-in-out',
        snackbarOut: 'snackbarOut 0.4s both',
        slideUpEnter: 'slideUpEnter 0.3s ease-in-out',
        slideUpLeave: 'slideUpLeave 0.3s ease-in-out',
        sortDir: 'sortDir 0.3s ease-in',
        loaded: 'loaded 0.3s ease-in-out',
      },
      keyframes: {
        snackbarIn: {
          '0%': {
            transform: 'translateY(200px)',
            opacity: 0.7,
          },
          '80%': { transform: 'translate(0px)', opacity: 0.7 },
          '100%': { opacity: 1 },
        },
        snackbarOut: {
          '0%': { opacity: 1 },
          '20%': { opacity: 0.7 },
          '100%': {
            transform: 'translateY(200px)',
            opacity: 0.7,
          },
        },
        slideUpEnter: {
          "0%": {
            opacity: 0,
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: 100,
            transform: "translateY(0px)",
          },
        },
        slideUpLeave: {
          "0%": {
            opacity: 0,
            transform: "translateY(0px)",
          },
          "100%": {
            opacity: 100,
            transform: "translateY(20px)",
          },
        },
        sortDir: {
          '0%': { transform: 'rotate(180deg)', fill: 'rgba(229, 229, 229, 1)' },
          '50%': { transform: 'rotate(30deg)', fill: 'rgba(108, 111, 116, 1)' },
          '75%': { transform: 'rotate(0deg)', fill: 'rgba(108, 111, 116, 1)' },
          '100%': { opacity: 1 },
        },
        loaded: {
          '0%': { opacity: 0.25 },
          '100%': { opacity: 1 },
        },
      },
    },
  },
  daisyui: {
    themes: [
      {
        light: {
          ...require('daisyui/src/colors/themes')['[data-theme=light]'],
          '.modal': {
            'background-color': '#00000054',
          },
          // Primary
          primary: '#209400',
          'primary-focus': '#1B7E00',
          '.btn-primary:active': {
            'background-color': '#1A7404',
            'border-color': '#1A7404',
          },
          '.btn-primary:focus-visible': {
            'background-color': '#1B7E00',
            'border-color': '#1B7E00',
            outline: 'none',
          },
          'primary-content': '#FFFFFF',
          // Primary Light
          '.btn-primary-light': {
            'background-color': '#45A62B',
            'border-color': 'transparent',
          },
          '.btn-primary-light:hover': {
            'background-color': '#59B042',
            'border-color': 'transparent',
          },
          '.btn-primary-light:active': {
            'background-color': '#1F8804',
            'border-color': 'transparent',
          },
          '.btn-primary-light:focus-visible': {
            'background-color': '#59B042',
            outline: 'none',
          },
          // Primary Light
          '.btn-primary-block-light': {
            'background-color': '#E8F4E5',
            color: '#209400',
            'border-color': 'transparent',
          },
          '.btn-primary-block-light:hover': {
            'background-color': '#209400',
            color: '#FFFFFF',
            'border-color': 'transparent',
          },
          '.btn-primary-block-light:active': {
            'background-color': '#1A7404',
            color: '#FFFFFF',
            'border-color': 'transparent',
          },
          '.btn-primary-block-light:focus-visible': {
            'background-color': '#209400',
            color: '#FFFFFF',
            outline: 'none',
          },
          // Primary Inline Light
          '.btn-primary-inline-light': {
            'background-color': '#209400',
            'border-color': 'transparent',
          },
          '.btn-primary-inline-light:hover': {
            'background-color': '#379F1A',
            'border-color': 'transparent',
          },
          '.btn-primary-inline-light:active': {
            'background-color': '#1F8804',
            'border-color': 'transparent',
          },
          '.btn-primary-inline-light:focus-visible': {
            'background-color': '#379F1A',
            outline: 'none',
          },
          // Secondary
          secondary: '#E5E5E5',
          'secondary-focus': '#CECECE',
          '.btn-secondary:active': {
            'background-color': '#BBBCBD',
          },
          '.btn-secondary:focus-visible': {
            outline: 'none',
            'background-color': '#CECECE',
            'border-color': '#CECECE',
          },
          'secondary-content': '#191E26',
          // Error
          error: '#A62F1F',
          '.btn-error:hover': {
            'background-color': '#8D281A',
          },
          '.btn-error:active': {
            'background-color': '#81271B',
          },
          '.btn-error:focus-visible': {
            outline: 'none',
            'background-color': '#8D281A',
            'border-color': '#8D281A',
          },
          'error-content': '#FFFFFF',
          // Remove
          '.btn-remove': {
            'background-color': 'rgba(246, 233, 232, 1)', // #F6E9E8
            'border-color': 'transparent',
          },
          '.btn-remove:hover': {
            'background-color': 'rgba(236, 212, 209, 1)', // #ECD4D1
            'border-color': 'rgba(236, 212, 209, 1)', // #ECD4D1
          },
          '.btn-remove:active': {
            'background-color': 'rgba(227, 191, 186, 1)', // #E3BFBA
            'border-color': 'rgba(227, 191, 186, 1)', // #E3BFBA
          },
          '.btn-remove:focus-visible': {
            'background-color': 'rgba(236, 212, 209, 1)', // #ECD4D1
            'border-color': 'rgba(236, 212, 209, 1)', // #ECD4D1
            outline: 'none',
          },
          'remove-content': '#FFFFFF',
          // Ghost override for Inline Light
          '.btn-ghost': {
            color: '#00A8CB',
          },
          '.btn-ghost:hover': {
            'background-color': '#F2FBFD',
          },
          '.btn-ghost:active': {
            'background-color': '#E7EFF2',
          },
          '.btn-ghost:focus-visible': {
            outline: 'none',
            'background-color': '#F2FBFD',
          },
          'ghost-content': '#00A8CB',
          // Disabled override
          '.btn-disabled': {
            'background-color': '#EBECEE',
            color: '#C2C4C8',
          },
          '.btn-disabled:focus-visible': {
            outline: 'none',
            'background-color': '#EBECEE',
            'border-color': '#EBECEE',
          },
          warning: '#EFAE41',
        },
      },
    ],
  },
  safelist: [
    {
      pattern: /(w-grid|text|opacity)-.*/,
    },
    {
      pattern: /grid-cols-./,
    },
  ],
  plugins: [require('daisyui')],
};
