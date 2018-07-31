import React, {PureComponent} from 'react';
import {thesisSubtypes} from 'config/general';
import MenuItem from 'material-ui/MenuItem';
import PropTypes from 'prop-types';
import SelectField from 'material-ui/SelectField';

export class ThesisTypeField extends PureComponent {
    static propTypes = {
        value: PropTypes.any,
        floatingLabelText: PropTypes.string,
        hintText: PropTypes.string,
        onChange: PropTypes.func,
        className: PropTypes.string,
        errorText: PropTypes.string,
        disabled: PropTypes.bool,
    };

    static defaultProps = {
        value: '',
        className: 'thesistype menuitem'
    };

    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value || ''
        };
    }

    _handleValueChange = (event, index, value) => {
        console.log(value);
        this.setState({
            value: value
        }, () => {
            this.props.onChange({}, value);
        });
    };

    render() {
        const ThesisTypeItems = thesisSubtypes.map((item, index) => {
            return (
                <MenuItem
                    className={this.props.className}
                    checked={this.state.value === item || false}
                    value={item}
                    primaryText={item}
                    key={index}
                />
            );
        });

        return (
            <SelectField
                floatingLabelText={this.props.floatingLabelText}
                hintText={this.props.hintText}
                value={this.props.value}
                onChange={this._handleValueChange}
                fullWidth
                style={{maxWidth: '100%'}}
                errorText={this.props.errorText}
                disabled={this.props.disabled}
                maxHeight={300}
                menuItemStyle={{whiteSpace: 'normal', lineHeight: '24px', paddingTop: '4px', paddingBottom: '4px'}}
            >
                {ThesisTypeItems}
            </SelectField>
        );
    }
}
