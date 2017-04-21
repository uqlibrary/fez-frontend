import React from 'react';
import {PropTypes} from 'prop-types';
import {Card, CardText} from 'material-ui/Card';
import {HelpIcon} from 'uqlibrary-react-toolbox';

export default function Browse({title, text, help}) {
    return (
        <div className="layout-fill">
            <h1 className="page-title display-1">{title ? title : 'Browse'}
                {help && (
                    <HelpIcon
                        title={help.title}
                        text={help.text}
                        buttonLabel={help.button}
                        inline />
                )}
            </h1>

            <Card className="layout-card">
                <CardText className="body-1">
                    <br />
                    <div>
                        {text ? text : 'Browse this repository'}
                    </div>
                </CardText>
            </Card>
        </div>
    );
}

Browse.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
    help: PropTypes.object
};
