import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import SearchKeyword from './SearchKeyword';
import ForCodeSource from './ForCodeSource';

export const ForCodeSearchKeyword = ({ keyword, onKeywordClick, sources }) => {
    return (
        <Grid container spacing={1}>
            <Grid item xs="auto">
                <SearchKeyword
                    title="subject & field of research"
                    keyword={keyword}
                    variant="addable"
                    onKeywordClick={onKeywordClick}
                />
            </Grid>
            {sources.map(source => {
                return (
                    <Grid item xs="auto" key={source.name}>
                        <ForCodeSource source={source.name} />
                        {!!source.index && <ForCodeSource source={source.index} />}
                    </Grid>
                );
            })}
        </Grid>
    );
};

ForCodeSearchKeyword.propTypes = {
    keyword: PropTypes.string.isRequired,
    onKeywordClick: PropTypes.func.isRequired,
    sources: PropTypes.arrayOf(PropTypes.object),
};

export default React.memo(ForCodeSearchKeyword);
