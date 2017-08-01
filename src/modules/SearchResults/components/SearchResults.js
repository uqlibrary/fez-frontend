import React, {Component} from 'react';
import PropTypes from 'prop-types';

import {StandardCard} from 'uqlibrary-react-toolbox';
import SearchResultsRow from '../containers/SearchResultsRow';

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

    render() {
        const {dataSource, help, title} = this.props;
        const searchResultEntries = dataSource.map((source, index) => {
            const entry = {
                index,
                id: source.get('rek_pid'),
                title: source.get('rek_title'),
                journalName: source.get('fez_record_search_key_journal_name') ? source.get('fez_record_search_key_journal_name').get('rek_journal_name') : null,
                authors: source.get('fez_record_search_key_author'),
                publisher: source.get('fez_record_search_key_publisher'),
                volumeNumber: source.get('fez_record_search_key_volume_number') ? source.get('fez_record_search_key_volume_number').get('rek_volume_number') : null,
                issueNumber: source.get('fez_record_search_key_issue_number') ? source.get('fez_record_search_key_issue_number').get('rek_issue_number') : null,
                startPage: source.get('fez_record_search_key_start_page') ? source.get('fez_record_search_key_start_page').get('rek_start_page') : null,
                endPage: source.get('fez_record_search_key_end_page') ? source.get('fez_record_search_key_end_page').get('rek_end_page') : null,
                doi: source.get('fez_record_search_key_doi') ? source.get('fez_record_search_key_doi').get('rek_doi') : null,
                counts: {
                    thomson: source.get('rek_thomson_citation_count') ? source.get('rek_thomson_citation_count') : null
                }
            };

            return (
                <SearchResultsRow key={index} entry={entry} claimRecordBtnLabel={this.props.claimRecordBtnLabel} />
            );
        });

        return (
            <StandardCard title={title} help={help}>
                <div>
                    {this.props.explanationText.replace('[noOfResults]', this.props.dataSource.size)}
                </div>

                {searchResultEntries}
            </StandardCard>
        );
    }
}
