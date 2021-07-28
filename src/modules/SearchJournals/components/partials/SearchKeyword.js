import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
    root: {
        color: theme.palette.accent.main,
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
export const SearchKeyword = ({ keyword, onKeywordClick, variant, index }) => {
    const classes = useStyles();
    const handleKeywordClick = () => onKeywordClick(keyword);
    let formedId;
    if (typeof keyword === 'string') {
        formedId = `${variant}-${keyword}-${index}`;
    } else {
        formedId = `exact-match-${index}`;
    }
    return (
        <Grid item xs={12}>
            <Typography
                component="span"
                classes={{ root: classes.root }}
                className={classes[variant || 'default']}
                onClick={handleKeywordClick}
                id={`journal-search-item-${formedId}`}
                data-testid={`journal-search-item-${formedId}`}
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
