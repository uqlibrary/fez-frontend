import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/GridLegacy';
import Typography from '@mui/material/Typography';
import { sanitiseId } from 'helpers/general';
import ForCodeSource from './ForCodeSource';
import Box from '@mui/material/Box';
import { handleKeyboardPressActivate } from 'helpers/general';

const classes = {
    default: {},
    addable: {
        '&::before': {
            content: '"+"',
            marginRight: '4px',
        },
    },
    added: {
        '&::before': {
            content: '"\\2012"',
            marginRight: '4px',
        },
    },
};

export const getIdSuffix = (keyword, variant, type, index) => {
    if (typeof keyword === 'string') {
        return `${variant}-${type}-${keyword}-${index}`;
    } else {
        return `exact-match-${index}`;
    }
};

export const getId = (keyword, variant, type, index) =>
    sanitiseId(`journal-search-item-${getIdSuffix(keyword, variant, type, index)}`);

export const SearchKeyword = ({
    keyword,
    onKeywordClick,
    variant = 'default',
    type,
    index,
    cvoId,
    sources,
    selectedKeywords = {},
}) => {
    const id = getId(keyword, variant, type, index);
    const isSelected =
        Object.keys(selectedKeywords).filter(
            key =>
                selectedKeywords[key].text.toUpperCase() === keyword.toUpperCase() &&
                selectedKeywords[key].type.toUpperCase() === type.toUpperCase(),
        ).length > 0;
    const handleKeywordClick = () => onKeywordClick && onKeywordClick(isSelected, keyword, cvoId);

    return (
        <Grid item xs={12}>
            <Typography
                component="span"
                sx={{
                    ...((onKeywordClick && {
                        color: 'accent.main',
                        cursor: 'pointer',
                    }) ||
                        {}),
                    ...classes[variant || 'default'],
                    ...(isSelected ? classes.added : {}),
                }}
                onKeyPress={key => handleKeyboardPressActivate(key, handleKeywordClick)}
                onClick={handleKeywordClick}
                id={id}
                data-testid={id}
                data-analyticsid={id}
                role="button"
                tabIndex={0}
                aria-label={`${isSelected ? 'Remove' : 'Add'} ${type} ${keyword}`}
            >
                {keyword}
            </Typography>
            {sources &&
                sources.map(source => {
                    return (
                        <Box key={`keyword-code-source-${source.name}-${index}`} component="span">
                            <ForCodeSource source={source.name} index={index} />
                            {!!source.index && <ForCodeSource source={source.index} index={index} />}
                        </Box>
                    );
                })}
        </Grid>
    );
};

SearchKeyword.propTypes = {
    keyword: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    type: PropTypes.string.isRequired,
    index: PropTypes.number.isRequired,
    cvoId: PropTypes.number,
    onKeywordClick: PropTypes.func,
    variant: PropTypes.oneOf(['default', 'addable']),
    sources: PropTypes.arrayOf(PropTypes.object),
    selectedKeywords: PropTypes.object,
};

export default React.memo(SearchKeyword);
