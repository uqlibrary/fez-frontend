/* eslint-disable no-unused-vars */
import React from 'react';
import Grid from '@mui/material/GridLegacy';
import JournalFieldsMap from './JournalFieldsMap';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import PropTypes from 'prop-types';
import Tooltip from '@mui/material/Tooltip';

const JournalsListHeaderCol1 = ({ onChange, isSelectable = true, checked }) => {
    return (
        <Grid
            container
            spacing={0}
            id="journal-list-header"
            data-testid="journal-list-header"
            alignItems="center"
            sx={theme => ({
                width: '101%',
                borderBottom: '1px solid #CCC',
                marginBottom: '6px',
                paddingTop: '2px',
                ...(!isSelectable && { height: '35px' }),
            })}
        >
            <Grid item xs="auto" id="journal-list-header-checkbox">
                {isSelectable && (
                    <Tooltip title="Select All" placement="right">
                        <Checkbox
                            id="journal-list-header-col-1-select-all"
                            onChange={onChange}
                            sx={theme => ({
                                padding: '2px',
                                marginTop: '4px',
                            })}
                            checked={checked}
                            label="Select All"
                            inputProps={{
                                'aria-label': 'Select All',
                                'data-testid': 'journal-list-header-col-1-select-all',
                                'data-analyticsid': 'journal-list-header-col-1-select-all',
                            }}
                        />
                    </Tooltip>
                )}
            </Grid>
            <Grid
                item
                xs
                id="journal-list-header-col-1"
                data-testid="journal-list-header-col-1"
                sx={theme => ({
                    paddingLeft: 1,
                    ...(isSelectable ? { paddingLeft: 2 } : {}),
                })}
            >
                <InputLabel shrink sx={{ fontWeight: 600 }}>
                    {JournalFieldsMap[0].label}
                </InputLabel>
            </Grid>
        </Grid>
    );
};

JournalsListHeaderCol1.propTypes = {
    isSelectable: PropTypes.bool,
    checked: PropTypes.bool,
    onChange: PropTypes.func,
};

export default React.memo(JournalsListHeaderCol1);
