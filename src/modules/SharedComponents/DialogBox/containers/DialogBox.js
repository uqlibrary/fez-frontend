import {connect} from 'react-redux';
import DialogBox from '../components/DialogBox';
import {hideDialogBox} from 'modules/App';

const mapDispatchToProps = (dispatch) => {
    return {
        hideDialogBox: () => dispatch(hideDialogBox()),
    };
};

const DialogBoxContaier = connect(null, mapDispatchToProps)(DialogBox);

export default DialogBoxContaier;
