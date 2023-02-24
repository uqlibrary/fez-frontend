import React, { Component } from 'react';
import { Field } from 'redux-form/immutable';
import PropTypes from 'prop-types';
import { propTypes } from 'redux-form/immutable';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import Button from '@mui/material/Button';
import { validation } from 'config';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default class PublicationSearchForm extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props
        onSkipSearch: PropTypes.func,
        locale: PropTypes.object,
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <StandardCard title={this.props.locale.title} help={this.props.locale.help}>
                <form onSubmit={this.props.handleSubmit}>
                    <Grid container spacing={2} alignItems={'center'}>
                        <Grid item xs={12}>
                            <Typography gutterBottom id="search-description">
                                {this.props.locale.text}
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
                                label={this.props.locale.fieldLabels.search}
                                autoFocus
                                validate={[validation.required]}
                                textFieldId="search-query"
                            />
                        </Grid>
                        <Grid item xs={12} sm={'auto'}>
                            <Button
                                variant={'contained'}
                                children={this.props.locale.submit}
                                fullWidth
                                color={'primary'}
                                onClick={this.props.handleSubmit}
                                disabled={this.props.invalid}
                            />
                        </Grid>
                        {this.props.onSkipSearch && (
                            <Grid item xs={12} sm={'auto'}>
                                <Button
                                    variant={'text'}
                                    children={this.props.locale.skip}
                                    fullWidth
                                    onClick={this.props.onSkipSearch}
                                />
                            </Grid>
                        )}
                    </Grid>
                </form>
            </StandardCard>
        );
    }
}
