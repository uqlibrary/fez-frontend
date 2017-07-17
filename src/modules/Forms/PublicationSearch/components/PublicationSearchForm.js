import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import {HelpIcon, TextField} from 'uqlibrary-react-toolbox';
import RaisedButton from 'material-ui/RaisedButton';
import {isDOIValue, isPubMedValue} from '../validator';
import {locale} from 'config';

const JOURNAL_ARTICLE = 179;

export default class PublicationSearchForm extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        explanationText: PropTypes.string.isRequired,
        pristine: PropTypes.bool,
        handleSubmit: PropTypes.func,
        loadDoiResultsList: PropTypes.func,
        loadPubmedResultsList: PropTypes.func,
        loadTitleResultsList: PropTypes.func,
        formValues: PropTypes.object,
        help: PropTypes.object,
        searchTitleField: PropTypes.string
    };

    constructor(props) {
        super(props);
    }

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
            // Pass fieldValue map through to the form component
            this.props.loadTitleResultsList(JOURNAL_ARTICLE, fieldValue);
        }
    };

    render() {
        const {pristine, handleSubmit, title, help, explanationText} = this.props;
        const searchForPublicationInformation = locale.pages.addRecord.searchForPublication;

        return (
            <form ref="publicationSearchForm" onSubmit={handleSubmit}>
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless is-mobile">
                            <div className="column">
                                <h2 className="title is-4">{title}</h2>
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
                               floatingLabelText={searchForPublicationInformation.defaultSearchFieldLabel}
                               autoComplete="off"
                               autoFocus
                               onKeyPress={this.performSearch}
                        />
                        <div style={{textAlign: 'right', marginTop: '20px'}}>
                            <RaisedButton
                                label={searchForPublicationInformation.defaultButtonLabel}
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
