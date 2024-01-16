import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

export default class ExportPublications extends PureComponent {
    static propTypes = {
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        exportData: PropTypes.object,
    };

    formatChanged = event => {
        this.props.onChange(event.target.value);
    };

    render() {
        const txt =
            this.props.exportData && this.props.exportData.format && this.props.exportData.format.length > 0
                ? this.props.exportData
                : locale.components.export;

        return (
            <FormControl variant="standard" fullWidth>
                <InputLabel id="export-publications-format-label" shrink>
                    {txt.label}
                </InputLabel>
                <Select
                    variant="standard"
                    labelId="export-publications-format-label"
                    data-testid="export-publications-format"
                    onChange={this.formatChanged}
                    disabled={this.props.disabled}
                    value={-1}
                    displayEmpty
                    SelectDisplayProps={{
                        'data-testid': 'export-publications-format-select',
                    }}
                    inputProps={{
                        'data-testid': 'export-publications-format-input',
                    }}
                >
                    <MenuItem key={-1} value={-1} disabled>
                        Please select
                    </MenuItem>
                    {txt.format.map((item, index) => {
                        return (
                            <MenuItem
                                key={index}
                                value={item.value}
                                data-testid={`export-publication-option-${index}`}
                                id={`export-publication-option-${index}`}
                            >
                                {item.label}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        );
    }
}
