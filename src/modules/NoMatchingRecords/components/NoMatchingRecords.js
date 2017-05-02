import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import PropTypes from 'prop-types';

import {HelpIcon} from 'uqlibrary-react-toolbox';
import RaisedButton from 'material-ui/RaisedButton';

import FlatButton from 'material-ui/FlatButton';


const propTypes = {
    title: PropTypes.string.isRequired,
    explanationText: PropTypes.string.isRequired,
    helpTitle: PropTypes.string,
    helpText: PropTypes.string,
    searchAgainBtnLabel: PropTypes.string,
    addPublicationBtnLabel: PropTypes.string,
    handlePrevious: PropTypes.func,
    handleNext: PropTypes.func,
    stepIndex: PropTypes.number,
    help: PropTypes.object
};

const defaultProps = {
    searchAgainBtnLabel: 'Search again?',
    addPublicationBtnLabel: 'Add new publication'
};

const NoMatchingRecords = ({handleNext, handlePrevious, stepIndex, title, explanationText, help, searchAgainBtnLabel, addPublicationBtnLabel}) => {
    return (
        <div className="layout-fill">

            <h1 className="page-title display-1">{title ? title : 'This is the page title'}</h1>
            <Card className="layout-card">
                <CardHeader className="card-header">
                    <div className="columns is-gapless">
                        <div className="column">
                            <h2 className="headline">{title ? title : 'This is the card title'}</h2>
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
                    <div>{explanationText}</div>
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
        </div>
    );
};

NoMatchingRecords.propTypes = propTypes;
NoMatchingRecords.defaultProps = defaultProps;

export default NoMatchingRecords;

