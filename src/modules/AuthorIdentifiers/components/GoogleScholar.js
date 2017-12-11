import React from 'react';
import PropTypes from 'prop-types';
import {propTypes} from 'redux-form/immutable';
import {Field} from 'redux-form/immutable';
import RaisedButton from 'material-ui/RaisedButton';
import {TextField} from 'uqlibrary-react-toolbox/build/TextField';
import {StandardCard} from 'uqlibrary-react-toolbox/build/StandardCard';
import {StandardPage} from 'uqlibrary-react-toolbox/build/StandardPage';
import {Alert} from 'uqlibrary-react-toolbox/build/Alert';
import InlineLoader from 'uqlibrary-react-toolbox/build/Loaders/components/InlineLoader';

import {locale} from 'locale';
import {routes, validation} from 'config';

export default class GoogleScholar extends React.PureComponent {
    static propTypes = {
        ...propTypes,
        author: PropTypes.object,
        accountAuthorLoading: PropTypes.bool,
        history: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        if (!this.props.accountAuthorLoading && !this.props.author) {
            this.props.actions.loadCurrentAccount();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.submitSucceeded !== this.props.submitSucceeded) {
            this._navigateToDashboard();
        }
    }

    _handleKeyboardFormSubmit = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.props.handleSubmit();
        }
    };

    _navigateToDashboard = () => {
        this.props.history.push(routes.pathConfig.dashboard);
    };

    getAlert = ({submitFailed = false, submitting = false, error, submitSucceeded = false, alertLocale = {}}) => {
        let alertProps = null;
        if (submitFailed && error) {
            alertProps = {
                ...alertLocale.errorAlert,
                message: alertLocale.errorAlert.message
                    ? alertLocale.errorAlert.message(error)
                    : error
            };
        } else if (submitting) {
            alertProps = {...alertLocale.progressAlert};
        } else if (submitSucceeded) {
            alertProps = {...alertLocale.successAlert};
        }
        return alertProps ? (<Alert {...alertProps} />) : null;
    };

    render() {
        const txt = locale.pages.googleScholarLink;
        if(this.props.accountAuthorLoading && !this.props.author) {
            return (
                <div className="is-centered">
                    <InlineLoader message={txt.loadingMessage}/>
                </div>
            );
        }
        if (!this.props.accountAuthorLoading && !this.props.author) {
            return (<div />);
        }
        const cardLocale = !this.props.author.aut_google_scholar_id
            ? txt.add
            : txt.edit;

        return (
            <StandardPage title={txt.title}>
                <form onKeyDown={this._handleKeyboardFormSubmit}>
                    <StandardCard title={cardLocale.title} help={txt.help}>
                        {cardLocale.description}
                        <div className="columns">
                            <div className="column">
                                <Field
                                    component={TextField}
                                    disabled={this.props.submitting}
                                    name="aut_google_scholar_id"
                                    fullWidth
                                    {...txt.labels.googleScholarIdField}
                                    validate={[validation.required, validation.isValidGoogleScholarId]}
                                    className="requiredField" />
                            </div>
                        </div>
                    </StandardCard>

                    {
                        this.getAlert({...this.props, alertLocale: txt})
                    }

                    <div className="columns action-buttons">
                        <div className="column is-hidden-mobile"/>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                fullWidth
                                disabled={this.props.submitting}
                                label={txt.labels.cancel}
                                onTouchTap={this._navigateToDashboard} />
                        </div>
                        <div className="column is-narrow-desktop">
                            <RaisedButton
                                secondary
                                fullWidth
                                disabled={this.props.submitting || this.props.invalid}
                                label={txt.labels.submit}
                                onTouchTap={this.props.handleSubmit} />
                        </div>
                    </div>
                </form>
            </StandardPage>
        );
    }
}
