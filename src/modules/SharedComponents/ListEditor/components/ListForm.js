import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';

export default class ListForm extends Component {

    static propTypes = {
        onAdd: PropTypes.func.isRequired,
        locale: PropTypes.object,
        disabled: PropTypes.bool
    };

    static defaultProps = {
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

    handleParentContainerScroll() {
        if (this.refs.identifierField) this.refs.identifierField.close();
    }

    _addItem = (event) => {
        // add item if user hits 'enter' key on input field
        if(this.props.disabled || (event && event.key && (event.key !== 'Enter' || this.state.itemName.length === 0))) return;

        // pass on the selected item
        this.props.onAdd(this.state.itemName);

        // reset internal state
        this.setState({
            itemName: ''
        });

        // move focus to name as published text field after item was added
        if (this.refs.itemName) this.refs.itemName.focus();
    }

    _onNameChanged = (event, newValue) => {
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
                        onChange={this._onNameChanged}
                        onKeyPress={this._addItem}
                        disabled={this.props.disabled} />
                </div>
                <div className="column is-narrow">
                    <RaisedButton
                        className="is-mui-spacing-button"
                        fullWidth
                        primary
                        label={this.props.locale.addButtonLabel}
                        disabled={this.props.disabled || this.state.itemName.trim().length === 0}
                        onClick={this._addItem} />
                </div>
            </div>
        );
    }
}
