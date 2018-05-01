import {connect} from 'react-redux';

import HelpIcon from '../components/HelpIcon';
import {show} from '../actions';

const HelpIconContainer = connect(undefined, dispatch => {
    return {
        onClick: (title, text, buttonLabel) => dispatch(show(title, text, buttonLabel))
    };
})(HelpIcon);

export default HelpIconContainer;
