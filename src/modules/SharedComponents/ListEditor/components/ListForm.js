import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class ListForm extends Component {

    static propTypes = {
        onAdd: PropTypes.func.isRequired,
        isValid: PropTypes.func,
        locale: PropTypes.object,
        disabled: PropTypes.bool
    };

    static defaultProps = {
        isValid: () => { return ''; },
        locale: {
            inputFieldLabel: 'Item name',
            inputFieldHint: 'Please type the item name',
            addButtonLabel: 'Add'
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            itemName: ''
        };
    }

    addItem = (event) => {
        // add item if user hits 'enter' key on input field
        if(this.props.disabled
            || this.props.isValid(this.state.itemName) !== ''
            || (event && event.key && (event.key !== 'Enter' || this.state.itemName.length === 0))) {
            return;
        }

        // pass on the selected item
        this.props.onAdd(this.state.itemName);

        // reset internal state
        this.setState({
            itemName: ''
        });

        // move focus to name as published text field after item was added
        if (this.refs.itemName) this.refs.itemName.focus();
    }

    onNameChanged = (event, newValue) => {
        this.setState({
            itemName: newValue
        });
    }

    render() {
        return (
            <div className="columns">
                <div className="column">
                    <TextField
                        fullWidth
                        ref="itemName"
                        floatingLabelText={this.props.locale.inputFieldLabel}
                        hintText={this.props.locale.inputFieldHint}
                        value={this.state.itemName}
                        onChange={this.onNameChanged}
                        onKeyPress={this.addItem}
                        errorText={this.props.isValid(this.state.itemName)}
                        disabled={this.props.disabled} />
                </div>
                <div className="column is-narrow">
                    <RaisedButton
                        className="is-mui-spacing-button"
                        fullWidth
                        primary
                        label={this.props.locale.addButtonLabel}
                        disabled={this.props.disabled || this.props.isValid(this.state.itemName) !== '' || this.state.itemName.trim().length === 0}
                        onClick={this.addItem} />
                </div>
            </div>
        );
    }
}
