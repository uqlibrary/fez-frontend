import React, {Component} from 'react';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {TextField, StandardCard} from 'uqlibrary-react-toolbox';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {validation} from 'config';

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
                <div>{this.props.locale.text}</div>
                <form onSubmit={this.props.handleSubmit}>
                    <div className="columns">
                        <div className="column">
                            <Field
                                component={TextField}
                                className="requiredField"
                                name="searchQuery"
                                fullWidth
                                floatingLabelText={this.props.locale.fieldLabels.search}
                                autoComplete="off"
                                autoFocus
                                validate={[validation.required]}/>
                        </div>
                        <div className="column is-narrow">
                            <RaisedButton
                                className="is-mui-spacing-button"
                                label={this.props.locale.submit}
                                fullWidth
                                secondary
                                onTouchTap={this.props.handleSubmit}
                                disabled={this.props.invalid}
                            />
                        </div>
                        {
                            this.props.onSkipSearch &&
                            <div className="column is-narrow">
                                <FlatButton
                                    className="is-mui-spacing-button"
                                    label={this.props.locale.skip}
                                    fullWidth
                                    onTouchTap={this.props.onSkipSearch}
                                />
                            </div>
                        }
                    </div>
                </form>
            </StandardCard>
        );
    }
}
