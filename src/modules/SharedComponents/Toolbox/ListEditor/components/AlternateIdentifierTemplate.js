import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { ALTERNATE_IDENTIFIER_TYPE } from 'config/general';

export const AlternateIdentifierTemplate = ({ item }) => (
    <React.Fragment>
        <Typography variant="body2">
            <strong>{'Identifier: '}</strong>
            {item.key}
        </Typography>
        <Typography variant="caption">
            <strong>{'Identifier Type: '}</strong>
            {ALTERNATE_IDENTIFIER_TYPE.find(type => type.value === item.value)?.text}
        </Typography>
    </React.Fragment>
);

AlternateIdentifierTemplate.propTypes = {
    item: PropTypes.object,
};
