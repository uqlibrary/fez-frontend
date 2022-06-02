import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { sanitiseId } from 'helpers/general';
import ForCodeSource from './ForCodeSource';
import Box from '@material-ui/core/Box';
import { handleKeyboardPressActivate } from 'helpers/general';

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.accent?.main,
        cursor: 'pointer',
    },
    default: {},
    addable: {
        '&::before': {
            content: '"+"',
            marginRight: '4px',
        },
    },
}));

export const getIdSuffix = (keyword, variant, type, index) => {
    if (typeof keyword === 'string') {
        return `${variant}-${type}-${keyword}-${index}`;
    } else {
        return `exact-match-${index}`;
    }
};

export const getId = (keyword, variant, type, index) =>
    sanitiseId(`journal-search-item-${getIdSuffix(keyword, variant, type, index)}`);

export const SearchKeyword = ({ keyword, onKeywordClick, variant, type, index, cvoId, sources }) => {
    const classes = useStyles();
    const id = getId(keyword, variant, type, index);
    const handleKeywordClick = () => onKeywordClick && onKeywordClick(keyword, cvoId);

    return (
        <Grid item xs={12}>
            <Typography
                component="span"
                classes={{ root: classes.root }}
                className={classes[variant || 'default']}
                onKeyPress={key => handleKeyboardPressActivate(key, handleKeywordClick)}
                onClick={handleKeywordClick}
                id={id}
                data-testid={id}
                role="button"
                tabIndex="0"
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
};

export default React.memo(SearchKeyword);
