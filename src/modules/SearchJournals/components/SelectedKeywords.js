import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import SelectedKeywordItem from './partials/SelectedKeywordItem';

import locale from 'locale/components';

export const SelectedKeywords = ({ onKeywordDelete, keywords }) => {
    const txt = locale.components.journalSearch;
    return (
        <React.Fragment>
            <Typography variant="subtitle2" color="primary">
                {txt.selectedKeywords.title}
            </Typography>
            {keywords
                .map((keyword, index) => (
                    <SelectedKeywordItem key={`keyword-${keyword.type}-${index}`} onKeywordDelete={onKeywordDelete} />
                ))
                .join(txt.selectedKeywords.combiner)}
        </React.Fragment>
    );
};

SelectedKeywords.propTypes = {
    keywords: PropTypes.array.isRequired,
    onKeywordDelete: PropTypes.func.isRequired,
};

export default React.memo(SelectedKeywords);
