import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from 'actions/authors';
import {grantTypes} from 'config/general';

export class GrantListEditorForm extends PureComponent {
    static propTypes = {
        authorsList: PropTypes.array.isRequired,
        onAdd: PropTypes.func.isRequired,
        showIdentifierLookup: PropTypes.bool,
        showRoleInput: PropTypes.bool,
        errorText: PropTypes.string,
        actions: PropTypes.object.isRequired,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        showContributorAssignment: PropTypes.bool,
        required: PropTypes.bool,
        isNtro: PropTypes.bool
    };

    static defaultProps = {
        locale: {
            GrantName: 'Funder/Sponsor name',
            GrantNameHint: 'Enter the funder/sponsors name',
            GrantID: 'Funder/Sponsor ID',
            GrantIDHint: 'Enter the funder/sponsors ID',
            GrantType: 'Funder/Sponsor type',
            GrantTypeHint: 'Select the funder/sponsors type',
            addButton: 'Add funder/sponsor',
            description: 'Add the funder/sponsor\'s name, id and type - then add each funder/sponsor to the list'
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            GrantName: '',
            GrantID: '',
            GrantType: ''
        };
    }

    _addGrant = (event) => {
        if(
            this.props.disabled ||
            (event && event.key && (
                event.key !== 'Enter' ||
                this.state.GrantName.length === 0
            ))
        ) return;

        // pass on the selected grant
        this.props.onAdd({GrantName: this.state.GrantName, GrantID: this.state.GrantID, GrantType: this.state.GrantType});

        // reset internal state
        this.setState({
            GrantName: '',
            GrantID: '',
            GrantType: ''
        });
    };

    _onNameChanged = (event) => {
        this.setState({
            GrantName: event.target.value,
        });
    };

    _onIDChanged = (event) => {
        this.setState({
            GrantID: event.target.value,
        });
    };

    _onTypeChanged = (event) => {
        this.setState({
            GrantType: event.target.value,
        });
    };

    render() {
        const {disabled} = this.props;
        return (
            <React.Fragment>
                {this.props.locale.description}
                <Grid container spacing={8} alignItems={'flex-end'} alignContent={'flex-end'} style={{marginTop: 8}}>
                    <Grid item xs={12} sm>
                        <TextField
                            fullWidth
                            id="GrantName"
                            label={this.props.locale.GrantName}
                            placeholder={this.props.locale.GrantNameHint}
                            value={this.state.GrantName}
                            onChange={this._onNameChanged}
                            disabled={disabled}
                            required={this.props.required}
                            autoComplete="off"
                            error={!this.state.GrantName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3} >
                        <TextField
                            fullWidth
                            id="GrantID"
                            label={this.props.locale.GrantID}
                            placeholder={this.props.locale.GrantIDHint}
                            value={this.state.GrantID}
                            onChange={this._onIDChanged}
                            disabled={disabled || this.state.GrantName.trim().length === 0}
                            required
                            error={!this.state.GrantName}
                        />
                    </Grid>
                    <Grid item xs={12} sm={3} >
                        <FormControl fullWidth>
                            <InputLabel>{this.props.locale.GrantType}</InputLabel>
                            <Select
                                label={this.props.locale.GrantType}
                                placeholder={this.props.locale.GrantTypeHint}
                                value={this.state.GrantType}
                                onChange={this._onTypeChanged}
                                disabled={disabled || this.state.GrantName.trim().length === 0 || this.state.GrantID.trim().length === 0}
                                required
                            >
                                <MenuItem value={''} disabled>{this.props.locale.GrantTypeHint}</MenuItem>
                                {grantTypes.map((item, index) => <MenuItem value={item} key={index}>{item}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={3} sm={'auto'}>
                        <Button
                            variant="contained"
                            fullWidth
                            color="primary"
                            disabled={disabled || this.state.GrantName.trim().length === 0}
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

const mapStateToProps = (state) => {
    return {
        authorsList: state && state.get('authorsReducer') ? state.get('authorsReducer').authorsList : []
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(GrantListEditorForm);
