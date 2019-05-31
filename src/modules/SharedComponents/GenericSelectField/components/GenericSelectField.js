import React, {Component} from 'react';
import PropTypes from 'prop-types';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import {withStyles} from '@material-ui/core/styles';

const styles = theme => ({
    selectedMenuItem: {
        backgroundColor: `${theme.palette.accent.main} !important`,
        color: theme.palette.white.main
    }
});

export class GenericSelectFieldClass extends Component {
    static propTypes = {
        ariaLabel: PropTypes.string,
        autoWidth: PropTypes.bool,
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
        onChange: PropTypes.func,
        parentItemsId: PropTypes.number,
        required: PropTypes.bool,
        selectedValue: PropTypes.any,
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

    componentWillReceiveProps(nextProps) {
        if (this.props.parentItemsId !== nextProps.parentItemsId) {
            this.props.loadItemsList(nextProps.parentItemsId);
        }
    }

    _itemSelected = (event) => {
        let value = event.target.value;
        if (value[0] === -1) {
            if(value.length === 1) {
                value = '';
            }
            if(value.length > 1) {
                value.shift();
            }
        }
        this.props.onChange(value);
    };

    newValue = () => {
        if(this.props.multiple) {
            if(this.props.hideLabel) {
                return this.props.selectedValue && this.props.selectedValue.length > 0 && this.props.selectedValue || [-1];
            } else {
                return this.props.selectedValue && this.props.selectedValue.length > 0 && this.props.selectedValue || [];
            }
        } else {
            if(this.props.hideLabel) {
                return this.props.selectedValue && this.props.selectedValue.length > 0 && this.props.selectedValue || '-1';
            } else{
                return this.props.selectedValue || '';
            }
        }
    };

    loadingIndicationText = () => this.props.itemsLoading ? this.props.loadingHint : this.props.hintText;

    renderMenuItems = () => {
        const {classes} = this.props;
        return [
            this.props.hideLabel &&
            <MenuItem
                value={-1}
                key={0}
                style={{display: 'block'}}
                disabled
            >
                {this.loadingIndicationText()}
            </MenuItem>,
            ...this.props.itemsList.map((item, index) => {
                return (
                    <MenuItem
                        classes={{selected: classes.selectedMenuItem}}
                        style={{display: 'block'}}
                        selected={
                            this.props.multiple &&
                            this.props.selectedValue.includes(item.value || item) ||
                            undefined
                        }
                        value={item.value || item}
                        key={index + 1}
                        disabled={
                            item && (
                                !item.value ||
                                !!item.disabled
                            )
                        }
                        aria-label={item.text || item.value || item}
                    >
                        {item.text || item.value || item}
                    </MenuItem>
                );
            })
        ];
    }

    render() {
        return (
            <FormControl fullWidth required={this.props.required} error={!!this.props.error}>
                {
                    this.props.locale.label && !this.props.hideLabel &&
                    <InputLabel>{this.props.locale.label}</InputLabel>
                }
                <Select
                    value={this.newValue()}
                    displayEmpty={this.props.displayEmpty}
                    onChange={this._itemSelected}
                    disabled={this.props.disabled || !!this.props.itemsLoading}
                    aria-label={this.props.ariaLabel}
                    autoWidth={this.props.autoWidth}
                    multiple={this.props.multiple}
                    SelectDisplayProps={{
                        id: this.props.id
                    }}
                >
                    {this.renderMenuItems()}
                </Select>
                {
                    !!this.props.error &&
                    <FormHelperText error={!!this.props.error}>{this.props.errorText}</FormHelperText>
                }
            </FormControl>
        );
    }
}

const StyledGenericSelectField = withStyles(styles, {withTheme: true})(GenericSelectFieldClass);
const GenericSelectField = (props) => <StyledGenericSelectField {...props}/>;
export default GenericSelectField;
