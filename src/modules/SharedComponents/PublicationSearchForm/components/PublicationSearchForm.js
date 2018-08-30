import React, {Component} from 'react';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import Button from '@material-ui/core/Button';
import {validation} from 'config';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

export default class PublicationSearchForm extends Component {
    static propTypes = {
        ...propTypes, // all redux-form props
        onSkipSearch: PropTypes.func,
        locale: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <StandardCard title={this.props.locale.title} help={this.props.locale.help}>
                <Grid container spacing={16}>
                    <Grid item>
                        <Typography>{this.props.locale.text}</Typography>
                    </Grid>
                </Grid>
                <form onSubmit={this.props.handleSubmit}>
                    <Grid container spacing={16} alignContent={'flex-end'} alignItems={'flex-end'}>
                        <Grid item style={{flexGrow: 1}}>
                            <Field
                                component={TextField}
                                color={'primary'}
                                required
                                name="searchQuery"
                                fullWidth
                                label={this.props.locale.fieldLabels.search}
                                autoFocus
                                validate={[validation.required]}/>
                        </Grid>
                        <Grid item>
                            <Button
                                variant={'raised'}
                                children={this.props.locale.submit}
                                fullWidth
                                color={'secondary'}
                                onClick={this.props.handleSubmit}
                                disabled={this.props.invalid}
                            />
                        </Grid>
                        {
                            this.props.onSkipSearch &&
                            <Grid item>
                                <Button
                                    variant={'flat'}
                                    children={this.props.locale.skip}
                                    fullWidth
                                    onClick={this.props.onSkipSearch}
                                />
                            </Grid>
                        }
                    </Grid>
                </form>
            </StandardCard>
        );
    }
}
