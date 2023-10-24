import { createTheme } from '@mui/material/styles';

import { orange, red } from '@mui/material/colors';

const palette = {
    primary: {
        light: '#962A8B',
        main: '#51247A',
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
        main: '#FFFFFF',
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

const isJestTest = () => {
    try {
        return !!process.env.JEST_WORKER_ID;
    } catch (e) {
        return false;
    }
};

export const mui1theme = createTheme({
    palette: palette,
    status: {
        danger: red[500],
        warning: orange[500],
    },
    typography: {
        fontWeightLight: 200,
        fontWeightRegular: 300,
        fontWeightMedium: 400,
        useNextVariants: true,
        suppressDeprecationWarnings: true,
    },
    components: {
        MuiButtonBase: {
            defaultProps: {
                // Disable ripple for jest tests
                disableRipple: isJestTest(),
            },
        },
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
        MuiButton: {
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
        MuiUseMediaQuery: {
            defaultProps: {
                noSsr: true,
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
});

export const adminTheme = createTheme({
    palette: palette,
    components: {
        MuiButtonBase: {
            defaultProps: {
                // Disable ripple for jest tests
                disableRipple: isJestTest(),
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
        MuiGrid2: {
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
});
