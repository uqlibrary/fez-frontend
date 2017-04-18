import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';

import {HelpIcon} from 'uqlibrary-react-toolbox';
import RaisedButton from 'material-ui/RaisedButton';

import FlatButton from 'material-ui/FlatButton';


const propTypes = {
    title: React.PropTypes.string.isRequired,
    explanationText: React.PropTypes.string.isRequired,
    helpTitle: React.PropTypes.string,
    helpText: React.PropTypes.string,
    searchAgainBtnLabel: React.PropTypes.string,
    addPublicationBtnLabel: React.PropTypes.string,
    handlePrevious: React.PropTypes.func,
    handleNext: React.PropTypes.func,
    stepIndex: React.PropTypes.number
};

const NoMatchingRecords = ({handleNext, handlePrevious, stepIndex, title, explanationText, helpTitle, helpText, searchAgainBtnLabel, addPublicationBtnLabel}) => {
    return (
        <Card className="layout-card">
            <CardHeader>
                <div className="row">
                    <div className="flex-100">
                        <h2 className="headline">{title}</h2>
                    </div>
                    {helpTitle && helpText && (
                        <div className="flex">
                            <HelpIcon
                                text={helpTitle}
                                title={helpText} inline />
                        </div>
                    )}
                </div>
            </CardHeader>

            <CardText className="body-1">
                <p>{explanationText}</p>
                <div style={{textAlign: 'right'}}>
                    <FlatButton
                        label={searchAgainBtnLabel}
                        disabled={stepIndex === 0}
                        onTouchTap={handlePrevious}
                        style={{marginRight: 12}}
                    />
                    <RaisedButton
                        label={addPublicationBtnLabel}
                        secondary
                        onTouchTap={handleNext}
                    />
                </div>
            </CardText>
        </Card>
    );
};

NoMatchingRecords.propTypes = propTypes;

export default NoMatchingRecords;

