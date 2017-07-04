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
        searchResultsList: PropTypes.object,
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
        this.props.loadUsersPublications(123);
    }

    render() {
        const claimPublicationsInformation = locale.pages.claimPublications;
        const resultsInformation = claimPublicationsInformation.claimPublicationResults;
        const noOfResults = claimPublicationsInformation.maxSearchResults > this.props.searchResultsList.size ? this.props.searchResultsList.size : claimPublicationsInformation.maxSearchResults;

        return (
            <div className="layout-fill">
                <h1 className="page-title display-1">{claimPublicationsInformation.title}</h1>

                {this.props.loadingSearch &&
                    <div className="is-centered">
                        <InlineLoader message="Searching for your publications..." />
                    </div>
                }

                {!this.props.loadingSearch && this.props.searchResultsList.size > 0 &&
                    <div>
                        <SearchResults
                            dataSource={this.props.searchResultsList}
                            title={resultsInformation.title}
                            explanationText={resultsInformation.explanationText}
                            claimRecordBtnLabel={resultsInformation.claimRecordBtnLabel}
                            help={resultsInformation.help}
                        />
                        <div className="columns notMineButtonWrapper">
                            <div className="column">
                                {noOfResults} matches shown of {this.props.searchResultsList.size}
                            </div>
                            <div className="column has-text-right">
                                <RaisedButton label={claimPublicationsInformation.formButtons.notMineLabel} primary onTouchTap={this.props.markPublicationsNotMine} />
                            </div>
                        </div>
                    </div>
                }
            </div>
        );
    }
}

