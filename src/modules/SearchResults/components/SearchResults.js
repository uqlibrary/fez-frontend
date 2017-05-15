import React, {Component} from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import PropTypes from 'prop-types';

import {HelpIcon} from 'uqlibrary-react-toolbox';
import {ClaimPublicationRow} from '../../Forms';

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
        const searchResultEntries = dataSource.map((entry, i) => {
            return (
                <div key={i}>
                    <ClaimPublicationRow entry={entry} claimRecordBtnLabel={this.props.claimRecordBtnLabel} form="SearchResultsForm" />
                    <Divider />
                </div>
            );
        });

        return (
            <Card className="layout-card">
                <CardHeader className="card-header">
                    <div className="columns is-gapless">
                        <div className="column">
                            <h2 className="headline">{title}</h2>
                        </div>
                        <div className="column">
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
