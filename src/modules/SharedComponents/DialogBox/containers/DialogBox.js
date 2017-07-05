import {connect} from 'react-redux';
import DialogBox from '../components/DialogBox';
import {hideDialogBox} from 'modules/App';
import {withRouter} from 'react-router-dom';

const mapDispatchToProps = (dispatch) => {
    return {
        hideDialogBox: () => dispatch(hideDialogBox()),
    };
};

let DialogBoxContainer = connect(null, mapDispatchToProps)(DialogBox);

DialogBoxContainer = withRouter(DialogBoxContainer);

export default DialogBoxContainer;
