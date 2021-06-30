import React from 'react';
import PropTypes from 'prop-types';

import SearchKeyword from './SearchKeyword';
import ForCodeSource from './ForCodeSource';

export const ForCodeSearchKeyword = ({ keyword, onClickKeyword, sources }) => {
    return (
        <React.Fragment>
            <SearchKeyword keyword={keyword} variant="addable" onClickKeyword={onClickKeyword} />
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
    onClickKeyword: PropTypes.func.isRequired,
    sources: PropTypes.arrayOf(PropTypes.object),
};

export default React.memo(ForCodeSearchKeyword);
