import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reduxForm, getFormValues, getFormSyncErrors, SubmissionError, stopSubmit } from 'redux-form/immutable';
import Immutable from 'immutable';
import MyIncompleteRecord from '../components/MyIncompleteRecord';
import { withRouter } from 'react-router-dom';
import * as actions from 'actions';
import { confirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import { ORG_TYPE_NOT_SET } from 'config/general';
import { leftJoin } from 'helpers/general';
import { locale } from 'locale';
import { authorAffiliationRequired } from 'config/validation';

const FORM_NAME = 'MyIncompleteRecord';

const onSubmit = (values, dispatch, props) => {
    const data = {
        ...values.toJS(),
        publication: {...props.recordToFix},
        author: {...props.author}
    };
    return dispatch(actions.updateIncompleteRecord(data))
        .then(() => {
            // following from fixRecord...
            // once this promise is resolved form is submitted successfully and will call parent container
            // reported bug to redux-form:
            // reset form after success action was dispatched:
            // componentWillUnmount cleans up form, but then onSubmit success sets it back to active
            // setTimeout(()=>{
            //     dispatch(reset(FORM_NAME));
            // }, 100);
        }).catch(error => {
            throw new SubmissionError({_error: error.message});
        });
};

const validate = (values, props) => {
    const { author } = props;
    stopSubmit(FORM_NAME, null);
    const data = values.toJS();
    const errors = {};
    if (data.authorsAffiliation && data.authorsAffiliation.some(authorAffiliation => authorAffiliationRequired(authorAffiliation, author))) {
        errors.authorsAffiliation = locale.validationErrors.authorsAffiliationIncomplete;
    }
    return errors;
};

let MyIncompleteRecordContainer = reduxForm({
    form: FORM_NAME,
    enableReinitialize: true,
    validate,
    onSubmit
})(confirmDiscardFormChanges(MyIncompleteRecord, FORM_NAME));

const mapStateToProps = (state, ownProps) => {
    const { author } = state.get('accountReducer');
    const formErrors = getFormSyncErrors(FORM_NAME)(state) || Immutable.Map({});
    const importedValues = state.get('fixRecordReducer') && state.get('fixRecordReducer').recordToFix;
    let grants = [];
    let authors = [];
    if (importedValues) {
        grants = importedValues.fez_record_search_key_grant_agency.map((grantAgency, index) => ({
            grantAgencyName: grantAgency.rek_grant_agency,
            grantId: importedValues.fez_record_search_key_grant_id &&
                importedValues.fez_record_search_key_grant_id.length > 0 &&
                importedValues.fez_record_search_key_grant_id[index] &&
                importedValues.fez_record_search_key_grant_id[index].rek_grant_id || '',
            grantAgencyType: importedValues.fez_record_search_key_grant_agency_type &&
                importedValues.fez_record_search_key_grant_agency_type.length > 0 &&
                importedValues.fez_record_search_key_grant_id[index] &&
                importedValues.fez_record_search_key_grant_agency_type[index].rek_grant_agency_type || ORG_TYPE_NOT_SET,
            disabled: ownProps.disableInitialGrants
        }));

        const affiliationDataMap = [
            {
                infoArray: importedValues.fez_record_search_key_author,
                key: 'rek_author_order'
            },
            {
                infoArray: importedValues.fez_record_search_key_author_affiliation_name,
                key: 'rek_author_affiliation_name_order'
            },
            {
                infoArray: importedValues.fez_record_search_key_author_affiliation_type,
                key: 'rek_author_affiliation_type_order'
            },
        ];

        authors = affiliationDataMap
            .reduce((authors, affiliationData) => leftJoin(
                authors,
                affiliationData.infoArray,
                'rek_author_id_order',
                affiliationData.key
            ), importedValues.fez_record_search_key_author_id)
            .map((authorAffiliation) => ({
                affiliation: authorAffiliation.rek_author_affiliation_name === locale.global.orgTitle ? 'UQ' : 'NotUQ',
                creatorRole: '',
                nameAsPublished: authorAffiliation.rek_author,
                orgaff: authorAffiliation.rek_author_affiliation_name || '',
                orgtype: (authorAffiliation.rek_author_affiliation_type && String(authorAffiliation.rek_author_affiliation_type)) || '',
                uqIdentifier: String(authorAffiliation.rek_author_id) || '',
                disabled: authorAffiliation.rek_author_id && authorAffiliation.rek_author_id !== author.aut_id,
            }))
            .map(authorAffiliation => ({
                ...authorAffiliation,
                required: authorAffiliationRequired(authorAffiliation, author)}
            ));
    }

    const languages = importedValues && importedValues.fez_record_search_key_language.length > 0 && importedValues.fez_record_search_key_language.map(lang => lang.rek_language) || ['eng'];

    return {
        ...state.get('fixRecordReducer'),
        ...state.get('accountReducer'),
        formValues: getFormValues(FORM_NAME)(state) || Immutable.Map({}),
        formErrors: formErrors,
        disableSubmit: formErrors && !(formErrors instanceof Immutable.Map),
        initialValues: {
            grants,
            authorsAffiliation: authors,
            languages
        }
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

MyIncompleteRecordContainer = connect(mapStateToProps, mapDispatchToProps)(MyIncompleteRecordContainer);
MyIncompleteRecordContainer = withRouter(MyIncompleteRecordContainer);
export default MyIncompleteRecordContainer;
