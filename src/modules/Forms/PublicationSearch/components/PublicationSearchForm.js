import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import {HelpIcon, TextField} from 'uqlibrary-react-toolbox';
import RaisedButton from 'material-ui/RaisedButton';
import {isDOIValue, isPartialDOIValue, isPubMedValue} from '../validator';
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
        defaultSearchFieldLabel: locale.pages.addRecord.searchForPublication.defaultSearchFieldLabel,
        defaultButtonLabel: locale.pages.addRecord.searchForPublication.defaultButtonLabel
    };

    constructor(props) {
        super(props);

        // setup the state
        this.state = {
            buttonLabel: this.props.defaultButtonLabel
        };
    }

    doiSearchChanged = (event, value) => {
        this.updateButtonLabel(value);
    }

    updateButtonLabel = (value) => {
        const buttonLabels = locale.pages.addRecord.searchForPublication.buttonLabelVariants;
        let label = locale.pages.addRecord.searchForPublication.defaultButtonLabel;

        if (value) {
            if (isPartialDOIValue(value) || isDOIValue(value)) {
                label = buttonLabels.doi;
            } else if (isPubMedValue(value)) {
                label = buttonLabels.pubmed;
            } else if (/^\D.*/i.test(value) || value.trim().length > 5) {
                label = buttonLabels.title;
            }
        }

        this.setState({buttonLabel: label});
    };

    performSearch = (event) => {
        // TODO: fix form submit, all data fetching should be done outside of the form
        // workaround: if user clicks Enter on search field OR search button, search is initiated and form is submitted
        if (event && event.key && event.key !== 'Enter') {
            return;
        }

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
                        <div className="columns is-gapless is-mobile">
                            <div className="column">
                                <h2 className="title">{title}</h2>
                            </div>
                            <div className="column is-narrow is-helpicon">
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
                        <div>{explanationText}</div>
                        <Field component={TextField}
                               name="doiSearch"
                               fullWidth
                               floatingLabelText={defaultSearchFieldLabel}
                               onChange={this.doiSearchChanged}
                               autoComplete="off"
                               autoFocus
                               onKeyPress={this.performSearch}
                        />
                        <div style={{textAlign: 'right', marginTop: '20px'}}>
                            <RaisedButton
                                label={this.state.buttonLabel}
                                secondary
                                onTouchTap={this.performSearch}
                                disabled={pristine}
                                type="submit"
                            />
                        </div>
                    </CardText>
                </Card>
            </form>
        );
    }
}
