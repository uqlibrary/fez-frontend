import React from 'react';
import {PropTypes} from 'prop-types';
import {Card, CardText} from 'material-ui/Card';
import {HelpIcon} from 'uqlibrary-react-toolbox';

export default function StaticPage({title, text, help}) {
    return (
        <div className="layout-fill">
            <h1 className="page-title display-1">{title}</h1>
            <Card className="layout-card">
                {help && (
                    <HelpIcon
                        title={help.title}
                        text={help.text}
                        buttonLabel={help.button}
                        inline />
                )}
                <CardText className="body-1">
                    <br />
                    {text}
                </CardText>
            </Card>
        </div>
    );
}

StaticPage.propTypes = {
    title: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    help: PropTypes.object
};
