import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import { sanitiseId } from 'helpers/general';
import { handleKeyboardPressActivate } from 'helpers/general';

export const SelectedKeywordItem = ({ onKeywordDelete, keyword }) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDeleteKeyword = React.useCallback(() => {
        onKeywordDelete(keyword);
    }, [onKeywordDelete, keyword]);

    const idValue = sanitiseId(`journal-search-chip-${keyword.type}-${keyword.text}`);
    return (
        <Chip
            sx={theme => ({
                margin: 1,
                [theme.breakpoints.down('sm')]: {
                    maxWidth: '100%',
                    margin: '8px 0',
                },
            })}
            id={idValue}
            data-testid={idValue}
            data-analyticsid={idValue}
            label={
                <React.Fragment>
                    <Typography variant="body2" component="span" color="secondary">
                        {`${keyword.type}: `}
                    </Typography>
                    <Typography variant="body2" component="span" fontWeight={400}>
                        {keyword.text}
                    </Typography>
                </React.Fragment>
            }
            tabIndex={0}
            aria-label={`${keyword.type.toLowerCase()} '${
                keyword.text
            }' filter, to remove press the backspace or delete keyboard`}
            onKeyPress={key => handleKeyboardPressActivate(key, handleDeleteKeyword)}
            onDelete={handleDeleteKeyword}
        />
    );
};

SelectedKeywordItem.propTypes = {
    keyword: PropTypes.shape({
        type: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired,
    }).isRequired,
    onKeywordDelete: PropTypes.func.isRequired,
};

export default React.memo(SelectedKeywordItem);
