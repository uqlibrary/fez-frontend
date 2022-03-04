import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Chip from '@material-ui/core/Chip';
import { makeStyles } from '@material-ui/core/styles';
import { sanitiseId } from 'helpers/general';

const useStyles = makeStyles(theme => ({
    chip: {
        margin: theme.spacing(1),
    },
    keyword: {
        fontWeight: 400,
    },
}));

export const SelectedKeywordItem = ({ onKeywordDelete, keyword }) => {
    const classes = useStyles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDeleteKeyword = React.useCallback(() => onKeywordDelete(keyword), [keyword]);
    const handleKeywordKeyboardPress = key => {
        key.preventDefault();
        if (
            key.code.toLowerCase() !== 'space' &&
            key.code.toLowerCase() !== 'enter' &&
            key.code.toLowerCase() !== 'numpadenter'
        ) {
            return;
        }

        handleDeleteKeyword();
    };
    const idValue = sanitiseId(`journal-search-chip-${keyword.type}-${keyword.text}`);
    return (
        <Chip
            className={classes.chip}
            id={idValue}
            data-testid={idValue}
            label={
                <React.Fragment>
                    <Typography variant="body2" component="span" color="secondary">
                        {`${keyword.type}: `}
                    </Typography>
                    <Typography variant="body2" component="span" className={classes.keyword}>
                        {keyword.text}
                    </Typography>
                </React.Fragment>
            }
            tabIndex="0"
            aria-label={`${keyword.type.toLowerCase()} '${
                keyword.text
            }' filter, to remove press the backspace or delete keyboard`}
            onKeyPress={handleKeywordKeyboardPress}
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
