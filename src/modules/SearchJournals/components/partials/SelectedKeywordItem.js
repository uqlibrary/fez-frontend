import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';

export const SelectedKeywordItem = ({ onKeywordDelete, keyword }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDeleteKeyword = React.useCallback(() => onKeywordDelete(keyword), []);

    return (
        <Chip
            label={
                <React.Fragment>
                    <Typography variant="body2" color="secondary">
                        {`${keyword.type}: `}
                    </Typography>
                    <Typography variant="body2">{keyword.text}</Typography>
                </React.Fragment>
            }
            onDelete={handleDeleteKeyword}
        />
    );
};

SelectedKeywordItem.propTypes = {
    keyword: PropTypes.shape({
        type: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    }),
    onKeywordDelete: PropTypes.func.isRequired,
};

export default React.memo(SelectedKeywordItem);
