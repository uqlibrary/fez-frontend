import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import { sanitiseId } from 'helpers/general';
import { handleKeyboardPressActivate } from 'helpers/general';
import { SelectedSearchTermTypedItem } from './SelectedSearchTermTypedItem';

export const SelectedKeywordItem = ({ onKeywordDelete, keyword }) => {
    const handleDeleteKeyword = React.useCallback(() => {
        onKeywordDelete(keyword);
    }, [onKeywordDelete, keyword]);

    const idValue = sanitiseId(`journal-search-chip-${keyword.type}-${keyword.text}`);
    return (
        <SelectedSearchTermTypedItem
            id={idValue}
            data-testid={idValue}
            data-analyticsid={idValue}
            tabIndex={0}
            aria-label={`${keyword.type.toLowerCase()} '${
                keyword.text
            }' filter, to remove press the backspace or delete keyboard`}
            onKeyPress={key => handleKeyboardPressActivate(key, handleDeleteKeyword)}
            onDelete={handleDeleteKeyword}
            type={keyword.type}
        >
            <Typography
                variant="body2"
                component="span"
                sx={{
                    fontWeight: 400,
                }}
            >
                {keyword.text}
            </Typography>
        </SelectedSearchTermTypedItem>
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
