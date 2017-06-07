import React from 'react';
import {PropTypes} from 'prop-types';
import {Card, CardText, CardHeader} from 'material-ui/Card';
import {HelpIcon} from 'uqlibrary-react-toolbox';

export default function Browse({title, text, help}) {
    return (
        <div className="layout-fill">

            <h1 className="page-title display-1">{title ? title : 'Browse'}</h1>

            <Card className="layout-card">
                <CardHeader className="card-header">
                    <div className="columns is-gapless">
                        <div className="column">
                            <h2 className="headline">{title ? title : 'Browse'}</h2>
                        </div>
                        <div className="column is-narrow is-helpicon">
                            {help && (
                                <HelpIcon
                                    title={help.title}
                                    text={help.text}
                                    buttonLabel={help.button}
                                    />
                            )}
                        </div>
                    </div>
                </CardHeader>

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
