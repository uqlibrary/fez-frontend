/* eslint-disable */

import React from 'react';
import {Card, CardHeader, CardText} from 'material-ui/Card';
import PropTypes from 'prop-types';

import {HelpIcon} from 'uqlibrary-react-toolbox';
import {locale} from 'config';


const propTypes = {
    title: PropTypes.string.isRequired,
    explanationText: PropTypes.string.isRequired,
    searchAgainBtnLabel: PropTypes.string,
    addPublicationBtnLabel: PropTypes.string,
    stepIndex: PropTypes.number,
    help: PropTypes.object
};

const defaultProps = {
    searchAgainBtnLabel: locale.pages.addRecord.noMatchingRecords.defaultProps.searchAgainBtnLabel,
    addPublicationBtnLabel: locale.pages.addRecord.noMatchingRecords.defaultProps.addPublicationBtnLabel
};

const NoMatchingRecords = ({title, explanationText, help, searchAgainBtnLabel, addPublicationBtnLabel}) => {
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
                <div>
                    {explanationText}
                </div>
            </CardText>
        </Card>
    );
};

NoMatchingRecords.propTypes = propTypes;
NoMatchingRecords.defaultProps = defaultProps;

export default NoMatchingRecords;

