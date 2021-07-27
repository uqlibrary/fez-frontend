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

export const SearchKeyword = ({ keyword, title, onKeywordClick, variant }) => {
    const classes = useStyles();
    const handleKeywordClick = () => onKeywordClick(keyword);

    return (
        <Grid item xs={12}>
            <Typography
                component="span"
                classes={{ root: classes.root }}
                className={classes[variant || 'default']}
                onClick={handleKeywordClick}
                id={`journal-search-item-${title
                    .toLowerCase()
                    .trim()}-${variant.toLowerCase().trim()}-${keyword.trim()}`}
                data-testid={`journal-search-item-${title
                    .toLowerCase()
                    .trim()}-${variant.toLowerCase().trim()}-${keyword.trim()}`}
            >
                {keyword}
            </Typography>
        </Grid>
    );
};

SearchKeyword.propTypes = {
    keyword: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    title: PropTypes.string.isRequired,
    onKeywordClick: PropTypes.func,
    variant: PropTypes.oneOf(['default', 'addable']),
};

export default React.memo(SearchKeyword);
