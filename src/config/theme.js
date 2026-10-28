import { createTheme } from '@mui/material/styles';
import { orange, red } from '@mui/material/colors';
import { IS_JEST_TEST } from './general';
import ds from './designSystemTokens';

const desktopMediaQuery = `@media (min-width:${ds.desktop.breakpoint})`;

const palette = {
    primary: {
        light: ds.colour.purple.light,
        main: ds.colour.purple[500],
        dark: '#3b1a59',
        gradient: {
            horizontal: {
                background: 'linear-gradient(to right, rgb(81,36,122) 55%,rgb(150,42,139) 100%)',
                filter:
                    'progid:DXImageTransform.Microsoft.gradient( startColorstr="#51247a", ' +
                    'endColorstr="#962a8b",GradientType=1 )',
            },
            diagonal: {
                background: 'linear-gradient(135deg, rgb(81,36,122) 55%,rgb(150,42,139) 100%)',
                filter:
                    'progid:DXImageTransform.Microsoft.gradient( startColorstr="#51247a", ' +
                    'endColorstr="#962a8b",GradientType=1 )',
            },
        },
    },
    default: {
        light: 'rgba(0, 0, 0, 0.87)',
        main: '#595959',
        dark: '#333333',
    },
    secondary: {
        light: '#f2f2f2',
        main: '#595959',
        dark: '#333333',
    },
    accent: {
        light: '#54acff',
        main: '#316799',
        dark: '#2a557d',
    },
    white: {
        main: ds.colour.white,
    },
    warning: {
        light: '#ff9a57',
        main: '#bf5000',
        dark: '#542400',
    },
    success: {
        light: '#00a700',
        main: '#007200',
        dark: '#005000',
    },
    error: {
        light: '#ff0000',
        main: '#c80000',
        dark: '#790000',
    },
};

// UQ Design System typography (_text-constants.scss): Roboto body, Montserrat headings.
// The DS applies Montserrat ($font-title) to h1 only (body/_component.scss); h2-h6 inherit Roboto at
// medium 500 / line-height 1.2. Weights: normal 400, medium/bold 500 - the DS defines no light (300)
// and no 700 (bold === medium). Body line-height 1.6, heading line-height 1.2, 1% letter-spacing on
// every variant. Heading sizes follow the DS type scale; H1-H3 drop to the DS mobile sizes below 1024px
// (the DS switches at min-width:1024px in _css-variables.scss). H4-H6 are a single size.
const montserrat = ds.font.face.montserrat;
const roboto = ds.font.face.roboto;
// h2-h6: Roboto (the DS body font) at medium weight; h1 alone gets Montserrat via displayHeading.
const heading = size => ({
    fontFamily: roboto,
    fontWeight: ds.font.weight.medium,
    lineHeight: ds.lineHeight.short,
    ...size,
});
const displayHeading = size => ({ ...heading(size), fontFamily: montserrat });
const typography = {
    fontFamily: roboto,
    fontWeightLight: ds.font.weight.light,
    fontWeightRegular: ds.font.weight.normal,
    fontWeightMedium: ds.font.weight.medium,
    fontWeightBold: ds.font.weight.bold,
    useNextVariants: true,
    suppressDeprecationWarnings: true,
    allVariants: { letterSpacing: ds.spacing.letter },
    h1: displayHeading({
        fontSize: ds.font.size.xxxxl,
        [desktopMediaQuery]: { fontSize: ds.desktop.font.size.xxxxl },
    }),
    h2: heading({
        fontSize: ds.font.size.xxxl,
        [desktopMediaQuery]: { fontSize: ds.desktop.font.size.xxxl },
    }),
    h3: heading({
        fontSize: ds.font.size.xxl,
        [desktopMediaQuery]: { fontSize: ds.desktop.font.size.xxl },
    }),
    h4: heading({ fontSize: ds.font.size.xl }),
    h5: heading({ fontSize: ds.font.size.l }),
    h6: heading({ fontSize: ds.font.size.m }),
    body1: { lineHeight: ds.lineHeight.long },
    body2: { lineHeight: ds.lineHeight.long },
};
const dsOutlineStandard = {
    outline: `4px solid ${ds.colour.utility[500]}`,
    outlineOffset: '0px', // Prevents the outline from touching the text
};

// DS theme overrides defined here in one place, then
// merged in to the two themes below. This allows us to
// not only have a single source of truth for the overrides,
// but also easily allows us to override/add to them in
// each specific theme if required - Mui will merge both
// sets of settings together for us.
export const commonThemeOverrides = {
    MuiInputBase: {
        styleOverrides: {
            root: {
                '&.Mui-focused': {
                    ...dsOutlineStandard,

                    '&:before': {
                        borderBottom: 'none !important',
                    },
                },
                // padding: `12px ${ds.spacing.m}`, // might be needed for ds input spacing
            },
        },
    },
    MuiInput: {
        styleOverrides: {
            root: {
                // Remove the default expanding blue bottom line on focus
                '&:after': {
                    borderBottom: 'none',
                },
            },
        },
    },
    MuiAppBar: {
        styleOverrides: {
            // `&&` raises specificity above the global MuiButtonBase focus rule.
            root: {
                '&& .MuiButtonBase-root.Mui-focusVisible': {
                    outlineOffset: '-4px', // Draws the outline inside the button
                },
            },
        },
    },

    // MuiInputLabel: { //
    //     styleOverrides: {
    //         root: {
    //             transform: 'translate(0, 20px) scale(1)',

    //             '&.MuiInputLabel-shrink': {
    //                 transform: 'translate(0, -6px) scale(0.75)', // Change -4px to shift it up or down
    //             },
    //         },
    //     },
    // },

    'MuiTiptap-FieldContainer': {
        defaultProps: {
            // If no `variant` value is set, use "standard"
            variant: 'standard',
        },
        styleOverrides: {
            // Apply this background color to the `root` slot
            root: {
                '&.MuiTiptap-FieldContainer-focused': {
                    ...dsOutlineStandard,

                    '&:hover': {
                        '& .MuiTiptap-FieldContainer-notchedOutline': {
                            border: 'none',
                        },
                    },
                },
            },
        },
    },

    'MuiTiptap-MenuButton': {
        styleOverrides: {
            root: {
                '& button.Mui-focusVisible': {
                    ...dsOutlineStandard,
                    borderRadius: '16px',
                },
            },
        },
    },

    MuiButtonBase: {
        styleOverrides: {
            root: {
                '&.Mui-focusVisible:not(.MuiSwitch-switchBase, .MuiCheckbox-root, .MuiRadio-root)': {
                    ...dsOutlineStandard,
                },
                // keep the standard outline, but make it visible on the purple header
                'header &.Mui-focusVisible:not(.MuiSwitch-switchBase)': {
                    ...dsOutlineStandard,
                    outlineColor: ds.colour.white,
                },
                // draw the outline inside the box for checkbox / radio buttons
                // (`&&` keeps this above the header rule when they sit in the header)
                '&&.Mui-focusVisible:is(.MuiCheckbox-root, .MuiRadio-root)': {
                    '& svg': {
                        ...dsOutlineStandard,
                        outlineOffset: '-6px',
                    },
                },
            },
        },
    },

    MuiSwitch: {
        styleOverrides: {
            // outline the switch thumb only when the input has keyboard focus
            switchBase: {
                '&.Mui-focusVisible .MuiSwitch-thumb': {
                    outline: `4px solid ${ds.colour.utility[500]}`,
                    outlineOffset: '0px', // Prevents the outline from touching the text
                },
            },
        },
    },

    MuiChip: {
        styleOverrides: {
            colorDefault: {
                '&.Mui-focusVisible': {
                    background: ds.colour.grey[100], // or 'transparent' to keep the chip's normal fill
                },
                '&:hover': {
                    backgroundColor: ds.colour.grey[100], // only matters for clickable chips
                },
            },
        },
    },

    MuiImageListItem: {
        styleOverrides: {
            root: {
                '&:focus-visible': {
                    ...dsOutlineStandard,
                },
            },
        },
    },
};

export const mui1theme = createTheme(
    {
        palette: palette,
        status: {
            danger: red[500],
            warning: orange[500],
        },
        typography,
        components: {
            MuiFormLabel: {
                styleOverrides: {
                    root: {
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        width: '100%',
                        textOverflow: 'ellipsis',
                    },
                },
            },
            MuiMenuItem: {
                styleOverrides: {
                    root: {
                        '&.selected': {
                            backgroundColor: '#4085C6 !important',
                            color: '#FFFFFF',
                        },
                    },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    colorInherit: {
                        color: 'none',
                    },
                },
            },
            MUIDataTable: {
                styleOverrides: {
                    paper: {
                        boxShadow: 'none',
                        padding: 0,
                        margin: 0,
                    },
                },
            },
            MuiButtonBase: {
                defaultProps: {
                    // Disable ripple for jest tests
                    disableRipple: IS_JEST_TEST,
                },
                styleOverrides: {
                    root: {
                        variants: [
                            {
                                props: { variant: 'contained', color: 'default' }, // restore button default style to mui5
                                style: {
                                    color: palette.default,
                                    boxShadow:
                                        '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
                                    backgroundColor: '#e0e0e0',
                                    '&:hover': {
                                        boxShadow:
                                            '0px 2px 4px -1px rgba(0,0,0,0.2),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
                                        backgroundColor: '#d5d5d5',
                                    },
                                },
                            },
                        ],
                    },
                },
            },
            MuiUseMediaQuery: {
                defaultProps: {
                    noSsr: true,
                },
            },
            MuiDataGrid: {
                styleOverrides: {
                    root: {
                        '& .MuiDataGrid-columnHeader:focus, .MuiDataGrid-cell:focus': {
                            outline: 'none',
                        },
                        '& .MuiDataGrid-columnHeader:focus-within, .MuiDataGrid-cell:focus-within': {
                            outline: 'none',
                        },
                    },
                },
            },
        },
        graphs: {
            color1: '#d72865',
            color2: '#1e7d94',
            color3: '#49075E',
            color4: '#468fcc',
            color5: '#f28620',
            color6: '#333333',
            color7: '#595959',
        },
        // Converts a color hex code to RGBA when referenced from a component
        hexToRGBA: (hex, alpha) => {
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);

            if (alpha) {
                return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + alpha + ')';
            } else {
                return 'rgb(' + r + ', ' + g + ', ' + b + ')';
            }
        },
    },
    { components: commonThemeOverrides }, // merge in our DS overrides
);

export const adminTheme = createTheme(
    {
        palette: palette,
        typography,
        components: {
            MuiButton: {
                defaultProps: {
                    // Disable ripple for jest tests
                    disableRipple: IS_JEST_TEST,
                },
            },
            MuiFormLabel: {
                styleOverrides: {
                    root: {
                        color: '#4085C6',
                    },
                },
            },
            MuiInputBase: {
                styleOverrides: {
                    root: {
                        fontWeight: 400,
                    },
                },
            },
            MuiIconButton: {
                styleOverrides: {
                    colorInherit: {
                        color: 'none',
                    },
                },
            },
            MuiGrid: {
                styleOverrides: {
                    root: {
                        minWidth: 'auto',
                    },
                },
            },
            MuiUseMediaQuery: {
                defaultProps: {
                    noSsr: true,
                },
            },
        },
    },
    { components: commonThemeOverrides }, // merge in our DS overrides
);
