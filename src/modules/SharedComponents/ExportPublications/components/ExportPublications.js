import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {locale} from 'locale';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export default class ExportPublications extends PureComponent {
    static propTypes = {
        format: PropTypes.string,
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
    };

    formatChanged =  (event, index, value) => {
        this.props.onChange(value);
    }

    render() {
        const txt = locale.components.export;
        return (
            <SelectField
                id="exportPublicationsFormat"
                maxHeight={250}
                onChange={this.formatChanged}
                disabled={this.props.disabled}
                value={this.props.format}
                floatingLabelText={txt.label}>
                {
                    txt.format.map((item, index) => {
                        return (
                            <MenuItem key={index} value={item.value} primaryText={item.label}/>
                        );
                    })
                }
            </SelectField>
        );
    }
}
