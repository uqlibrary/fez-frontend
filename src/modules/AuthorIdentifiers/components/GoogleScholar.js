import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Field, reduxForm, SubmissionError } from 'redux-form/immutable';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import locale from 'locale/pages';
import { pathConfig, validation } from 'config';
import { showAppAlert, dismissAppAlert, resetSavingAuthorState, updateCurrentAuthor } from 'actions';

const FORM_NAME = 'GoogleScholar';

/**
 * Function to redirect user to Dashboard page
 *
 * @param {function} navigate function from react-router-dom
 */
export const navigateToDashboard = navigate => {
    navigate(pathConfig.dashboard);
};

/**
 * A submit handler for the Google Scholar ID form
 *
 * @param {object} values Values from redux form
 * @param {function} dispatch Dispatch function from redux store
 * @param {object} props All the props passed from the component
 */
const onSubmit = (values, dispatch, props) => {
    return dispatch(updateCurrentAuthor(props.author.aut_id, values.toJS())).catch(error => {
        throw new SubmissionError({ _error: error.message });
    });
};

export const GoogleScholarForm = ({ author, error, handleSubmit, submitFailed, submitSucceeded, submitting }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const txt = locale.pages.googleScholarLink;
    const cardLocale = !!author && !author.aut_google_scholar_id ? txt.add : txt.edit;

    React.useEffect(
        () => {
            if (submitSucceeded) {
                dispatch(
                    showAppAlert({
                        ...locale.pages.googleScholarLink.successAlert,
                        dismissAction: /* istanbul ignore next */ () => dispatch(dismissAppAlert()),
                    }),
                );
                navigateToDashboard(navigate);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [submitSucceeded],
    );

    const handleKeyboardFormSubmit = event => {
        event.key === 'Enter' && handleSubmit();
    };

    const handleCancel = () => navigateToDashboard(navigate);

    const getAlert = () => {
        let alertProps = null;
        if (submitFailed && error) {
            alertProps = {
                ...txt.errorAlert,
                message: error,
            };
        } else if (submitting) {
            alertProps = { ...txt.progressAlert };
        }
        return alertProps ? <Alert {...alertProps} /> : null;
    };

    return (
        <StandardPage title={txt.title}>
            <form onKeyDown={handleKeyboardFormSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <StandardCard title={cardLocale.title} help={txt.help}>
                            {cardLocale.description}
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Field
                                        component={TextField}
                                        disabled={submitting}
                                        textFieldId="aut-google-scholar-id"
                                        name="aut_google_scholar_id"
                                        fullWidth
                                        validate={[validation.required, validation.isValidGoogleScholarId]}
                                        {...txt.labels.googleScholarIdField}
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>

                    {
                        <Grid item xs={12}>
                            {getAlert()}
                        </Grid>
                    }
                </Grid>
                <Grid container spacing={2}>
                    <Grid item xs sx={{ display: { xs: 'none', sm: 'block' } }} />
                    <Grid item xs={12} sm={'auto'}>
                        <Button
                            id="cancel-aut-google-scholar-id"
                            data-testid="cancel-aut-google-scholar-id"
                            variant={'contained'}
                            color={'primary'}
                            fullWidth
                            disabled={submitting}
                            children={txt.labels.cancel}
                            onClick={handleCancel}
                        />
                    </Grid>
                    <Grid item xs={12} sm={'auto'}>
                        <Button
                            id="submit-aut-google-scholar-id"
                            data-testid="submit-aut-google-scholar-id"
                            variant={'contained'}
                            color={'secondary'}
                            fullWidth
                            disabled={submitting}
                            children={txt.labels.submit}
                            onClick={handleSubmit}
                        />
                    </Grid>
                </Grid>
            </form>
        </StandardPage>
    );
};

GoogleScholarForm.propTypes = {
    author: PropTypes.object,
    error: PropTypes.string,
    handleSubmit: PropTypes.func,
    submitFailed: PropTypes.bool,
    submitSucceeded: PropTypes.bool,
    submitting: PropTypes.bool,
};

export const GoogleScholarReduxForm = reduxForm({
    form: FORM_NAME,
    onSubmit,
})(GoogleScholarForm);

export const GoogleScholar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const author = useSelector(state => state.get('accountReducer').author);
    const accountAuthorLoading = useSelector(state => state.get('accountReducer').accountAuthorLoading);

    React.useEffect(function callback() {
        if (!accountAuthorLoading && !author) {
            navigateToDashboard(navigate);
        }

        return () => dispatch(resetSavingAuthorState());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const initialValues = !!author
        ? { aut_id: author.aut_id, aut_google_scholar_id: author.aut_google_scholar_id }
        : null;

    return (
        <GoogleScholarReduxForm
            initialValues={initialValues}
            author={author}
            accountAuthorLoading={accountAuthorLoading}
        />
    );
};

export default React.memo(GoogleScholar);
