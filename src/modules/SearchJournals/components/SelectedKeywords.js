import React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SelectedKeywordItem from './partials/SelectedKeywordItem';
import locale from 'locale/components';

export const SelectedKeywords = ({ onKeywordDelete, keywords }) => {
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
                                <Box
                                    component={'span'}
                                    sx={theme => ({
                                        [theme.breakpoints.down('sm')]: {
                                            margin: '0 8px',
                                        },
                                    })}
                                    id={`separator-${index}`}
                                    data-testid={`separator-${index}`}
                                    key={`separator-${index}`}
                                >
                                    {keywords[index + 1].type.toLowerCase() === 'keyword' ? 'AND' : 'OR'}
                                </Box>
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
