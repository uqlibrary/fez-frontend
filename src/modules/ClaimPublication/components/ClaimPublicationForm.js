import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import {Field, FormSection} from 'redux-form/immutable';
import PropTypes from 'prop-types';
import FlatButton from 'material-ui/FlatButton';

import {HelpIcon, TextField} from 'uqlibrary-react-toolbox';
import RaisedButton from 'material-ui/RaisedButton';
import {locale} from 'config';
import {FileUploader} from 'modules/SharedComponents';

import {SearchResultsRow} from 'modules/SearchResults';

export default class ClaimPublicationForm extends Component {

    static propTypes = {
        history: PropTypes.object,
        location: PropTypes.object,
        showSnackbar: PropTypes.func,
        claimPublicationResults: PropTypes.object
    };

    constructor(props) {
        super(props);

        this.state = {
            selectedPublication: {}
        };
    }

    cancelClaimPublication = () => {
        this.props.showSnackbar(locale.notifications.claimPublicationForm.cancelMessage);
        this.props.history.goBack();
    };

    claimPublication = () => {
        this.props.showSnackbar(locale.notifications.claimPublicationForm.claimMessage);
        this.props.history.goBack();
    };

    getCurrentArticle = () => {
        const articleId = Number(this.props.location.pathname.replace(`${locale.pages.claimPublications.claimUrl}/`, ''));
        const article = this.props.claimPublicationResults.get('rows').filter(article => article.get('rek_pid') === articleId);

        // found the article so load it
        return article.size === 1 ? article.get(0) : null;
    };

    render() {
        // path to the locale data for each of the sections
        const claimPublicationsInformation = locale.pages.claimPublications.form;
        const publicationDetailsInformation = claimPublicationsInformation.publicationDetails;
        const commentsInformation = claimPublicationsInformation.comments;
        const fileInformation = locale.sharedComponents.files;
        const actionButtonsInformation = claimPublicationsInformation.formButtons;

        // TODO: Put this data structure into a central location
        const source = this.getCurrentArticle();
        const INDEX = 0;
        const entry = {
            INDEX,
            id: source.get('rek_pid'),
            title: source.get('rek_title'),
            journalName: source.get('fez_record_search_key_journal_name') ? source.get('fez_record_search_key_journal_name').get('rek_journal_name') : null,
            authors: source.get('fez_record_search_key_author') ? source.get('fez_record_search_key_author') : null,
            publisher: source.get('fez_record_search_key_publisher') ? source.get('fez_record_search_key_publisher') : null,
            volumeNumber: source.get('fez_record_search_key_volume_number') ? source.get('fez_record_search_key_volume_number').get('rek_volume_number') : null,
            issueNumber: source.get('fez_record_search_key_issue_number') ? source.get('fez_record_search_key_issue_number').get('rek_issue_number') : null,
            startPage: source.get('fez_record_search_key_start_page') ? source.get('fez_record_search_key_start_page').get('rek_start_page') : null,
            endPage: source.get('fez_record_search_key_end_page') ? source.get('fez_record_search_key_end_page').get('rek_end_page') : null,
            doi: source.get('fez_record_search_key_doi') ? source.get('fez_record_search_key_doi').get('rek_doi') : null,
            counts: {
                thomson: source.get('rek_thomson_citation_count')
            }
        };

        return (
            <div style={{marginBottom: '-60px'}}>
                <h1 className="page-title display-1">{claimPublicationsInformation.title}</h1>
                {/* Claim Publication */}
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless">
                            <div className="column">
                                <h2 className="headline" style={{marginBottom: '30px'}}>{publicationDetailsInformation.title}</h2>
                            </div>
                            <div className="column is-narrow">
                                {publicationDetailsInformation.help && (
                                    <HelpIcon
                                        title={publicationDetailsInformation.help.title}
                                        text={publicationDetailsInformation.help.text}
                                        buttonLabel={publicationDetailsInformation.help.buttonLabel}
                                    />
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardText className="body-1" style={{padding: '0px'}}>
                        <SearchResultsRow entry={entry} form="ClaimPublicationForm" hideClaimButton />
                    </CardText>
                </Card>

                {/* Comments */}
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns">
                            <div className="column">
                                <h2 className="headline">{commentsInformation.title}</h2>
                            </div>
                        </div>
                        <div className="columns">
                            <div className="column">
                                <Field component={TextField} name="comments" type="text" fullWidth multiLine
                                       rows={3} floatingLabelText={commentsInformation.fields.descriptionLabel}/>
                            </div>
                        </div>
                    </CardHeader>
                </Card>

                {/* Files */}
                <FormSection name={fileInformation.formSectionPrefix}>
                    <FileUploader />
                </FormSection>

                {/* Buttons */}
                <Card className="layout-card" id="formButtons">
                    <CardText className="body-1">
                        <div className="columns">
                            <div className="column is-narrow is-offset-two-thirds">
                                <FlatButton label={locale.global.labels.buttons.cancel} secondary onTouchTap={this.cancelClaimPublication}/>
                            </div>
                            <div className="column is-narrow">
                                <RaisedButton label={actionButtonsInformation.claimLabel} secondary onTouchTap={this.claimPublication} />
                            </div>
                        </div>
                    </CardText>
                </Card>
            </div>
        );
    }
}
