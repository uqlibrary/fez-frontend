import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Grid, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

export class FreeTextForm extends Component {
    static propTypes = {
        onAdd: PropTypes.func.isRequired,
        isValid: PropTypes.func,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        errorText: PropTypes.string,
        remindToAdd: PropTypes.bool,
        classes: PropTypes.object
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
        const {classes, locale, errorText} = this.props;
        const{inputFieldLabel, inputFieldHint, remindToAdd, addButtonLabel} = locale;

        return (
            <div style={{flexGrow: 1, padding: 8}}>
                <Grid container spacing={16} display="row">
                    <Grid item style={{flexGrow: 1}}>
                        <TextField
                            fullWidth
                            ref="itemName"
                            label={inputFieldLabel}
                            placeholder={inputFieldHint}
                            value={this.state.itemName}
                            onChange={this.onNameChanged}
                            onKeyPress={this.addItem}
                            error={this.props.isValid(this.state.itemName) || errorText
                                ? `${errorText || ''} ${this.props.isValid(this.state.itemName)}`
                                : null}
                            helperText={this.props.isValid(this.state.itemName) || this.props.errorText
                                ? `${this.props.errorText || ''} ${this.props.isValid(this.state.itemName)}`
                                : null}
                            disabled={this.props.disabled}
                        />
                        {
                            this.props.remindToAdd &&
                            remindToAdd &&
                            this.state.itemName.length !== 0 &&
                            !this.props.isValid(this.state.itemName) &&
                            <Typography variant="caption" className={classes.remindToAdd}>
                                {remindToAdd}
                            </Typography>
                        }
                    </Grid>
                    <Grid item xs={12} sm={2}>
                        <Button
                            fullWidth
                            color={'primary'}
                            variant={'raised'}
                            children={this.props.locale.addButtonLabel}
                            disabled={this.props.disabled || this.props.isValid(this.state.itemName) !== '' || this.state.itemName.trim().length === 0}
                            onClick={this.addItem}
                        />
                    </Grid>
                </Grid>
            </div>
        );
    }
}

const styles = () => ({
    remindToAdd: {
        color: '#f06f0d'
    }
});

export default withStyles(styles)(FreeTextForm);
