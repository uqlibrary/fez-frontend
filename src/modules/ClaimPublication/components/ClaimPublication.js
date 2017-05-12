import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardText, CardHeader, CardActions} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import RaisedButton from 'material-ui/RaisedButton';

// forms & custom components
import {HelpIcon} from 'uqlibrary-react-toolbox';
import {ClaimPublicationRow} from '../../Forms';
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

        const searchResultEntries = this.props.searchResultsList.valueSeq().slice(0, claimPublicationsInformation.maxSearchResults).map((entry, i) => {
            return (
                <div key={i}>
                    <ClaimPublicationRow entry={entry} claimRecordBtnLabel={claimPublicationsInformation.formButtons.claimLabel} form="ClaimPublicationResultsForm" />
                    <Divider />
                </div>
            );
        });

        const noOfResults = claimPublicationsInformation.maxSearchResults > this.props.searchResultsList.size ? this.props.searchResultsList.size : claimPublicationsInformation.maxSearchResults;

        return (
            <div className="layout-fill">
                <h1 className="page-title display-1">{claimPublicationsInformation.title}</h1>
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless">
                            <div className="column">
                                <h2 className="headline">{resultsInformation.title}</h2>
                            </div>
                            <div className="column">
                                {resultsInformation.help && (
                                    <HelpIcon
                                        title={resultsInformation.help.title}
                                        text={resultsInformation.help.text}
                                        buttonLabel={resultsInformation.help.button}
                                    />
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardText className="body-1">
                        <br />
                        <div>
                            {resultsInformation.explanationText}
                        </div>
                        {searchResultEntries}
                    </CardText>
                    <CardActions>
                        <div className="columns notMineButtonWrapper">
                            <div className="column">
                                {noOfResults} matches shown of {this.props.searchResultsList.size}
                            </div>
                            <div className="column has-text-right">
                                <RaisedButton label={claimPublicationsInformation.formButtons.notMineLabel} primary onTouchTap={this.props.markPublicationsNotMine} />
                            </div>
                        </div>
                    </CardActions>
                </Card>
            </div>
        );
    }
}

