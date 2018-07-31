import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

export class AdvancedSearchMultiSelectField extends Component {
    static propTypes = {
        onChange: PropTypes.func,
        itemsList: PropTypes.array,
        itemsLoading: PropTypes.bool,
        itemsLoadingError: PropTypes.bool,
        multiple: PropTypes.bool,
        disabled: PropTypes.bool,
        className: PropTypes.string,
        floatingLabelText: PropTypes.string,
        hintText: PropTypes.string,
        loadingHint: PropTypes.string,
        errorHint: PropTypes.string,
        errorText: PropTypes.string,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.array
        ]),
        loadSuggestions: PropTypes.func
    };

    static defaultProps = {
        itemsList: [],
        floatingLabelText: '',
        hintText: '',
        className: '',
        value: []
    };

    constructor(props) {
        super(props);
        this.state = {
            value: props.value || []
        };
    }
    componentDidMount() {
        this.props.loadSuggestions();
    }

    valuesSelected = (event, index, values) => {
        this.setState({
            value: values
        }, () => {
            this.props.onChange(values);
        });
    };

    hintText = () => {
        if(this.props.itemsLoadingError) {
            return this.props.errorHint;
        } else if(this.props.itemsLoading) {
            return this.props.loadingHint;
        } else {
            return this.props.hintText;
        }
    };

    render() {
        const children = this.props.itemsList.map((item, index) => {
            return (
                <MenuItem
                    className={'menuitem'}
                    checked={this.props.value.length > 0 && this.state.value.indexOf(item.value) > -1}
                    value={item.value}
                    primaryText={item.text || item.value}
                    key={index + 1}
                    disabled={this.props.disabled}
                />
            );
        });
        return (
            <SelectField
                disabled={this.props.itemsLoading || (!this.props.itemsLoading && this.props.itemsLoadingError)}
                floatingLabelText={this.props.floatingLabelText}
                multiple={this.props.multiple}
                value={this.props.value}
                hintText={this.hintText()}
                fullWidth
                onChange={this.valuesSelected}
                errorText={!this.props.itemsLoading && this.props.errorText}
                menuItemStyle={{whiteSpace: 'normal', lineHeight: '24px', paddingTop: '4px', paddingBottom: '4px'}}
            >
                {children}
            </SelectField>
        );
    }
}
