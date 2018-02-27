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
        disabled: PropTypes.bool
    };

    static defaultProps = {
        itemsList: [],
        locale: {
            label: 'Select item',
            loading: 'loading...'
        }
    };

    static contextTypes = {
        selectFieldMobileOverrides: PropTypes.object
    };

    constructor(props) {
        super(props);
        this.state = {
            selectedValue: props.selectedValue,
            windowWidth: window.innerWidth
        };
    }

    componentDidMount() {
        if (this.props.itemsList.length === 0 && this.props.loadItemsList) {
            this.props.loadItemsList(this.props.parentItemsId);
        }

        if (this.props.selectedValue !== null) {
            this._updateSelectedValue(this.props.selectedValue);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onChange && nextState.selectedValue !== this.state.selectedValue) {
            this.props.onChange(nextState.selectedValue);
        }
    }

    _updateSelectedValue = (value) => {
        this.setState({
            selectedValue: value
        });
    };

    _itemSelected = (event, index, value) => {
        this._updateSelectedValue(value);
    };

    render() {
        const renderMenuItems = this.props.itemsList.map((item, index) => {
            return <MenuItem value={item} primaryText={item} key={`select_field_${index}`}/>;
        });
        const loadingIndicationText = `${this.props.locale.label} ${this.props.itemsLoading ? this.props.locale.loading : ''}`;
        return (
            <SelectField
                id="selectedValue"
                name="selectedValue"
                {...this.context.selectFieldMobileOverrides}
                className={this.props.className}
                value={this.props.itemsLoading ? null : this.state.selectedValue}
                maxHeight={250}
                onChange={this._itemSelected}
                disabled={this.props.disabled || this.props.itemsLoading}
                dropDownMenuProps={{animated: false}}
                floatingLabelText={loadingIndicationText}>
                {renderMenuItems}
            </SelectField>
        );
    }
}
