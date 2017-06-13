import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import PropTypes from 'prop-types';

import {HelpIcon} from 'uqlibrary-react-toolbox';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import {locale} from 'config';


const propTypes = {
    title: PropTypes.string.isRequired,
    explanationText: PropTypes.string.isRequired,
    searchAgainBtnLabel: PropTypes.string,
    addPublicationBtnLabel: PropTypes.string,
    handlePrevious: PropTypes.func,
    handleNext: PropTypes.func,
    stepIndex: PropTypes.number,
    help: PropTypes.object
};

const defaultProps = {
    searchAgainBtnLabel: locale.pages.addRecord.noMatchingRecords.defaultProps.searchAgainBtnLabel,
    addPublicationBtnLabel: locale.pages.addRecord.noMatchingRecords.defaultProps.addPublicationBtnLabel
};

const NoMatchingRecords = ({handleNext, handlePrevious, stepIndex, title, explanationText, help, searchAgainBtnLabel, addPublicationBtnLabel}) => {
    return (
        <Card className="layout-card">
            <CardHeader className="card-header">
                <div className="columns is-gapless is-mobile">
                    <div className="column">
                        <h2 className="title">{title}</h2>
                    </div>
                    <div className="column is-narrow is-helpicon">
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
    );
};

NoMatchingRecords.propTypes = propTypes;
NoMatchingRecords.defaultProps = defaultProps;

export default NoMatchingRecords;

