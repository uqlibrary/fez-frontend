import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import {orgAffiliationTypes} from 'config/general';
import locale from 'locale/validationErrors';
import {withStyles} from '@material-ui/core';

const styles = () => ({
    reminderMessage: {
        marginTop: 8,
        borderTop: '1px solid red',
        paddingTop: 4
    }
});

export class GrantListEditorFormClass extends PureComponent {
    static propTypes = {
        onAdd: PropTypes.func.isRequired,
        errorText: PropTypes.string,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        required: PropTypes.bool,
        hideType: PropTypes.bool,
        classes: PropTypes.object,
        isPopulated: PropTypes.any
    };

    static defaultProps = {
        locale: {
            grantAgencyName: 'Funder/Sponsor name',
            grantAgencyNameHint: 'Enter funder/sponsor name for this work',
            grantId: 'Grant ID',
            grantIdHint: 'Enter grant number for this work, if available',
            grantAgencyType: 'Funder/Sponsor type',
            grantAgencyTypeHint: 'Select Funder/Sponsor type',
            addButton: 'Add grant',
            description: 'Add the Funder/Sponsor\'s name, grant ID and type - then click the ADD GRANT button to add each to the list',
            remindToAdd: (<span>&nbsp;<b>* REMINDER:</b> Click ADD GRANT to add this item to your list or it will not be included.</span>)
        },
        hideType: false,
        isPopulated: false
    };

    constructor(props) {
        super(props);

        this.state = {
            grantAgencyName: '',
            grantId: '',
            grantAgencyType: ''
        };
    }

    _addGrant = (event) => {
        if(
            this.props.disabled ||
            (event && event.key && (
                event.key !== 'Enter' ||
                this.state.grantAgencyName.length === 0
            ))
        ) return;

        // pass on the selected grant
        this.props.onAdd({grantAgencyName: this.state.grantAgencyName, grantId: this.state.grantId, grantAgencyType: this.state.grantAgencyType});

        // reset internal state
        this.setState({
            grantAgencyName: '',
            grantId: '',
            grantAgencyType: ''
        });
        if (this.props.isPopulated) {
            this.props.isPopulated(false);
        }
    };

    _onNameChanged = (event) => {
        this.setState({
            grantAgencyName: event.target.value,
        }, ()=> {
            if(this.props.isPopulated) {
                this.props.isPopulated(!!(this.state.grantAgencyName.trim().length > 0));
            }
        });
    };

    _onIDChanged = (event) => {
        this.setState({
            grantId: event.target.value,
        }, () => {
            if(this.props.isPopulated) {
                this.props.isPopulated(!!(this.state.grantId.trim().length > 0));
            }
        });
    };

    _onTypeChanged = (event) => {
        this.setState({
            grantAgencyType: event.target.value,
        });
    };

    render() {
        const {disabled} = this.props;
        // const remindToAdd = (this.state.grantAgencyName.trim().length > 0 || this.state.grantId.trim().length > 0) ? this.props.locale.remindToAdd : null;
        return (
            <React.Fragment>
                {this.props.locale.description}
                <Grid container spacing={8} style={{marginTop: 8}}>
                    <Grid item xs={12} sm={12} md>
                        <TextField
                            fullWidth
                            id="grantAgencyName"
                            label={this.props.locale.grantAgencyName}
                            placeholder={this.props.locale.grantAgencyNameHint}
                            value={this.state.grantAgencyName}
                            onChange={this._onNameChanged}
                            disabled={disabled}
                            required={this.props.required}
                            autoComplete="off"
                            error={this.props.required && !this.state.grantAgencyName}
                            errorText={this.props.required && !this.state.grantAgencyName && locale.validationErrors.required}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12} md={!this.props.hideType ? 3 : 4} >
                        <TextField
                            fullWidth
                            id="grantId"
                            label={this.props.locale.grantId}
                            placeholder={this.props.locale.grantIdHint}
                            value={this.state.grantId}
                            onChange={this._onIDChanged}
                            disabled={disabled || this.state.grantAgencyName.trim().length === 0}
                            required={this.props.required}
                        />
                    </Grid>
                    {
                        !this.props.hideType &&
                        <Grid item xs={12} sm={12} md={3}>
                            <FormControl
                                fullWidth
                                required={this.props.required || this.state.grantAgencyName.trim().length > 0}
                                error={this.state.grantAgencyName.trim().length > 0 && this.state.grantAgencyType.trim().length === 0}
                            >
                                <InputLabel>{this.props.locale.grantAgencyType}</InputLabel>
                                <Select
                                    SelectDisplayProps={{
                                        id: 'grantType'
                                    }}
                                    label={this.props.locale.grantAgencyType}
                                    placeholder={this.props.locale.grantAgencyTypeHint}
                                    value={this.state.grantAgencyType}
                                    onChange={this._onTypeChanged}
                                    disabled={disabled || this.state.grantAgencyName.trim().length === 0}
                                >
                                    <MenuItem value={''} disabled>{this.props.locale.grantAgencyTypeHint}</MenuItem>
                                    {
                                        orgAffiliationTypes.map((item, index) => {
                                            return item.value !== '454045' ?
                                                <MenuItem value={item.value} key={index}>{item.text}</MenuItem> : null;
                                        })
                                    }
                                </Select>
                                {
                                    this.state.grantAgencyName.trim().length > 0 && this.state.grantAgencyType.trim().length === 0 &&
                                    <FormHelperText error>{locale.validationErrors.required}</FormHelperText>
                                }
                            </FormControl>
                        </Grid>
                    }
                    <Grid item xs={12}>
                        <Button
                            id="grantAddButton"
                            variant="contained"
                            fullWidth
                            color="primary"
                            disabled={disabled || this.state.grantAgencyName.trim().length === 0 || (!this.props.hideType && this.state.grantAgencyType.trim().length === 0)}
                            onClick={this._addGrant}
                        >
                            {this.props.locale.addButton}
                        </Button>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

const StyledGrantListEditorFormClass = withStyles(styles, {withTheme: true})(GrantListEditorFormClass);
const GrantListEditorForm = (props) => <StyledGrantListEditorFormClass {...props}/>;
export default GrantListEditorForm;
