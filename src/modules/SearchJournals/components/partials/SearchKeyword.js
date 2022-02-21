import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

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

export const getIdSuffix = (keyword, variant, index) => {
    if (typeof keyword === 'string') {
        return `${variant}-${keyword}-${index}`;
    } else {
        return `exact-match-${index}`;
    }
};

export const getId = (keyword, variant, index) => `journal-search-item-${getIdSuffix(keyword, variant, index)}`;

export const SearchKeyword = ({ keyword, onKeywordClick, variant, index }) => {
    const classes = useStyles();
    const handleKeywordClick = () => onKeywordClick(keyword);
    const handleKeywordKeyboardPress = key => {
        key.preventDefault();
        if (
            key.code.toLowerCase() !== 'space' &&
            key.code.toLowerCase() !== 'enter' &&
            key.code.toLowerCase() !== 'numpadenter'
        ) {
            return;
        }

        onKeywordClick && handleKeywordClick();
    };
    return (
        <Grid item xs={12}>
            <Typography
                component="span"
                classes={{ root: classes.root }}
                className={classes[variant || 'default']}
                onKeyPress={handleKeywordKeyboardPress}
                {...((onKeywordClick && { onClick: handleKeywordClick }) || {})}
                id={getId(keyword, variant, index)}
                data-testid={getId(keyword, variant, index)}
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
    index: PropTypes.number.isRequired,
    onKeywordClick: PropTypes.func,
    variant: PropTypes.oneOf(['default', 'addable']),
};

export default React.memo(SearchKeyword);
