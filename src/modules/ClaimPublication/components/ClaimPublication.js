import React from 'react';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';

// forms & custom components
import {SearchResults} from 'modules/SearchResults';
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
        const {account} = this.props;
        this.props.loadUsersPublications(account.id);
    }

    render() {
        const claimPublicationsInformation = locale.pages.claimPublications;
        const resultsInformation = claimPublicationsInformation.claimPublicationResults;
        const {
            claimPublicationResults,
            markPublicationsNotMine
        } = this.props;

        const noOfResults = claimPublicationsInformation.maxSearchResults > claimPublicationResults.size ? claimPublicationResults.size : claimPublicationsInformation.maxSearchResults;

        return (
            <div className="layout-fill">
                <h1 className="page-title display-1">{claimPublicationsInformation.title}</h1>

                {this.props.loadingSearch &&
                    <div className="is-centered">
                        <InlineLoader message="Searching for your publications..." />
                    </div>
                }

                {!this.props.loadingSearch && claimPublicationResults.size > 0 &&
                    <div>
                        <SearchResults
                            dataSource={claimPublicationResults}
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
                                <RaisedButton label={claimPublicationsInformation.formButtons.notMineLabel} primary onTouchTap={markPublicationsNotMine} />
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

