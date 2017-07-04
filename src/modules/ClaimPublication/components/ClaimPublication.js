import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Immutable from 'immutable';

// forms & custom components
import {SearchResults} from 'modules/SearchResults';
import {NoMatchingRecords} from 'modules/NoMatchingRecords';
import {InlineLoader} from 'uqlibrary-react-toolbox';
import {locale} from 'config';
import './ClaimPublication.scss';

export default class ClaimPublication extends React.Component {

    static propTypes = {
        account: PropTypes.object,
        claimPublicationResults: PropTypes.object,
        loadingSearch: PropTypes.bool,
        loadUsersPublications: PropTypes.func,
        markPublicationsNotMine: PropTypes.func
    };

    static defaultProps = {
        searchResultsList: null
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const {account, loadUsersPublications} = this.props;
        loadUsersPublications(account.get('id'));
    }

    markPublicationsNotMine = () => {
        const {account, markPublicationsNotMine} = this.props;
        markPublicationsNotMine(account.get('id'));
    };

    render() {
        const claimPublicationsInformation = locale.pages.claimPublications;
        const resultsInformation = claimPublicationsInformation.claimPublicationResults;
        const noRecordsInformation = resultsInformation.noMatchingPublications;
        const noMatchingRecordsInformation = locale.pages.addRecord.noMatchingRecords;
        const {
            account,
            claimPublicationResults,
            loadingSearch
        } = this.props;

        // limit the number of results
        let resultSet = {};
        if (claimPublicationResults.size > 0) {
            resultSet = Immutable.fromJS(claimPublicationResults.toJS().rows.slice(0, claimPublicationsInformation.maxSearchResults));
        }
        const noOfResults = claimPublicationsInformation.maxSearchResults > claimPublicationResults.size ? claimPublicationResults.size : claimPublicationsInformation.maxSearchResults;

        return (
            <div className="layout-fill">
                <h1 className="page-title display-1">{claimPublicationsInformation.title}</h1>

                {loadingSearch &&
                    <div className="is-centered">
                        <InlineLoader message="Searching for your publications..." />
                    </div>
                }

                {!loadingSearch && claimPublicationResults.size > 0 &&
                    <div>
                        <SearchResults
                            dataSource={resultSet}
                            title={resultsInformation.title}
                            explanationText={resultsInformation.explanationText}
                            claimRecordBtnLabel={resultsInformation.claimRecordBtnLabel}
                            help={resultsInformation.help}
                        />
                        <div className="columns notMineButtonWrapper">
                            <div className="column">
                                {noOfResults} matches shown of {claimPublicationResults.size}
                            </div>
                            <div className="column has-text-right">
                                <RaisedButton label={claimPublicationsInformation.formButtons.notMineLabel} primary onTouchTap={this.markPublicationsNotMine} />
                            </div>
                        </div>
                    </div>
                }

                {!loadingSearch && claimPublicationResults.size === 0 &&
                    <NoMatchingRecords
                        title={noRecordsInformation.title}
                        explanationText={noRecordsInformation.explanationText.replace('[username]', account.get('id'))}
                        help={noMatchingRecordsInformation.help}
                    />
                }
            </div>
        );
    }
}

