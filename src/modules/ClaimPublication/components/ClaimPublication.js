import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
import Immutable from 'immutable';

// forms & custom components
import {SearchResults} from 'modules/SearchResults';
import {InlineLoader, StandardCard} from 'uqlibrary-react-toolbox';
import {locale} from 'config';
import {showDialogBox} from 'modules/App';

export default class ClaimPublication extends React.Component {

    static propTypes = {
        account: PropTypes.object,
        claimPublicationResults: PropTypes.object,
        clearSearchResults: PropTypes.func,
        dispatch: PropTypes.func,
        loadingSearch: PropTypes.bool,
        loadUsersPublications: PropTypes.func,
        markPublicationsNotMine: PropTypes.func
    };

    static defaultProps = {
        searchResultsList: null
    };

    constructor(props) {
        super(props);

        this.props.clearSearchResults();
    }

    componentDidMount() {
        const {account, loadUsersPublications} = this.props;
        loadUsersPublications(account.get('id'));
    }

    extractResultSet = () => {
        const {claimPublicationResults} = this.props;
        const claimPublicationsInformation = locale.pages.claimPublications;
        let resultSet = {};

        // limit the number of results
        if (claimPublicationResults.size > 0) {
            resultSet = Immutable.fromJS(claimPublicationResults);

            if (resultSet.length > claimPublicationsInformation.maxSearchResults) {
                resultSet = resultSet.slice(0, claimPublicationsInformation.maxSearchResults);
            }
        }

        return resultSet;
    };

    confirmMarkPublicationsNotMine = () => {
        const dialogConfig = locale.pages.claimPublications.claimPublicationResults.dialog.markNotMine;
        const combinedConfig = Object.assign({}, dialogConfig, {primaryHandleFn: this.markPublicationsNotMine});
        this.props.dispatch(showDialogBox(combinedConfig));
    };

    markPublicationsNotMine = () => {
        const {account, markPublicationsNotMine} = this.props;
        const resultSet = this.extractResultSet();

        // retrieve the publication ids
        const pids = resultSet.map(result => {
            return {pid: result.get('rek_pid')};
        });

        markPublicationsNotMine(account.get('id'), pids.toJS());
    };

    render() {
        const claimPublicationsInformation = locale.pages.claimPublications;
        const resultsInformation = claimPublicationsInformation.claimPublicationResults;
        const noRecordsInformation = resultsInformation.noMatchingPublications;
        const {
            claimPublicationResults,
            loadingSearch
        } = this.props;

        const resultSet = this.extractResultSet();
        const noOfResults = claimPublicationResults.size;

        const resultsCountText = `${resultSet.size} out of ${noOfResults} potential match(es) displayed. Select any item to claim it as your work.`;
        return (
            <div className="layout-fill">
                <h1 className="title is-3">{claimPublicationsInformation.title}</h1>

                {loadingSearch &&
                    <div className="is-centered">
                        <InlineLoader message="Searching for your publications..." />
                    </div>
                }

                {!loadingSearch && noOfResults > 0 &&
                    <div>
                        <SearchResults
                            dataSource={resultSet}
                            title={resultsInformation.title}
                            explanationText={resultsCountText}
                            claimRecordBtnLabel={resultsInformation.claimRecordBtnLabel}
                            help={resultsInformation.help}
                        />
                        <div className="layout-card">
                            <div className="columns">
                                <div className="column is-hidden-mobile" />
                                <div className="column is-narrow-desktop is-12-mobile is-pulled-right">
                                    <RaisedButton
                                        label={claimPublicationsInformation.formButtons.notMineLabel}
                                        secondary
                                        fullWidth
                                        onTouchTap={this.confirmMarkPublicationsNotMine}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                }

                {!loadingSearch && noOfResults === 0 &&
                    <StandardCard {...noRecordsInformation} />
                }
            </div>
        );
    }
}

