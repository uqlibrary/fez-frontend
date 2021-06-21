import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';

export const MultiValueTemplate = ({ data, templateProps }) => {
    return data.map((item, index) => (
        <Typography variant="body2" key={index}>
            {templateProps.getData(item)}
        </Typography>
    ));
};

MultiValueTemplate.propTypes = {
    data: PropTypes.array,
    templateProps: PropTypes.object,
};

export default MultiValueTemplate;
