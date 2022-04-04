import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import SelectedKeywordItem from './partials/SelectedKeywordItem';
import locale from 'locale/components';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
    separator: {
        [theme.breakpoints.down('xs')]: {
            margin: '0 8px',
        },
    },
}));

export const SelectedKeywords = ({ onKeywordDelete, keywords }) => {
    const classes = useStyles();
    const txt = locale.components.searchJournals;
    return (
        <React.Fragment>
            <Typography variant="subtitle2" color="primary" component="span">
                {txt.partials.selectedKeywords.title}
            </Typography>
            <React.Fragment>
                {keywords.map((keyword, index) => {
                    const addSeparator = index + 1 !== keywords.length;
                    return (
                        <React.Fragment key={`fragment-${index}`}>
                            <SelectedKeywordItem
                                key={`keyword-${keyword.type}-${index}`}
                                keyword={keyword}
                                onKeywordDelete={onKeywordDelete}
                            />
                            {addSeparator && (
                                <span className={classes.separator} key={`separator-${index}`}>
                                    +
                                </span>
                            )}
                        </React.Fragment>
                    );
                })}
            </React.Fragment>
        </React.Fragment>
    );
};

SelectedKeywords.propTypes = {
    keywords: PropTypes.array.isRequired,
    onKeywordDelete: PropTypes.func.isRequired,
};

export default React.memo(SelectedKeywords);
