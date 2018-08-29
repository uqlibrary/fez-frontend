import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';

export default class GenericSelectField extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        locale: PropTypes.object,
        itemsList: PropTypes.array,
        itemsLoading: PropTypes.bool,
        loadItemsList: PropTypes.func,
        selectedValue: PropTypes.any,
        parentItemsId: PropTypes.number,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        menuItemClassName: PropTypes.string,
        fullWidth: PropTypes.bool,
        autoWidth: PropTypes.bool,
        errorText: PropTypes.string,
        hintText: PropTypes.string,
        multiple: PropTypes.bool,
        required: PropTypes.bool,
        ariaLabel: PropTypes.string
    };

    static defaultProps = {
        itemsList: [],
        locale: {
            label: 'Select item',
            loading: 'loading...'
        },
        menuItemClassName: '',
        fullWidth: false,
        autoWidth: false,
        hintText: null,
        multiple: false
    };

    componentDidMount() {
        if (this.props.itemsList.length === 0 && this.props.loadItemsList) {
            this.props.loadItemsList(this.props.parentItemsId);
        }
    }

    _itemSelected = (event) => {
        this.props.onChange(event.target.value);
    };

    getMenuItemProps = (item, selectedValue, multiple) => {
        if (multiple) {
            return {
                selected: selectedValue.indexOf(item.value || item) > -1,
                value: item.value || item,
            };
        } else {
            return {
                value: item.value || item,
            };
        }
    };

    render() {
        const renderMenuItems = this.props.itemsList.map((item, index) => {
            return (<MenuItem
                {...(this.getMenuItemProps(item, this.props.selectedValue, this.props.multiple))}
                key={`select_field_${index}`}>
                {item.text || item.value || item}
            </MenuItem>);
        });
        const loadingIndicationText = !!this.props.locale.label && `${this.props.locale.label} ${this.props.itemsLoading ? this.props.locale.loading : ''}` || null;
        return (
            <FormControl style={{width: '100%'}}>
                <InputLabel required={this.props.required}>{loadingIndicationText}</InputLabel>
                <Select
                    id="selectedValue"
                    name="selectedValue"
                    value={this.props.itemsLoading ? null : this.props.selectedValue || ''}
                    onChange={this._itemSelected}
                    disabled={this.props.disabled || this.props.itemsLoading}
                    placeholder={this.props.hintText}
                    aria-label={this.props.ariaLabel}
                    autoWidth={this.props.autoWidth}
                    error={this.props.required && !this.props.selectedValue}
                    multiple={this.props.multiple}
                >
                    {renderMenuItems}
                </Select>
                {
                    this.props.required && !this.props.selectedValue &&
                    <FormHelperText error>{this.props.errorText || 'Selection required'}</FormHelperText>
                }
            </FormControl>
        );
    }
}
