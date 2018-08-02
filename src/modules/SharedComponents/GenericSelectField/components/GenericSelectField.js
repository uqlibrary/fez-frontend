import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

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
        multiple: PropTypes.bool
    };

    static contextTypes = {
        selectFieldMobileOverrides: PropTypes.object
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

    _itemSelected = (event, index, value) => {
        this.props.onChange(value);
    };

    getMenuItemProps = (item, selectedValue, multiple) => {
        if (multiple) {
            return {
                checked: selectedValue.indexOf(item.value) > -1,
                value: item.value,
                primaryText: item.text || item.value
            };
        } else {
            return {
                value: item,
                primaryText: item
            };
        }
    };

    render() {
        const renderMenuItems = this.props.itemsList.map((item, index) => {
            return (<MenuItem
                {...(this.getMenuItemProps(item, this.props.selectedValue, this.props.multiple))}
                className={this.props.menuItemClassName}
                key={`select_field_${index}`}
            />);
        });
        const loadingIndicationText = !!this.props.locale.label && `${this.props.locale.label} ${this.props.itemsLoading ? this.props.locale.loading : ''}` || null;
        return (
            <SelectField
                id="selectedValue"
                name="selectedValue"
                {...this.context.selectFieldMobileOverrides}
                className={this.props.className}
                value={this.props.itemsLoading ? null : this.props.selectedValue}
                maxHeight={250}
                onChange={this._itemSelected}
                disabled={this.props.disabled || this.props.itemsLoading}
                dropDownMenuProps={{animated: false}}
                hintText={this.props.hintText}
                floatingLabelText={loadingIndicationText}
                fullWidth={this.props.fullWidth}
                autoWidth={this.props.autoWidth}
                errorText={this.props.errorText}
                multiple={this.props.multiple}
                menuItemStyle={{whiteSpace: 'normal', lineHeight: '24px', paddingTop: '4px', paddingBottom: '4px'}}
            >
                {renderMenuItems}
            </SelectField>
        );
    }
}
