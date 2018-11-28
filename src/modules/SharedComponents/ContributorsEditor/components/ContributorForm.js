import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {TextField} from 'modules/SharedComponents/Toolbox/TextField';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import {UqIdField} from 'modules/SharedComponents/LookupFields';
import {RoleField} from 'modules/SharedComponents/LookupFields';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from 'actions/authors';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

export class ContributorForm extends PureComponent {
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
        required: PropTypes.bool
    };

    static defaultProps = {
        locale: {
            showIdentifierLookup: true,
            nameAsPublishedLabel: 'Name as published',
            nameAsPublishedHint: 'Please type the name exactly as published',
            creatorRoleLabel: 'Creator role',
            creatorRoleHint: 'Role of the creator in relation to the dataset',
            identifierLabel: 'UQ identifier (if available)',
            addButton: 'Add author',
            descriptionStep1: (<div><span className="authorSteps">Step 1 of 2</span> - Please <b>add to a list of contributors below</b>, in the format and order that they are published.</div>),
            descriptionStep1NoStep2: (<div>Please <b>add to a list of contributors below</b>, in the format and order that they are published.</div>)
        }
    };

    constructor(props) {
        super(props);

        this.state = {
            nameAsPublished: '',
            creatorRole: '',
            uqIdentifier: '',
            contributor: {},
            affiliation: '',
            showIdentifierLookup: true,
            orgaff: '',
            orgtype: ''
        };
    }

    _addContributor = (event) => {
        // add contributor if user hits 'enter' key on input field
        if(
            this.props.disabled ||
            (event && event.key && (
                event.key !== 'Enter' ||
                this.state.nameAsPublished.length === 0 ||
                (this.props.showRoleInput && this.state.creatorRole.length === 0)
            ))
        ) return;

        // pass on the selected contributor
        this.props.onAdd({...this.state.contributor, ...{nameAsPublished: this.state.nameAsPublished, creatorRole: this.state.creatorRole, affiliation: this.state.affiliation, orgaff: this.state.orgaff, orgtype: this.state.orgtype}});

        // reset internal state
        this.setState({
            nameAsPublished: '',
            creatorRole: '',
            uqIdentifier: '',
            clearRoleInput: true,
            contributor: {},
            affiliation: '',
            orgaff: '',
            orgtype: ''
        });
    }

    _onNameChanged = (event) => {
        this.setState({
            nameAsPublished: event.target.value,
            clearRoleInput: false
        });
    }

    _onRoleChanged = (value) => {
        this.setState({
            creatorRole: value
        });
    }

    _onUQIdentifierSelected = (selectedItem) => {
        this.setState({
            contributor: selectedItem
        }, () => {
            this._addContributor();
        });
    }

    _onUQIdentifierChanged = (newValue) => {
        this.setState({
            uqIdentifier: newValue
        });

        if (newValue.trim().length > 1) {
            this.props.actions.searchAuthors(newValue, (item) => { return !!item.aut_org_username; });
        }
    };

    handleAffiliationChange = (event) => {
        this.setState({
            affiliation: event.target.value,
            showIdentifierLookup: !!(event.target.value === 'UQ')
        });
    };

    orgTpyeChanged = (event) => {
        this.setState({
            orgtype: event.target.value,
        });
    };

    orgaffChanged = (event) => {
        this.setState({
            orgaff: event.target.value
        });
    };

    render() {
        const description = this.props.showContributorAssignment ? this.props.locale.descriptionStep1 : this.props.locale.descriptionStep1NoStep2;
        return (
            <React.Fragment>
                {description}
                <Grid container spacing={8} alignItems={'flex-end'} alignContent={'flex-end'} style={{marginTop: 8}}>
                    <Grid item xs={12} sm={2}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="age-simple">Org affiliation</InputLabel>
                            <Select
                                value={this.state.affiliation}
                                onChange={this.handleAffiliationChange}
                            >
                                <MenuItem value={''} disabled>Organisational affiliation at time of publication</MenuItem>
                                <MenuItem value={'UQ'}>UQ</MenuItem>
                                <MenuItem value={'NotUQ'}>Not UQ</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm >
                        <TextField
                            fullWidth
                            ref="nameAsPublishedField"
                            id="nameAsPublishedField"
                            label={this.props.locale.nameAsPublishedLabel}
                            placeholder={this.props.locale.nameAsPublishedHint}
                            value={this.state.nameAsPublished}
                            onChange={this._onNameChanged}
                            onKeyPress={this._addContributor}
                            disabled={this.props.disabled || this.state.affiliation.length === 0}
                            required={this.props.required}
                            autoComplete="off"
                            error={!this.state.nameAsPublished}
                        />
                    </Grid>
                    {
                        this.props.showIdentifierLookup || this.state.showIdentifierLookup &&
                        <Grid item xs={12} sm={3}>
                            <UqIdField
                                disabled={this.props.disabled || this.state.nameAsPublished.trim().length === 0}
                                onChange={this._onUQIdentifierSelected}
                                floatingLabelText="UQ username (if known)"
                                hintText="eg. uqjsmith"
                                ref="identifierField"
                                id="identifierField"
                            />
                        </Grid>
                    }
                    {
                        this.props.showRoleInput &&
                        <Grid item xs={12} sm={12} md={this.props.showIdentifierLookup && this.props.showRoleInput && 3 || 5}>
                            <RoleField
                                fullWidth
                                ref="creatorRoleField"
                                if="creatorRoleField"
                                floatingLabelText={this.props.locale.creatorRoleLabel}
                                hintText={this.props.locale.creatorRoleHint}
                                onChange={this._onRoleChanged}
                                disabled={this.props.disabled}
                                required={this.props.required}
                                autoComplete="off"
                                error={this.state.creatorRole.length === 0}
                                value={this.state.creatorRole}
                                clearInput={this.state.clearRoleInput}
                            />
                        </Grid>
                    }
                    {
                        this.state.affiliation === 'NotUQ' &&
                        <Grid item xs={12}>
                            <Grid container spacing={8}>
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label={'Organisation'}
                                        value={this.state.orgaff}
                                        onChange={this.orgaffChanged}
                                        required
                                        error={this.state.orgaff === ''}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth required>
                                        <InputLabel htmlFor="orgtype">Organisation type</InputLabel>
                                        <Select
                                            required
                                            value={this.state.orgtype}
                                            onChange={this.orgTpyeChanged}
                                            error={this.state.orgtype === ''}
                                        >
                                            <MenuItem value={''} disabled>Select an organisation type</MenuItem>
                                            <MenuItem value={'Museum'}>Museum</MenuItem>
                                            <MenuItem value={'Gallery'}>Gallery</MenuItem>
                                            <MenuItem value={'Government'}>Government</MenuItem>
                                            <MenuItem value={'NGO'}>NGO</MenuItem>
                                            <MenuItem value={'Corporate/Industry'}>Corporate/Industry</MenuItem>
                                            <MenuItem value={'University'}>University</MenuItem>
                                            <MenuItem value={'Other'}>Other</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                    }
                    <Grid item xs={12} style={{marginBottom: 8}}>
                        <Button
                            variant="contained"
                            fullWidth
                            color="primary"
                            disabled={this.props.disabled || this.state.nameAsPublished.trim().length === 0 || this.props.showRoleInput && this.state.creatorRole.length === 0 || this.state.affiliation === 'NotUQ' && this.state.orgaff === '' || this.state.affiliation === 'NotUQ' && this.state.orgtype === ''}
                            onClick={this._addContributor}
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

export default connect(mapStateToProps, mapDispatchToProps)(ContributorForm);
