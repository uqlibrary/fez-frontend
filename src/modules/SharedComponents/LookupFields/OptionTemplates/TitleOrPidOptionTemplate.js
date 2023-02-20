import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { PublicationCitation } from 'modules/SharedComponents/PublicationCitation';

export const TitleOrPidOptionTemplate = ({ option: item }) => {
    return (
        <Fragment>
            <PublicationCitation publication={item} hideCitationCounts hideLinks citationStyle={'list'} />
            <Typography variant="body2" color="textSecondary">
                {item.rek_pid}
            </Typography>
        </Fragment>
    );
};

TitleOrPidOptionTemplate.propTypes = {
    option: PropTypes.object,
};

export default React.memo(TitleOrPidOptionTemplate);
