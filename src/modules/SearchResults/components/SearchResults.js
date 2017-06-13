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
                authors: '',
                counts: {
                    thomson: 1,
                    scopus: 2,
                    google: 3,
                    altmetric: 4,
                    downloads: 100
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
                    <br />
                    <div>{this.setExplanationText()}</div>
                    {searchResultEntries}
                </CardText>
            </Card>
        );
    }
}
