import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import {Grid, Typography} from '@material-ui/core';
import {withStyles} from '@material-ui/core/styles';

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

    onNameChanged = (event, newValue) => {
        this.setState({
            itemName: newValue
        });
    };

    render() {
        const {classes, locale, errorText} = this.props;
        const{inputFieldLabel, inputFieldHint, remindToAdd, addButtonLabel} = locale;

        return (
            <div style={{flexGrow: 1, padding: 8}}>
                <Grid container spacing={16} display="row">
                    <Grid item xs={12} sm={10}>
                        <TextField
                            fullWidth
                            ref="itemName"
                            floatingLabelText={inputFieldLabel}
                            hintText={inputFieldHint}
                            value={this.state.itemName}
                            onChange={this.onNameChanged}
                            onKeyPress={this.addItem}
                            errorText={this.props.isValid(this.state.itemName) || errorText
                                ? `${errorText || ''} ${this.props.isValid(this.state.itemName)}`
                                : null}
                            disabled={this.props.disabled}
                            className="mui-long-labels-fix"
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
                        <RaisedButton
                            className="is-mui-spacing-button"
                            fullWidth
                            primary
                            label={addButtonLabel}
                            disabled={this.props.disabled || this.props.isValid(this.state.itemName) !== '' || this.state.itemName.trim().length === 0}
                            onClick={this.addItem}/>
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
