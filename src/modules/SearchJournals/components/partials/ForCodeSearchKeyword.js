import React from 'react';
import PropTypes from 'prop-types';

import SearchKeyword from './SearchKeyword';
import ForCodeSource from './ForCodeSource';

export const ForCodeSearchKeyword = ({ keyword, onKeywordClick, sources }) => {
    return (
        <React.Fragment>
            <SearchKeyword keyword={keyword} variant="addable" onKeywordClick={onKeywordClick} />
            {sources.map(source => {
                return (
                    <React.Fragment>
                        <ForCodeSource source={source.name} />
                        {!!source.index && <ForCodeSource source={source.index} />}
                    </React.Fragment>
                );
            })}
        </React.Fragment>
    );
};

ForCodeSearchKeyword.propTypes = {
    keyword: PropTypes.string.isRequired,
    onKeywordClick: PropTypes.func.isRequired,
    sources: PropTypes.arrayOf(PropTypes.object),
};

export default React.memo(ForCodeSearchKeyword);
