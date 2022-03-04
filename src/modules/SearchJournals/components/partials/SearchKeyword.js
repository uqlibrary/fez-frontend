import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { sanitiseId } from 'helpers/general';

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

export const SearchKeyword = ({ keyword, onKeywordClick, variant, type, index, cvoId }) => {
    const classes = useStyles();
    const id = getId(keyword, variant, type, index);
    const handleKeywordClick = () => onKeywordClick && onKeywordClick(keyword, cvoId);
    const handleKeywordKeyboardPress = key => {
        key.preventDefault();
        if (
            key.code.toLowerCase() !== 'space' &&
            key.code.toLowerCase() !== 'enter' &&
            key.code.toLowerCase() !== 'numpadenter'
        ) {
            return;
        }

        handleKeywordClick();
    };
    return (
        <Grid item xs={12}>
            <Typography
                component="span"
                classes={{ root: classes.root }}
                className={classes[variant || 'default']}
                onKeyPress={handleKeywordKeyboardPress}
                onClick={handleKeywordClick}
                id={id}
                data-testid={id}
                role="button"
                tabIndex="0"
            >
                {keyword}
            </Typography>
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
};

export default React.memo(SearchKeyword);
