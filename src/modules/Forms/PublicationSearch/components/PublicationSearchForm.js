import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';

import {HelpIcon, TextField} from 'uqlibrary-react-toolbox';
import RaisedButton from 'material-ui/RaisedButton';
import {isDOIValue, isPubMedValue} from '../validator';
import {locale} from 'config';

import './PublicationSearchForm.scss';

const JOURNAL_ARTICLE = 179;

export default class PublicationSearchForm extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        explanationText: PropTypes.string.isRequired,
        defaultSearchFieldLabel: PropTypes.string,
        defaultButtonLabel: PropTypes.string,
        pristine: PropTypes.bool,
        handleSubmit: PropTypes.func,
        loadDoiResultsList: PropTypes.func,
        loadPubmedResultsList: PropTypes.func,
        loadTitleResultsList: PropTypes.func,
        formValues: PropTypes.object,
        help: PropTypes.object
    };

    static defaultProps = {
        defaultSearchFieldLabel: locale.pages.addRecord.searchForPublication.defaultProps.defaultSearchFieldLabel,
        defaultButtonLabel: locale.pages.addRecord.searchForPublication.defaultProps.defaultButtonLabel,
    };

    constructor(props) {
        super(props);

        // setup the state
        this.state = {
            buttonLabel: this.props.defaultButtonLabel
        };
    }

    updateButtonLabel = () => {
        const {formValues} = this.props;
        const fieldValue = formValues.get('doiSearch');
        const buttonLabels = locale.pages.addRecord.searchForPublication.buttonLabelVariants;
        let label = buttonLabels.default;
        if (fieldValue) {
            label = buttonLabels.title;

            if (isDOIValue(fieldValue)) {
                label = buttonLabels.doi;
            } else if (isPubMedValue(fieldValue)) {
                label = buttonLabels.pubmed;
            }
        }

        this.setState({buttonLabel: label});
    };

    performSearch = () => {
        const { formValues } = this.props;
        const fieldValue = formValues.get('doiSearch');

        if (isDOIValue(fieldValue)) {
            this.props.loadDoiResultsList(fieldValue);
        } else if (isPubMedValue(fieldValue)) {
            this.props.loadPubmedResultsList(fieldValue);
        } else {
            this.props.loadTitleResultsList(JOURNAL_ARTICLE, fieldValue);
        }
    };

    render() {
        const {pristine, handleSubmit, title, help, explanationText, defaultSearchFieldLabel} = this.props;
        return (
            <form ref="publicationSearchForm" onSubmit={handleSubmit}>
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless">
                            <div className="column">
                                <h2 className="headline">{title}</h2>
                            </div>
                            <div className="column">
                                {help && (
                                    <HelpIcon
                                        title={help.title}
                                        text={help.text}
                                        buttonLabel={help.buttonLabel}
                                    />
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardText className="body-1">
                        <br />
                        <div>{explanationText}</div>
                        <Field component={TextField}
                               name="doiSearch"
                               fullWidth
                               floatingLabelText={defaultSearchFieldLabel}
                               onChange={this.updateButtonLabel}
                               autoComplete="off"
                        />
                        <div style={{textAlign: 'right', marginTop: '20px'}}>
                            <RaisedButton
                                label={this.state.buttonLabel}
                                secondary
                                onTouchTap={this.performSearch}
                                type="submit"
                                disabled={pristine}
                            />
                        </div>
                    </CardText>
                </Card>
            </form>
        );
    }
}
