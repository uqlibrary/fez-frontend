import React from 'react';

import { pathConfig } from 'config/pathConfig';
import { sanitizeDoi } from 'config/validation';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import Button from '@mui/material/Button';
import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';
import { locale } from 'locale';
import { validation } from 'config';
import { searchPublications } from '../../../../actions';
import { useValidatedForm } from '../../../../hooks';
import { Field } from '../../../SharedComponents/Toolbox/ReactHookForm';

const validate = data => {
    const value = sanitizeDoi(data);
    if (
        !validation.isValidDOIValue(value) &&
        !validation.isValidPubMedValue(value) &&
        (value.trim().length === 0 || !validation.isValidPublicationTitle(value))
    ) {
        return locale.validationErrors.publicationSearch;
    }
    return undefined;
};

export const FindRecords = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const txt = locale.pages.addRecord.step1;
    const {
        control,
        handleSubmit,
        formState: { isSubmitting, hasValidationError },
    } = useValidatedForm();

    const safelyHandleSubmit = handleSubmit(data => {
        try {
            dispatch(searchPublications(sanitizeDoi(data.searchQuery)));
            navigate(pathConfig.records.add.results);
        } catch {
            /* istanbul ignore next */
            window.location.reload();
        }
    });
    const onSkipSearch = () => navigate(pathConfig.records.add.new);

    return (
        <StandardCard title={txt.title} help={txt.help}>
            <form onSubmit={safelyHandleSubmit}>
                <Grid container spacing={2} alignItems={'center'}>
                    <Grid item xs={12}>
                        <Typography gutterBottom id="search-description">
                            {txt.text}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm>
                        <Field
                            control={control}
                            component={TextField}
                            autoComplete={'search'}
                            aria-describedby="search-description"
                            color={'primary'}
                            required
                            name="searchQuery"
                            fullWidth
                            label={txt.fieldLabels.search}
                            autoFocus
                            validate={[validation.required, validate]}
                            textFieldId="search-query"
                        />
                    </Grid>
                    <Grid item xs={12} sm={'auto'}>
                        <Button
                            type="submit"
                            variant={'contained'}
                            children={txt.submit}
                            fullWidth
                            color={'primary'}
                            disabled={isSubmitting || hasValidationError}
                            data-testid="submit-search"
                        />
                    </Grid>
                    {onSkipSearch && (
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                variant={'text'}
                                children={txt.skip}
                                fullWidth
                                onClick={onSkipSearch}
                                data-testid="skip-search"
                            />
                        </Grid>
                    )}
                </Grid>
            </form>
        </StandardCard>
    );
};

export default React.memo(FindRecords);
