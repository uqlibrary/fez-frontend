import React from 'react';
import PropTypes from 'prop-types';
import {Card, CardText} from 'material-ui/Card';
import InlineLoader from './InlineLoader';

export default function ContentLoader({message}) {
    return (
        <Card className="layout-card">
            <CardText className="column layout-fill align-center justify-center">
                <InlineLoader message={message} />
            </CardText>
        </Card>
    );
}

ContentLoader.propTypes = {
    message: PropTypes.string
};
