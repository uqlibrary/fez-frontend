import React from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { UqIdField } from 'modules/SharedComponents/LookupFields';
import { NewGenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { TextField as GenericTextField } from 'modules/SharedComponents/Toolbox/TextField';
import { locale } from 'locale';
import { validation } from 'config';
import { changeAuthorId } from 'actions';
import { SEARCH_AUTHOR_BY, SEARCH_BY_AUTHOR_NAME, SEARCH_BY_AUTHOR_ID } from 'config/bulkUpdates';
import { useValidatedForm } from 'hooks';
import { Field } from '../../../Toolbox/ReactHookForm';
import { useWatch } from 'react-hook-form';

export const ChangeAuthorIdForm = ({ recordsSelected, onCancel }) => {
    const txt = locale.components.bulkUpdates.bulkUpdatesForms;
    const dispatch = useDispatch();
    const authorNames = React.createRef(null);
    const [authorNameNoMatchCount, setAuthorNameNoMatchCount] = React.useState(null);
    const {
        control,
        trigger,
        unregister,
        resetField,
        safelyHandleSubmit,
        formState: { isSubmitting, isSubmitSuccessful, serverError, hasServerError, hasError },
    } = useValidatedForm();
    const [searchAuthorBy, searchAuthorByName] = useWatch({
        control,
        name: ['search_author_by', 'search_author.author'],
    });

    authorNames.current = Object.values(recordsSelected).map(record =>
        record.fez_record_search_key_author.map(author => author.rek_author),
    );

    // handles "search author by" option changes
    React.useEffect(() => {
        // remove hidden field
        unregister(searchAuthorBy !== SEARCH_BY_AUTHOR_NAME ? 'search_author.author' : 'search_author.author_id');
        // trigger validation for added field
        trigger(`search_author.${searchAuthorBy}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchAuthorBy]);

    // handles raising alert about unmatched authors when searching by authors name
    React.useEffect(() => {
        if (!searchAuthorByName) return;
        const count = authorNames.current.filter(author => !author.includes(searchAuthorByName)).length;
        setAuthorNameNoMatchCount(count);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchAuthorByName]);

    React.useEffect(() => {
        if (!isSubmitSuccessful) return;
        setTimeout(onCancel, 2000);
    }, [isSubmitSuccessful, onCancel]);

    const handleClear = field => () => {
        resetField(field);
        (async () => await trigger(field))();
    };

    const onSubmit = safelyHandleSubmit(
        async data => await dispatch(changeAuthorId(Object.values(recordsSelected), data)),
    );

    return (
        <form data-testid="change-author-id-form" id="change-author-id-form">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Alert alertId="alert-info-change-author-id" {...txt.changeAuthorIdForm.alert} />
                </Grid>
                {searchAuthorBy === SEARCH_BY_AUTHOR_NAME && !!searchAuthorByName && !!authorNameNoMatchCount && (
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
                        control={control}
                        component={NewGenericSelectField}
                        disabled={isSubmitting || isSubmitSuccessful}
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
                            control={control}
                            component={GenericTextField}
                            disabled={isSubmitting || isSubmitSuccessful}
                            textFieldId="search-by-rek-author"
                            fullWidth
                            label={txt.changeAuthorIdForm.formLabels.searchByAuthorName}
                            name={'search_author.author'}
                            required
                            validate={[validation.required]}
                        />
                    </Grid>
                )}
                {searchAuthorBy === SEARCH_BY_AUTHOR_ID && (
                    <Grid item xs={12}>
                        <Field
                            control={control}
                            component={UqIdField}
                            disabled={isSubmitting || isSubmitSuccessful}
                            floatingLabelText={txt.changeAuthorIdForm.formLabels.searchByAuthorId}
                            name={'search_author.author_id'}
                            required
                            validate={[validation.required]}
                            uqIdFieldId="search-by-rek-author-id"
                            getOptionLabel={option => !!option && `${option.id} (${option.value})`}
                            normalize={value => value.aut_id}
                            onClear={handleClear('search_author.author_id')}
                        />
                    </Grid>
                )}
                <Grid item xs={12}>
                    <Field
                        control={control}
                        component={UqIdField}
                        disabled={isSubmitting || isSubmitSuccessful}
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
                        disabled={isSubmitting}
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
                        disabled={hasError || isSubmitting || isSubmitSuccessful}
                        fullWidth
                        id="change-author-id-submit"
                        onClick={onSubmit}
                        variant="contained"
                    />
                </Grid>
                <Grid item xs={12}>
                    {isSubmitting && (
                        <Alert alertId="alert-info-change-author-id" {...txt.changeAuthorIdForm.submittingAlert} />
                    )}
                    {isSubmitSuccessful && (
                        <Alert alertId="alert-done-change-author-id" {...txt.changeAuthorIdForm.successAlert} />
                    )}
                    {hasServerError && (
                        <Alert alertId="alert-error-change-author-id" {...txt.changeAuthorIdForm.errorAlert}>
                            {serverError}
                        </Alert>
                    )}
                </Grid>
            </Grid>
        </form>
    );
};

ChangeAuthorIdForm.propTypes = {
    onCancel: PropTypes.func,
    recordsSelected: PropTypes.object,
};

export default React.memo(ChangeAuthorIdForm);
