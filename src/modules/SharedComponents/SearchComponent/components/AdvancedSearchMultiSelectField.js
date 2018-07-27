import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export class AdvancedSearchMultiSelectField extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        async: PropTypes.bool,
        itemsList: PropTypes.array,
        itemsListLoading: PropTypes.bool,
        multiple: PropTypes.bool,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        floatingLabelText: PropTypes.string,
        hintText: PropTypes.string,
        errorText: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ])
    };

    static defaultProps = {
        floatingLabelText: '',
        hintText: '',
        className: ''
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.value
        };
    }

    valuesSelected = (event, index, values) => {
        this.setState({
            value: values
        }, () => {
            this.props.onChange(values);
        });
    };

    render() {
        const children = this.props.itemsList.map((item, index) => {
            return (
                <MenuItem
                    checked={this.props.value.length > 0 && this.props.value.indexOf(item.value) > -1}
                    value={item.value}
                    primaryText={item.value}
                    key={index + 1}
                    disabled={this.props.disabled}
                />
            );
        });
        return (
            <SelectField
                id="MultiSelectField"
                disabled={this.props.disabled}
                floatingLabelText={this.props.floatingLabelText}
                multiple={this.props.multiple}
                value={this.props.value}
                hintText={this.props.hintText}
                fullWidth
                style={{maxWidth: '100%'}}
                onChange={this.valuesSelected}
                className={this.props.className + ' mui-long-labels-fix'}
                errorText={this.props.errorText}
            >
                {children}
            </SelectField>
        );
    }
}
