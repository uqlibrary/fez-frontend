import React, {Component} from 'react';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {TextField, StandardCard} from 'uqlibrary-react-toolbox';
import RaisedButton from 'material-ui/RaisedButton';

export default class PublicationSearchForm extends Component {

    static propTypes = {
        ...propTypes, // all redux-form props
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
                    <div className="columns is-gapless is-mobile">
                        <div className="column">
                            <Field component={TextField}
                                   name="searchQuery"
                                   fullWidth
                                   floatingLabelText={this.props.locale.fieldLabels.search}
                                   autoComplete="off"
                                   autoFocus
                            />
                        </div>
                        <div className="column is-narrow is-helpicon">
                            <RaisedButton
                                label={this.props.locale.submit}
                                secondary
                                onTouchTap={this.props.handleSubmit}
                                disabled={this.props.invalid}
                            />
                        </div>
                    </div>
                </form>
            </StandardCard>
        );
    }
}
