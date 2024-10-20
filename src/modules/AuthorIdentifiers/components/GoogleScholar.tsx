import React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

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
import { SERVER_ERROR_KEY } from '../../../config/general';
import { AppState } from '../../../reducer';
import { FieldValues } from 'react-hook-form';
import { FezAuthor } from '../../../reducers/account';

// Pick desired FezAuthor's attributes as optional
type FormValues = Pick<Partial<FezAuthor>, 'aut_id' | 'aut_google_scholar_id'>;

/**
 * Function to redirect user to Dashboard page
 *
 * @param {function} navigate function from react-router-dom
 */
export const navigateToDashboard = (navigate: NavigateFunction) => {
    navigate(pathConfig.dashboard);
};

/**
 * A submit handler for the Google Scholar ID form
 */
export const GoogleScholarForm: React.FC<{ author: FezAuthor | null }> = ({ author }: { author: FezAuthor | null }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {
        setError,
        control,
        handleSubmit,
        formState: { errors, isSubmitSuccessful, isSubmitting },
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

    const onSubmit = async (data: FormValues) =>
        author?.aut_id &&
        dispatch(await updateCurrentAuthor(author.aut_id, data))
            // @ts-ignore
            .catch(e => {
                // set form error in case of exceptions - it will be handled and displayed below
                setError(SERVER_ERROR_KEY, { type: 'custom', message: e.message });
            });

    const getAlert = () => {
        let alertProps = null;
        if (!isSubmitting && errors[SERVER_ERROR_KEY]) {
            alertProps = {
                ...txt.errorAlert,
                message: errors[SERVER_ERROR_KEY]?.message as string | undefined,
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
                                            validate: (value: string) =>
                                                validation.required(value) || validation.isValidGoogleScholarId(value),
                                        }}
                                        render={({ field }: { field: FieldValues }) => (
                                            <TextField
                                                {...field}
                                                // @ts-ignore
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

export const GoogleScholar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const author: FezAuthor | null = useSelector((state: AppState) => state.get('accountReducer').author);
    const accountAuthorLoading: boolean = useSelector(
        (state: AppState) => state.get('accountReducer').accountAuthorLoading,
    );

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
