import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

import locale from 'locale/pages';
import { pathConfig, validation } from 'config';
import { showAppAlert, dismissAppAlert, resetSavingAuthorState, updateCurrentAuthor } from 'actions';
import { useValidatedForm } from '../../../hooks';
import { Controller } from '../../SharedComponents/Toolbox/ReactHookForm';

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
export const GoogleScholarForm = ({ author }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        control,
        handleSubmit,
        formState: { isSubmitSuccessful, isSubmitting, server },
    } = useValidatedForm({
        mode: 'onChange',
        defaultValues: {
            aut_id: author?.aut_id,
            aut_google_scholar_id: author?.aut_google_scholar_id,
        },
    });

    const txt = locale.pages.googleScholarLink;
    const cardLocale = !author?.aut_google_scholar_id ? txt.add : txt.edit;

    React.useEffect(
        () => {
            if (isSubmitSuccessful) {
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
        [isSubmitSuccessful],
    );

    const onSubmit = async data =>
        await dispatch(updateCurrentAuthor(author.aut_id, data)).catch(e => server.error.set(e));

    const getAlert = () => {
        let alertProps = null;
        if (!isSubmitting && server.error.has) {
            alertProps = {
                ...txt.errorAlert,
                message: server.error.get()?.message,
            };
        } else if (isSubmitting) {
            alertProps = { ...txt.progressAlert };
        }
        return alertProps ? <Alert {...alertProps} /> : null;
    };

    const handleCancel = () => navigateToDashboard(navigate);

    return (
        <StandardPage title={txt.title}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <StandardCard title={cardLocale.title} help={txt.help}>
                            {cardLocale.description}
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Controller
                                        name="aut_google_scholar_id"
                                        control={control}
                                        rules={{
                                            validate: value =>
                                                validation.required(value) || validation.isValidGoogleScholarId(value),
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                textFieldId="aut-google-scholar-id"
                                                fullWidth
                                                disabled={isSubmitting}
                                                {...txt.labels.googleScholarIdField}
                                            />
                                        )}
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
                            disabled={isSubmitting}
                            children={txt.labels.cancel}
                            onClick={handleCancel}
                        />
                    </Grid>
                    <Grid item xs={12} sm={'auto'}>
                        <Button
                            type="submit"
                            id="submit-aut-google-scholar-id"
                            data-testid="submit-aut-google-scholar-id"
                            variant={'contained'}
                            color={'secondary'}
                            fullWidth
                            disabled={isSubmitting}
                            children={txt.labels.submit}
                        />
                    </Grid>
                </Grid>
            </form>
        </StandardPage>
    );
};

GoogleScholarForm.propTypes = {
    author: PropTypes.object,
};

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

    return <GoogleScholarForm author={author} />;
};

export default React.memo(GoogleScholar);
