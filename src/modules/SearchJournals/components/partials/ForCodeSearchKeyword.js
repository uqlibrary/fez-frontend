import React from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';

import SearchKeyword from './SearchKeyword';
import ForCodeSource from './ForCodeSource';

export const ForCodeSearchKeyword = ({ keyword, onKeywordClick, sources, index, cvoId }) => {
    return (
        <Grid container spacing={1}>
            <Grid item xs="auto">
                <SearchKeyword
                    index={index}
                    title="subject & field of research"
                    keyword={keyword}
                    type={'subject'}
                    cvoId={cvoId}
                    variant="addable"
                    onKeywordClick={onKeywordClick}
                />
            </Grid>
            {sources.map(source => {
                return (
                    <Grid item xs="auto" key={source.name}>
                        <ForCodeSource source={source.name} index={index} />
                        {!!source.index && <ForCodeSource source={source.index} index={index} />}
                    </Grid>
                );
            })}
        </Grid>
    );
};

ForCodeSearchKeyword.propTypes = {
    keyword: PropTypes.string.isRequired,
    cvoId: PropTypes.number.isRequired,
    onKeywordClick: PropTypes.func.isRequired,
    sources: PropTypes.arrayOf(PropTypes.object).isRequired,
    index: PropTypes.number.isRequired,
};

export default React.memo(ForCodeSearchKeyword);
