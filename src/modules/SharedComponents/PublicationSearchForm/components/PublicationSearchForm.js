import React from 'react';
import { Field } from 'redux-form/immutable';
import PropTypes from 'prop-types';
import { propTypes } from 'redux-form/immutable';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import Button from '@mui/material/Button';
import { validation } from 'config';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export const PublicationSearchForm = ({ onSkipSearch, locale, ...props }) => {
    return (
        <StandardCard title={locale.title} help={locale.help}>
            <form onSubmit={props.handleSubmit}>
                <Grid container spacing={2} alignItems={'center'}>
                    <Grid item xs={12}>
                        <Typography gutterBottom id="search-description">
                            {locale.text}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm>
                        <Field
                            component={TextField}
                            autoComplete={'search'}
                            aria-describedby="search-description"
                            color={'primary'}
                            required
                            name="searchQuery"
                            fullWidth
                            label={locale.fieldLabels.search}
                            autoFocus
                            validate={[validation.required]}
                            textFieldId="search-query"
                        />
                    </Grid>
                    <Grid item xs={12} sm={'auto'}>
                        <Button
                            variant={'contained'}
                            children={locale.submit}
                            fullWidth
                            color={'primary'}
                            onClick={props.handleSubmit}
                            disabled={props.invalid}
                        />
                    </Grid>
                    {onSkipSearch && (
                        <Grid item xs={12} sm={'auto'}>
                            <Button variant={'text'} children={locale.skip} fullWidth onClick={onSkipSearch} />
                        </Grid>
                    )}
                </Grid>
            </form>
        </StandardCard>
    );
};
PublicationSearchForm.propTypes = {
    ...propTypes, // all redux-form props
    onSkipSearch: PropTypes.func,
    locale: PropTypes.object,
};
export default PublicationSearchForm;
