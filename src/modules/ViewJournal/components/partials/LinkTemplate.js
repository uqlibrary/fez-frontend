import React from 'react';
import PropTypes from 'prop-types';

import Typography from '@material-ui/core/Typography';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

export const LinkTemplate = ({ data, templateProps, fieldId }) => {
    const { href, title, text } = templateProps;
    return (
        <Typography variant="body2">
            <ExternalLink href={href(data)} title={title} id={`${fieldId}-value`} data-testid={`${fieldId}-value`}>
                {text(data)}
            </ExternalLink>
        </Typography>
    );
};

LinkTemplate.propTypes = {
    data: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    templateProps: PropTypes.object,
    fieldId: PropTypes.string,
};

export default React.memo(LinkTemplate);
