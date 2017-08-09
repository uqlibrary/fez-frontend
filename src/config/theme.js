import {white, darkBlack, fullBlack, grey300} from 'material-ui/styles/colors';
import {fade, darken} from 'material-ui/utils/colorManipulator';
import spacing from 'material-ui/styles/spacing';

export default {
    spacing: spacing,
    fontFamily: 'Roboto, sans-serif',
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
    }
};
