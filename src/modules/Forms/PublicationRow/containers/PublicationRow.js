import {reduxForm} from 'redux-form/immutable';
import PublicationRow from '../components/PublicationRow';


const PublicationRowFormContainer = reduxForm({
    destroyOnUnmount: false
})(PublicationRow);


export default PublicationRowFormContainer;
