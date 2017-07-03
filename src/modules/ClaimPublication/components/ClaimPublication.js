import React from 'react';
import PropTypes from 'prop-types';

// forms & custom components
import {SearchResults} from 'modules/SearchResults';
import {locale} from '../../../config';
import './ClaimPublication.scss';

export default class ClaimPublication extends React.Component {

    static propTypes = {
        searchResultsList: PropTypes.object,
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

        // const searchResultEntries = this.props.searchResultsList.valueSeq().slice(0, claimPublicationsInformation.maxSearchResults).map((entry, i) => {
        //     return (
        //         <div key={i}>
        //             <ClaimPublicationRow entry={entry} claimRecordBtnLabel={claimPublicationsInformation.formButtons.claimLabel} form="ClaimPublicationResultsForm" />
        //             <Divider />
        //         </div>
        //     );
        // });
        //
        // const noOfResults = claimPublicationsInformation.maxSearchResults > this.props.searchResultsList.size ? this.props.searchResultsList.size : claimPublicationsInformation.maxSearchResults;

        return (
            <div className="layout-fill">
                <h1 className="page-title display-1">{claimPublicationsInformation.title}</h1>
                <SearchResults
                    dataSource={this.props.searchResultsList}
                    title={resultsInformation.title}
                    explanationText={resultsInformation.explanationText}
                    claimRecordBtnLabel={resultsInformation.claimRecordBtnLabel}
                    help={resultsInformation.help}
                />
            </div>
        );
    }
}

