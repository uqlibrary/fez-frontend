import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import {orgAffiliationTypes} from 'config/general';

export default class GrantListEditorForm extends PureComponent {
    static propTypes = {
        onAdd: PropTypes.func.isRequired,
        errorText: PropTypes.string,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        required: PropTypes.bool,
        hideType: PropTypes.bool,
    };

    static defaultProps = {
        locale: {
            grantName: 'Funder/Sponsor name',
            grantNameHint: 'Enter the funder/sponsors name',
            grantId: 'Funder/Sponsor ID',
            grantIdHint: 'Enter the funder/sponsors ID',
            grantType: 'Funder/Sponsor type',
            grantTypeHint: 'Select the funder/sponsors type',
            addButton: 'Add funder/sponsor',
            description: 'Add the funder/sponsor\'s name, id and type - then add each funder/sponsor to the list'
        },
        hideType: false
    };

    constructor(props) {
        super(props);

        this.state = {
            grantName: '',
            grantId: '',
            grantType: ''
        };
    }

    _addGrant = (event) => {
        if(
            this.props.disabled ||
            (event && event.key && (
                event.key !== 'Enter' ||
                this.state.grantName.length === 0
            ))
        ) return;

        // pass on the selected grant
        this.props.onAdd({grantName: this.state.grantName, grantId: this.state.grantId, grantType: this.state.grantType});

        // reset internal state
        this.setState({
            grantName: '',
            grantId: '',
            grantType: ''
        });
    };

    _onNameChanged = (event) => {
        this.setState({
            grantName: event.target.value,
        });
    };

    _onIDChanged = (event) => {
        this.setState({
            grantId: event.target.value,
        });
    };

    _onTypeChanged = (event) => {
        this.setState({
            grantType: event.target.value,
        });
    };

    render() {
        const {disabled} = this.props;
        return (
            <React.Fragment>
                {this.props.locale.description}
                <Grid container spacing={8} alignItems={'flex-end'} alignContent={'flex-end'} style={{marginTop: 8}}>
                    <Grid item xs={12} sm={12} md>
                        <TextField
                            fullWidth
                            id="grantName"
                            label={this.props.locale.grantName}
                            placeholder={this.props.locale.grantNameHint}
                            value={this.state.grantName}
                            onChange={this._onNameChanged}
                            disabled={disabled}
                            required={this.props.required}
                            autoComplete="off"
                            error={!this.state.grantName}
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
                            disabled={disabled || this.state.grantName.trim().length === 0}
                            required={this.props.required}
                            error={!this.state.grantName}
                        />
                    </Grid>
                    {
                        !this.props.hideType &&
                        <Grid item xs={12} sm={12} md={3}>
                            <FormControl fullWidth>
                                <InputLabel>{this.props.locale.grantType}</InputLabel>
                                <Select
                                    label={this.props.locale.grantType}
                                    placeholder={this.props.locale.grantTypeHint}
                                    value={this.state.grantType}
                                    onChange={this._onTypeChanged}
                                    disabled={disabled || this.state.grantName.trim().length === 0 || this.state.grantId.trim().length === 0}
                                    required={this.props.required}
                                >
                                    <MenuItem value={''} disabled>{this.props.locale.grantTypeHint}</MenuItem>
                                    {orgAffiliationTypes.map((item, index) => <MenuItem value={item.value} key={index}>{item.text}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Grid>
                    }
                    <Grid item xs={12} sm={12} md={'auto'}>
                        <Button
                            variant="contained"
                            fullWidth
                            color="primary"
                            disabled={disabled || this.state.grantName.trim().length === 0 || this.state.grantId.trim().length === 0 || (!this.props.hideType && this.state.grantType.trim().length === 0)}
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

