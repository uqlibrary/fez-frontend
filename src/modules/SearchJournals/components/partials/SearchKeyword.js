import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { sanitiseId } from 'helpers/general';
import ForCodeSource from './ForCodeSource';
import Box from '@material-ui/core/Box';

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
    added: {
        '&::before': {
            content: '"\\2713"',
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

export const SearchKeyword = ({
    keyword,
    onKeywordClick,
    variant,
    type,
    index,
    cvoId,
    sources,
    selectedKeywords = [],
}) => {
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
    // console.log('In the element, keyword and selected list', keyword, selectedKeywords);
    // /const isASelectedKeyword = true;
    // console.log('the keyword I have clicked is ', keyword);
    // console.log('Turned to an array', Object.keys(selectedKeywords));
    // console.log('Do we?', selectedKeywords, selectedKeywords.length);
    const isSelected = Object.keys(selectedKeywords).filter(key => selectedKeywords[key].text === keyword).length > 0;
    // (selectedKeywords &&
    //     selectedKeywords.length > 0 &&
    //     selectedKeywords?.some(keywordItem => {
    //         console.log('Checking against ', keywordItem.text, keyword);
    //         return keywordItem.text === keyword;
    //     })) ??
    // /* istanbul ignore next */ false;

    // Object.keys(selectedKeywords).find(key => selectedKeywords[key] === keyword);

    console.log('Is Selected', isSelected, keyword);
    return (
        <Grid item xs={12}>
            <Typography
                component="span"
                classes={{ root: classes.root }}
                className={`${classes[variant || 'default']} ${isSelected && classes.added}`}
                onKeyPress={handleKeywordKeyboardPress}
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
    selectedKeywords: PropTypes.object,
};

export default React.memo(SearchKeyword);
