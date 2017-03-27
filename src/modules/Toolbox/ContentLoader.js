import React from 'react';
import {Card, CardText} from 'material-ui/Card';
import InlineLoader from './InlineLoader';

const propTypes = {
    message: React.PropTypes.string
};

export default function ContentLoader({message}) {
    return (
        <Card className="layout-card">
            <CardText className="column layout-fill align-center justify-center">
                <InlineLoader message={message} />
            </CardText>
        </Card>
    );
}

ContentLoader.propTypes = propTypes;
