import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import SelectedKeywordItem from './partials/SelectedKeywordItem';
import locale from 'locale/components';
import { OperandChip } from './partials/OperandChip';

export const SelectedKeywords = ({ onKeywordDelete, onKeywordUpdate, keywords }) => {
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
                                <OperandChip keyword={keywords[index + 1]} onMenuItemClick={onKeywordUpdate} />
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
    onKeywordUpdate: PropTypes.func.isRequired,
};

export default React.memo(SelectedKeywords);
