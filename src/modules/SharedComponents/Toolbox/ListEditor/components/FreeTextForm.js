import React, {Component} from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import {withStyles} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const styles = theme => ({
    MUITextLabel: theme.overrides.MuiFormLabel,
    remindToAdd: {
        marginTop: 8,
        color: '#f06f0d'
    }
});

export class FreeTextFormClass extends Component {
    static propTypes = {
        onAdd: PropTypes.func.isRequired,
        isValid: PropTypes.func,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        errorText: PropTypes.string,
        remindToAdd: PropTypes.bool,
        classes: PropTypes.object,
        maxInputLength: PropTypes.number,
        normalize: PropTypes.func
    };

    static defaultProps = {
        isValid: () => '',
        remindToAdd: false,
        maxInputLength: 2000,
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
        this.textField = null;
    }

    addItem = (event) => {
        // add item if user hits 'enter' key on input field
        if (this.props.disabled
            || this.props.isValid(this.state.itemName) !== ''
            || (event && event.key && event.key !== 'Enter')
            || this.state.itemName.length === 0
        ) {
            return;
        }

        // pass on the selected item
        this.props.onAdd(this.state.itemName);

        // reset internal state
        this.setState({
            itemName: ''
        });

        // move focus to name as published text field after item was added
        /* istanbul if ignore */
        if (this.textField) {
            this.textField.focus();
        }
    };

    onNameChanged = (event) => {
        this.setState({
            itemName: this.props.normalize(event.target.value)
        });
    };

    render() {
        const {classes, locale, errorText, disabled} = this.props;
        const{inputFieldLabel, inputFieldHint, remindToAdd, addButtonLabel} = locale;
        const inputLength = this.state.itemName && this.state.itemName.length > this.props.maxInputLength && `Limited to ${this.props.maxInputLength} characters`;
        return (
            <Grid container spacing={16} display="row" alignItems="center">
                <Grid item style={{flexGrow: 1}}>
                    <TextField
                        fullWidth
                        inputRef={(node) => {this.textField = node;}}
                        label={inputFieldLabel}
                        placeholder={inputFieldHint}
                        value={this.state.itemName}
                        onChange={this.onNameChanged}
                        onKeyPress={this.addItem}
                        error={!!errorText || this.props.isValid(this.state.itemName) || !!inputLength}
                        helperText={this.props.isValid(this.state.itemName) || errorText || inputLength
                            ? `${!!errorText ? errorText : ''}${!!errorText && !!inputLength ? ' - ' : ''}${!!inputLength ? inputLength : ''}`
                            : null}
                        disabled={disabled}
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
                        color="primary"
                        variant="contained"
                        children={addButtonLabel}
                        disabled={
                            disabled ||
                            this.props.isValid(this.state.itemName) !== '' ||
                            this.state.itemName.trim().length === 0 ||
                            !!inputLength
                        }
                        onClick={this.addItem}
                    />
                </Grid>
            </Grid>
        );
    }
}

const StyledFreeTextFormClass = withStyles(styles, {withTheme: true})(FreeTextFormClass);
const FreeTextForm = (props) => <StyledFreeTextFormClass {...props}/>;
export default FreeTextForm;
