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
        loadUsersPublications: PropTypes.func
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

        const searchResultEntries = this.props.searchResultsList.valueSeq().map((entry, i) => {
            return (
                <div key={i}>
                    <ClaimPublicationRow entry={entry} claimRecordBtnLabel={claimPublicationsInformation.formButtons.claimLabel} form="ClaimPublicationResultsForm" />
                    <Divider />
                </div>
            );
        });

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
                    <CardActions className="cardActions">
                        <div className="notMineButtonWrapper">
                            <RaisedButton label={claimPublicationsInformation.formButtons.notMineLabel} primary />
                        </div>
                    </CardActions>
                </Card>
            </div>
        );
    }
}

