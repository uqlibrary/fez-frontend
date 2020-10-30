import React, { Component } from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
    selectedMenuItem: {
        backgroundColor: `${theme.palette.accent.main} !important`,
        color: theme.palette.white.main,
    },
});

/**
 * 'canUnselect' prop allows the editing user to 'unselect' the entry in the dropdown
 * Requires a transformer to cover the key in question
 * (At time of writing, rek_herdc_code, rek_herdc_status, and rek_institutional_status have transformers)
 */

export class GenericSelectFieldClass extends Component {
    static propTypes = {
        ariaLabel: PropTypes.string,
        autoWidth: PropTypes.bool,
        canUnselect: PropTypes.bool,
        classes: PropTypes.object,
        className: PropTypes.string,
        disabled: PropTypes.bool,
        displayEmpty: PropTypes.bool,
        error: PropTypes.any,
        errorText: PropTypes.string,
        fullWidth: PropTypes.bool,
        hideLabel: PropTypes.bool,
        hintText: PropTypes.string,
        id: PropTypes.string,
        itemsList: PropTypes.array,
        itemsLoading: PropTypes.bool,
        itemsLoadingHint: PropTypes.string,
        label: PropTypes.string,
        loadingHint: PropTypes.string,
        loadItemsList: PropTypes.func,
        locale: PropTypes.object,
        menuItemClassName: PropTypes.string,
        meta: PropTypes.object,
        multiple: PropTypes.bool,
        name: PropTypes.string,
        onChange: PropTypes.func,
        parentItemsId: PropTypes.number,
        required: PropTypes.bool,
        value: PropTypes.any,
        style: PropTypes.object,
        genericSelectFieldId: PropTypes.string.isRequired,
    };

    static defaultProps = {
        itemsList: [],
        locale: {
            label: 'Select item',
            loading: 'loading...',
        },
        menuItemClassName: '',
        fullWidth: false,
        autoWidth: false,
        canUnselect: false,
        hintText: null,
        multiple: false,
    };

    componentDidMount() {
        if (this.props.itemsList.length === 0 && this.props.loadItemsList) {
            this.props.loadItemsList(this.props.parentItemsId);
        }
    }

    // eslint-disable-next-line camelcase
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.parentItemsId !== nextProps.parentItemsId) {
            this.props.loadItemsList(nextProps.parentItemsId);
        }
    }

    _itemSelected = event => {
        let value = event.target.value;
        if (value[0] === -1) {
            if (value.length === 1) {
                value = '';
            }
            if (value.length > 1) {
                value.shift();
            }
        }
        this.props.onChange(value);
    };

    newValue = () => {
        if (this.props.multiple) {
            if (this.props.hideLabel) {
                return (this.props.value && this.props.value.length > 0 && this.props.value) || [-1];
            } else {
                return (this.props.value && this.props.value.length > 0 && this.props.value) || [];
            }
        } else {
            if (this.props.hideLabel) {
                return (this.props.value && this.props.value.length > 0 && this.props.value) || '-1';
            } else {
                return this.props.value || '-1';
            }
        }
    };

    loadingIndicationText = () => (this.props.itemsLoading ? this.props.loadingHint : this.props.hintText);

    renderMenuItems = () => {
        const { classes } = this.props;
        return [
            this.props.hideLabel && (
                <MenuItem value={-1} key={0} style={{ display: 'block' }} disabled>
                    {this.loadingIndicationText()}
                </MenuItem>
            ),
            ...this.props.itemsList.map((item, index) => {
                return (
                    <MenuItem
                        classes={{ selected: classes.selectedMenuItem }}
                        style={{ display: 'block' }}
                        selected={(this.props.multiple && this.props.value.includes(item.value || item)) || undefined}
                        value={item.value || item}
                        key={index + 1}
                        disabled={item && ((!this.props.canUnselect && !item.value) || !!item.disabled)}
                        aria-label={item.text || item.value || item}
                        data-testid={`${this.props.genericSelectFieldId}-option-${index}`}
                    >
                        {item.text || item.value || item}
                    </MenuItem>
                );
            }),
        ];
    };

    render() {
        return (
            <FormControl fullWidth required={this.props.required} error={!!this.props.error}>
                <InputLabel
                    hidden={this.props.hideLabel}
                    data-testid={`${this.props.genericSelectFieldId}-label`}
                    id={`${this.props.genericSelectFieldId}-label`}
                >
                    {this.props.label}
                </InputLabel>
                <Select
                    autoWidth={this.props.autoWidth}
                    disabled={this.props.disabled || !!this.props.itemsLoading}
                    displayEmpty={this.props.displayEmpty}
                    inputProps={{
                        'aria-labelledby': `${this.props.genericSelectFieldId}-label`,
                        'data-testid': `${this.props.genericSelectFieldId}-input`,
                        id: `${this.props.genericSelectFieldId}-input`,
                    }}
                    multiple={this.props.multiple}
                    MenuProps={{
                        id: `${this.props.genericSelectFieldId}-options`,
                        'data-testid': `${this.props.genericSelectFieldId}-options`,
                    }}
                    onChange={this._itemSelected}
                    style={this.props.style}
                    SelectDisplayProps={{
                        id: `${this.props.genericSelectFieldId}-select`,
                        'data-testid': `${this.props.genericSelectFieldId}-select`,
                    }}
                    value={this.newValue()}
                >
                    {this.renderMenuItems()}
                </Select>
                {!!this.props.error && (
                    <FormHelperText error={!!this.props.error}>{this.props.errorText}</FormHelperText>
                )}
            </FormControl>
        );
    }
}

const StyledGenericSelectField = withStyles(styles, { withTheme: true })(GenericSelectFieldClass);
const GenericSelectField = props => <StyledGenericSelectField {...props} />;
export default GenericSelectField;
