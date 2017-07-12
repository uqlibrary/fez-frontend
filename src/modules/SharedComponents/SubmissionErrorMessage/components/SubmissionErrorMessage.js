import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Card, CardHeader, CardText} from 'material-ui/Card';

import './SubmissionErrorMessage.scss';

export default class SubmissionErrorMessage extends PureComponent {

    static propTypes = {
        submissionState: PropTypes.object,
        submissionErrorMessage: PropTypes.object
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {submissionState, submissionErrorMessage} = this.props;

        return (
            <div>
            {submissionState && submissionState.get('failed') &&
                <Card className="layout-card">
                    <CardHeader className="card-header">
                        <div className="columns is-gapless is-mobile">
                            <div className="column">
                                <h2 className="title is-4">Submission failed</h2>
                            </div>
                        </div>
                    </CardHeader>
                    <CardText className="body-1">
                        <div className="columns">
                            <div className="column">
                                <p>
                                    {submissionErrorMessage && submissionErrorMessage.message &&
                                    <span>{submissionErrorMessage.message}</span>}
                                    {(!submissionErrorMessage || !submissionErrorMessage.message) &&
                                    <span>Unexpected error.</span>}
                                </p>
                                <p> Review your data and try again. </p>
                            </div>
                        </div>
                    </CardText>
                </Card>
            }
            </div>
        );
    }
}

