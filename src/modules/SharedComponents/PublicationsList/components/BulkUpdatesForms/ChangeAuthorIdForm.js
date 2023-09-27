import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { getFormSyncErrors, Field, reduxForm, SubmissionError, formValueSelector, change } from 'redux-form/immutable';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { UqIdField } from 'modules/SharedComponents/LookupFields';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { TextField as GenericTextField } from 'modules/SharedComponents/Toolbox/TextField';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { locale } from 'locale';
import { validation } from 'config';
import { changeAuthorId } from 'actions';
import { SEARCH_AUTHOR_BY, SEARCH_BY_AUTHOR_NAME, SEARCH_BY_AUTHOR_ID } from 'config/bulkUpdates';

const FORM_NAME = 'ChangeAuthorIdForm';
const selector = formValueSelector(FORM_NAME);

const onSubmit = (values, dispatch, props) => {
    return dispatch(changeAuthorId(Object.values(props.recordsSelected), values.toJS())).catch(error => {
        throw new SubmissionError({ _error: error.message });
    });
};

export const ChangeAuthorIdForm = ({ error, handleSubmit, recordsSelected, submitting, submitSucceeded, onCancel }) => {
    const dispatch = useDispatch();
    const txt = locale.components.bulkUpdates.bulkUpdatesForms;
    const formErrors = useSelector(state => getFormSyncErrors(FORM_NAME)(state));
    const searchAuthorBy = useSelector(state => selector(state, 'search_author_by'));
    const searchAuthorByName = useSelector(state => selector(state, 'search_author.author'));

    const disableSubmit = !!formErrors && !(formErrors instanceof Immutable.Map) && Object.keys(formErrors).length > 0;
    const handleClear = field => () => dispatch(change(FORM_NAME, field, null));

    const authorNames = React.createRef(null);
    const [authorNameNoMatchCount, setAuthorNameNoMatchCount] = React.useState(null);
    authorNames.current =
        !!recordsSelected &&
        recordsSelected.length > 0 &&
        Object.values(recordsSelected).map(record =>
            record.fez_record_search_key_author.map(author => author.rek_author),
        );

    React.useEffect(() => {
        if (!!searchAuthorByName) {
            const count = authorNames.current.filter(author => !author.includes(searchAuthorByName)).length;
            setAuthorNameNoMatchCount(count);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchAuthorByName]);

    React.useEffect(() => {
        if (submitSucceeded) {
            setTimeout(onCancel, 2000);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [submitSucceeded]);

    return (
        <form data-testid="change-author-id-form" id="change-author-id-form">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert alertId="alert-info-change-author-id" {...txt.changeAuthorIdForm.alert} />
                </Grid>
                {searchAuthorBy === SEARCH_BY_AUTHOR_NAME && !!searchAuthorByName && (
                    <Grid item xs={12}>
                        <Alert
                            alertId="alert-warning-change-author-id"
                            {...txt.changeAuthorIdForm.warningAlert}
                            message={txt.changeAuthorIdForm.warningAlert.message
                                .replace('[authorNameNoMatchCount]', authorNameNoMatchCount)
                                .replace('[numberOfSelectedWorks]', Object.keys(recordsSelected).length)}
                        />
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Field
                        component={NewGenericSelectField}
                        disabled={submitting || submitSucceeded}
                        genericSelectFieldId="search-author-by"
                        label={txt.changeAuthorIdForm.formLabels.searchBy}
                        itemsList={Object.values(SEARCH_AUTHOR_BY)}
                        name="search_author_by"
                        selectPrompt={txt.changeAuthorIdForm.selectPrompt}
                        required
                        validate={[validation.required]}
                    />
                </Grid>
                {searchAuthorBy === SEARCH_BY_AUTHOR_NAME && (
                    <Grid item xs={12}>
                        <Field
                            component={GenericTextField}
                            disabled={submitting || submitSucceeded}
                            textFieldId="search-by-rek-author"
                            fullWidth
                            label={txt.changeAuthorIdForm.formLabels.searchByAuthorName}
                            name={`search_author.${searchAuthorBy}`}
                            required
                            validate={[validation.required]}
                        />
                    </Grid>
                )}
                {searchAuthorBy === SEARCH_BY_AUTHOR_ID && (
                    <Grid item xs={12}>
                        <Field
                            component={UqIdField}
                            disabled={submitting || submitSucceeded}
                            floatingLabelText={txt.changeAuthorIdForm.formLabels.searchByAuthorId}
                            name={`search_author.${searchAuthorBy}`}
                            required
                            validate={[validation.required]}
                            uqIdFieldId="search-by-rek-author-id"
                            getOptionLabel={option => !!option && `${option.id} (${option.value})`}
                            normalize={value => value.aut_id}
                            onClear={handleClear(`search_author.${searchAuthorBy}`)}
                        />
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Field
                        component={UqIdField}
                        disabled={submitting || submitSucceeded}
                        floatingLabelText={txt.changeAuthorIdForm.formLabels.authorId}
                        name="rek_author_id"
                        required
                        validate={[validation.required]}
                        uqIdFieldId="rek-author-id"
                        getOptionLabel={option => !!option && `${option.id} (${option.value})`}
                        normalize={value => value.aut_id}
                        onClear={handleClear('rek_author_id')}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        aria-label={txt.changeAuthorIdForm.formLabels.cancelButtonLabel}
                        children={txt.changeAuthorIdForm.formLabels.cancelButtonLabel}
                        data-analyticsid="change-author-id-cancel"
                        data-testid="change-author-id-cancel"
                        disabled={submitting}
                        fullWidth
                        id="change-author-id-cancel"
                        onClick={onCancel}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        aria-label={txt.changeAuthorIdForm.formLabels.submitButtonLabel}
                        children={txt.changeAuthorIdForm.formLabels.submitButtonLabel}
                        color="primary"
                        data-analyticsid="change-author-id-submit"
                        data-testid="change-author-id-submit"
                        disabled={submitting || disableSubmit || submitSucceeded}
                        fullWidth
                        id="change-author-id-submit"
                        onClick={handleSubmit}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12}>
                    {!!submitting && (
                        <Alert alertId="alert-info-change-author-id" {...txt.changeAuthorIdForm.submittingAlert} />
                    )}
                    {!!submitSucceeded && (
                        <Alert alertId="alert-done-change-author-id" {...txt.changeAuthorIdForm.successAlert} />
                    )}
                    {!!error && <Alert alertId="alert-error-change-author-id" {...txt.changeAuthorIdForm.errorAlert} />}
                </Grid>
            </Grid>
        </form>
    );
};

ChangeAuthorIdForm.propTypes = {
    error: PropTypes.string,
    handleSubmit: PropTypes.func,
    onCancel: PropTypes.func,
    recordsSelected: PropTypes.object,
    submitting: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
};

const ChangeAuthorIdReduxForm = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(ChangeAuthorIdForm);

export default React.memo(ChangeAuthorIdReduxForm);
