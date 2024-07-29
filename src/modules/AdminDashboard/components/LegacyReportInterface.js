import React from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import locale from 'locale/components';

import { optionDoubleRowRender } from '../config';

const LegacyReportInterface = ({ id, loading, disabled, items, exportReport, onReportChange, onExportClick }) => {
    const txt = locale.components.adminDashboard.tabs.reports;

    const handleExportReport = React.useCallback(() => {
        onExportClick(exportReport.sel_id);
    }, [onExportClick, exportReport?.sel_id]);

    return (
        <Box id={id} data-testid={id}>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <Autocomplete
                        id={id}
                        disablePortal
                        options={items}
                        isOptionEqualToValue={(option, value) => option.sel_id === value.sel_id}
                        getOptionKey={option => option.sel_id}
                        getOptionLabel={option => option.sel_title}
                        renderOption={optionDoubleRowRender}
                        renderInput={params => (
                            <TextField
                                {...params}
                                variant="standard"
                                label={txt.label.report}
                                helperText={txt.label.helperText}
                                inputProps={{
                                    ...params.inputProps,
                                    id: `${id}-input`,
                                    'data-analyticsid': `${id}-input`,
                                    'data-testid': `${id}-input`,
                                    'aria-describedby': `${id}-label`,
                                }}
                                InputLabelProps={{
                                    'data-testid': `${id}-label`,
                                    htmlFor: `${id}-input`,
                                }}
                            />
                        )}
                        ListboxProps={{
                            id: `${id}-listbox`,
                            'data-analyticsid': `${id}-listbox`,
                            'data-testid': `${id}-listbox`,
                        }}
                        value={exportReport}
                        onChange={onReportChange}
                        disabled={loading || disabled}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button
                        id="report-export-button"
                        data-testid="report-export-button"
                        variant="contained"
                        onClick={handleExportReport}
                        disabled={!!!exportReport || exportReport?.sel_id === 0 || disabled || loading}
                    >
                        {loading && (
                            <CircularProgress
                                color="inherit"
                                size={20}
                                id={'export-report-progress'}
                                data-testid={'export-report-progress'}
                                sx={{ mr: 1 }}
                            />
                        )}
                        {txt.label.exportReport}
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
};

LegacyReportInterface.propTypes = {
    id: PropTypes.string.isRequired,
    loading: PropTypes.bool,
    disabled: PropTypes.bool,
    items: PropTypes.array,
    exportReport: PropTypes.object,
    onReportChange: PropTypes.func,
    onExportClick: PropTypes.func,
};

export default React.memo(LegacyReportInterface);
