import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

export default class FreeTextForm extends Component {
    static propTypes = {
        onAdd: PropTypes.func.isRequired,
        isValid: PropTypes.func,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        errorText: PropTypes.string,
        remindToAdd: PropTypes.bool
    };

    static defaultProps = {
        isValid: () => '',
        remindToAdd: false,
        locale: {
            inputFieldLabel: 'Item name',
            inputFieldHint: 'Please type the item name',
            addButtonLabel: 'Add'
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            itemName: ''
        };
    }

    addItem = (event) => {
        // add item if user hits 'enter' key on input field
        if (this.props.disabled
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
    };

    onNameChanged = (event) => {
        this.setState({
            itemName: event.target.value
        });
    };

    render() {
        return (
            <Grid container>
                <Grid item style={{flexGrow: 1}}>
                    <TextField
                        fullWidth
                        ref="itemName"
                        label={this.props.locale.inputFieldLabel}
                        placeholder={this.props.locale.inputFieldHint}
                        value={this.state.itemName}
                        onChange={this.onNameChanged}
                        onKeyPress={this.addItem}
                        error={!!(this.props.isValid(this.state.itemName) || this.props.errorText
                            ? `${this.props.errorText || ''} ${this.props.isValid(this.state.itemName)}`
                            : null)}
                        helperText={this.props.isValid(this.state.itemName) || this.props.errorText
                            ? `${this.props.errorText || ''} ${this.props.isValid(this.state.itemName)}`
                            : null}
                        disabled={this.props.disabled}
                    />
                    {
                        this.props.remindToAdd &&
                        this.props.locale.remindToAdd &&
                        this.state.itemName.length !== 0 &&
                        !this.props.isValid(this.state.itemName) &&
                        <div className="validationWarningMessage">
                            {this.props.locale.remindToAdd}
                        </div>
                    }
                </Grid>
                <Grid item>
                    <Button
                        fullWidth
                        color={'primary'}
                        variant={'raised'}
                        children={this.props.locale.addButtonLabel}
                        disabled={this.props.disabled || this.props.isValid(this.state.itemName) !== '' || this.state.itemName.trim().length === 0}
                        onClick={this.addItem}/>
                </Grid>
            </Grid>
        );
    }
}
