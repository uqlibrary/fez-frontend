import React from 'react';
import Grid from '@material-ui/core/Grid';
import { JournalFieldsMap } from './JournalFieldsMap';
import Checkbox from '@material-ui/core/Checkbox';
import InputLabel from '@material-ui/core/InputLabel';
import PropTypes from 'prop-types';
import { Tooltip } from '@material-ui/core';

const JournalsListHeaderCol1 = ({ onChange, isSelectable = true, checked }) => {
    return (
        <Grid
            container
            spacing={0}
            id="journal-list-header"
            data-testid="journal-list-header"
            alignItems="center"
            style={{
                width: '101%',
                height: 32,
                borderBottom: '1px solid #CCC',
                marginBottom: 6,
            }}
        >
            <Grid item xs="auto" id="journal-list-header-checkbox" style={{ height: 32 }}>
                {isSelectable && (
                    <Tooltip title="Select All" placement="right">
                        <Checkbox
                            id="journal-list-header-col-1-select-all"
                            data-testid="journal-list-header-col-1-select-all"
                            onChange={onChange}
                            style={{ padding: 2, marginTop: -8 }}
                            checked={checked}
                            label="Select All"
                            inputProps={{ 'aria-label': 'Select All' }}
                        />
                    </Tooltip>
                )}
            </Grid>
            <Grid
                item
                xs
                id="journal-list-header-col-1"
                data-testid="journal-list-header-col-1"
                style={{ height: 32, paddingLeft: 14 }}
            >
                <InputLabel shrink style={{ fontWeight: 600 }}>
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
