import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import PropTypes from 'prop-types';

import {HelpIcon} from 'uqlibrary-react-toolbox';
import SearchResultsRow from './SearchResultsRow';

export default class SearchResults extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        explanationText: PropTypes.string.isRequired,
        claimRecordBtnLabel: PropTypes.string,
        dataSource: PropTypes.object,
        help: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    setExplanationText = () => {
        return this.props.explanationText.replace('[noOfResults]', this.props.dataSource.size);
    };

    render() {
        const {dataSource, help, title} = this.props;
        const searchResultEntries = dataSource.map((source, i) => {
            const entry = {
                title: source.get('rek_title'),
                journalName: source.get('fez_record_search_key_journal_name').get('rek_journal_name'),
                authors: source.get('fez_record_search_key_author'),
                publisher: source.get('fez_record_search_key_publisher'),
                volumeNumber: source.get('fez_record_search_key_volume_number').get('rek_volume_number'),
                issueNumber: source.get('fez_record_search_key_issue_number').get('rek_issue_number'),
                startPage: source.get('fez_record_search_key_start_page').get('rek_start_page'),
                endPage: source.get('fez_record_search_key_end_page').get('rek_end_page'),
                doi: source.get('fez_record_search_key_doi').get('rek_doi'),
                counts: {
                    thomson: source.get('rek_thomson_citation_count'),
                    scopus: 22,
                    google: 33,
                    altmetric: 44,
                    downloads: 55
                }
            };
            return (
                <SearchResultsRow key={i} entry={entry} claimRecordBtnLabel={this.props.claimRecordBtnLabel} />
            );
        });

        return (
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
                    <div>{this.setExplanationText()}</div>
                    {searchResultEntries}
                </CardText>
            </Card>
        );
    }
}
