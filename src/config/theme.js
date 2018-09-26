import orange from '@material-ui/core/colors/orange';
import red from '@material-ui/core/colors/red';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

export const mui1theme = createMuiTheme({
    palette: {
        primary: {
            light: '#760d98',
            main: '#49075E',
            dark: '#370546',
        },
        secondary: {
            light: '#f2f2f2',
            main: '#595959',
            dark: '#333333'
        },
        accent: {
            light: '#288BED',
            main: '#2377CB',
            dark: '#005EA5'
        },
        white: {
            main: '#FFFFFF'
        },
        warning: {
            light: '#ff9a57',
            main: '#bf5000',
            dark: '#542400',
        },
        success: {
            light: '#00a700',
            main: '#007200',
            dark: '#005000'
        },
        error: {
            light: '#ff0000',
            main: '#c80000',
            dark: '#790000'
        }
    },
    status: {
        danger: red[500],
        warning: orange[500]
    },
    typography: {
        fontWeightLight: 200,
        fontWeightRegular: 300,
        fontWeightMedium: 400,
        title: {
            fontSize: '1.5rem',
            fontWeight: 300
        }
    },
    overrides: {
        MuiFormLabel: {
            root: {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                width: '100%',
                textOverflow: 'ellipsis'
            }
        }
    },
    graphs: {
        color1: '#d72865',
        color2: '#1e7d94',
        color3: '#49075E',
        color4: '#468fcc',
        color5: '#f28620',
        color6: '#333333',
        color7: '#595959'
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
    }
});
