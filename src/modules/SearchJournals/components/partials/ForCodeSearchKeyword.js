import React from 'react';
import PropTypes from 'prop-types';

import JournalSearchKeyword from './JournalSearchKeyword';
import ForCodeSource from './ForCodeSource';

export const JournalSearchForCodeKeyword = ({ forCode, onClickKeyword, sources }) => {
    return (
        <React.Fragment>
            <JournalSearchKeyword keyword={forCode} variant="addable" onClickKeyword={onClickKeyword} />
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

JournalSearchForCodeKeyword.propTypes = {
    forCode: PropTypes.string.isRequired,
    onClickKeyword: PropTypes.func.isRequired,
    sources: PropTypes.arrayOf(PropTypes.object),
};

export default React.memo(JournalSearchForCodeKeyword);
