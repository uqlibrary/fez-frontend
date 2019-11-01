import React, { Component } from 'react';
import PropTypes from 'prop-types';

export default class LookupForm extends Component {
    static propTypes = {
        onAdd: PropTypes.func.isRequired,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        inputField: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
        errorText: PropTypes.string,
        category: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        required: PropTypes.bool,
    };

    static defaultProps = {
        locale: {
            inputFieldLabel: 'Item name',
            inputFieldHint: 'Please type the item name, then select from the list',
        },
        required: false,
    };

    constructor(props) {
        super(props);
    }

    addKeyValueItem = item => {
        this.props.onAdd(item);
    };

    render() {
        return (
            <React.Fragment>
                {this.props.inputField && (
                    <this.props.inputField
                        input={{ onChange: this.props.onAdd }}
                        floatingLabelText={this.props.locale.inputFieldLabel}
                        hintText={this.props.locale.inputFieldHint}
                        disabled={this.props.disabled}
                        errorText={this.props.errorText}
                        category={this.props.category}
                        required={this.props.required}
                    />
                )}
            </React.Fragment>
        );
    }
}
