import {white, darkBlack, fullBlack, grey300} from 'material-ui/styles/colors';
import {fade, darken} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import red from '@material-ui/core/colors/red';

// MUI1
import {createMuiTheme} from '@material-ui/core/styles';

export const oldtheme = getMuiTheme({
    // Old styles MUI 0.x
    spacing: spacing,
    fontFamily: 'Roboto, sans-serif',
    fontWeight: 300,
    palette: {
        primary1Color: '#49075E',
        primary2Color: '#370546',
        primary3Color: '#6B0C8A',
        accent1Color: darken('#4285f4', 0.15),
        accent2Color: '#005EA5',
        accent3Color: '#71A3F7',
        textColor: darkBlack,
        secondaryTextColor: fade(darkBlack, 0.54),
        alternateTextColor: white,
        canvasColor: white,
        borderColor: grey300,
        disabledColor: fade(darkBlack, 0.3),
        pickerHeaderColor: '#4285f4',
        clockCircleColor: fade(darkBlack, 0.07),
        shadowColor: fullBlack
    },
});

export const mui1theme = createMuiTheme({
    palette: {
        primary: {
            light: '#6B0C8A',
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
        }
    },
    status: {
        danger: red[500]
    },
    typography: {
        fontWeightLight: 200,
        fontWeightRegular: 300,
        fontWeightMedium: 400
    }
});
