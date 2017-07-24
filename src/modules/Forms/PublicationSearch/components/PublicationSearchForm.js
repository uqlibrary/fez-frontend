import React, {Component} from 'react';
import {Field} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import {TextField, StandardCard} from 'uqlibrary-react-toolbox';
import RaisedButton from 'material-ui/RaisedButton';
import {isDOIValue, isPubMedValue} from '../validator';
import {locale} from 'config';

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

        const {formValues} = this.props;
        const fieldValue = formValues.get('doiSearch');

        if (isDOIValue(fieldValue)) {
            this.props.loadDoiResultsList(fieldValue);
        } else if (isPubMedValue(fieldValue)) {
            this.props.loadPubmedResultsList(fieldValue);
        } else {
            // Pass fieldValue map through to the form component
            // this.props.loadTitleResultsList(JOURNAL_ARTICLE, fieldValue);
        }
    };

    render() {
        const {pristine, handleSubmit, title, help, explanationText} = this.props;
        const searchForPublicationInformation = locale.pages.addRecord.searchForPublication;

        return (
            <form ref="publicationSearchForm" onSubmit={handleSubmit}>
                <StandardCard title={title} help={help}>
                    <div>{explanationText}</div>
                    <div className="columns">
                        <div className="column">
                            <Field component={TextField}
                                   name="doiSearch"
                                   fullWidth
                                   floatingLabelText={searchForPublicationInformation.defaultSearchFieldLabel}
                                   autoComplete="off"
                                   autoFocus
                                   onKeyPress={this.performSearch}
                            />
                        </div>
                        <div className="column is-narrow">
                            <RaisedButton
                              className="is-mui-spacing-button"
                              label={searchForPublicationInformation.defaultButtonLabel}
                                secondary
                                onTouchTap={this.performSearch}
                                disabled={pristine}
                                type="submit"
                            />
                        </div>
                    </div>
                </StandardCard>
            </form>
        );
    }
}
