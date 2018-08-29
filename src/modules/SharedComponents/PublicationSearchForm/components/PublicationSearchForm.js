import React, {Component} from 'react';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {TextField} from 'modules/SharedComponents/Toolbox/TextField';

import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {validation} from 'config';

import Grid from '@material-ui/core/Grid';

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
                <Grid container>
                    <Grid item>
                        {this.props.locale.text}
                    </Grid>
                </Grid>
                <form onSubmit={this.props.handleSubmit}>
                    <Grid container spacing={8} alignItems={'flex-start'}>
                        <Grid item style={{flexGrow: 1}}>
                            <Field
                                component={TextField}
                                required
                                name="searchQuery"
                                fullWidth
                                label={this.props.locale.fieldLabels.search}
                                autoFocus
                                validate={[validation.required]}/>
                        </Grid>
                        <Grid item>
                            <RaisedButton
                                style={{marginTop: 22}}
                                label={this.props.locale.submit}
                                fullWidth
                                secondary
                                onClick={this.props.handleSubmit}
                                disabled={this.props.invalid}
                            />
                        </Grid>
                        {
                            this.props.onSkipSearch &&
                            <Grid item>
                                <FlatButton
                                    style={{marginTop: 22}}
                                    label={this.props.locale.skip}
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
