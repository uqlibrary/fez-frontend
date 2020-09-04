import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { locale } from 'locale';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

export default class ExportPublications extends PureComponent {
    static propTypes = {
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
    };

    formatChanged = event => {
        this.props.onChange(event.target.value);
    };

    render() {
        const txt = locale.components.export;
        return (
            <FormControl fullWidth>
                <InputLabel shrink>{txt.label}</InputLabel>
                <Select
                    id="exportPublicationsFormat"
                    onChange={this.formatChanged}
                    disabled={this.props.disabled}
                    value={-1}
                    displayEmpty
                >
                    <MenuItem key={-1} value={-1} disabled>
                        Please select
                    </MenuItem>
                    {txt.format.map((item, index) => {
                        return (
                            <MenuItem key={index} value={item.value}>
                                {item.label}
                            </MenuItem>
                        );
                    })}
                </Select>
            </FormControl>
        );
    }
}
