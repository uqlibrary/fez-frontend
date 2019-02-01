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

import OrgAffilicationTypeSelector from './OrgAffiliationTypeSelector';
import NonUqOrgAffiliationFormSection from './NonUqOrgAffiliationFormSection';

export class ContributorForm extends PureComponent {
    static propTypes = {
        authorsList: PropTypes.array.isRequired,
        onAdd: PropTypes.func.isRequired,
        showIdentifierLookup: PropTypes.bool,
<<<<<<< HEAD
        showAffiliation: PropTypes.bool,
=======
        showRoleInput: PropTypes.bool,
>>>>>>> master
        errorText: PropTypes.string,
        actions: PropTypes.object.isRequired,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        showContributorAssignment: PropTypes.bool,
        required: PropTypes.bool,
        isNtro: PropTypes.bool,
        isContributorAssigned: PropTypes.bool
    };

    static defaultProps = {
        required: false,
        locale: {
            nameAsPublishedLabel: 'Name as published',
            nameAsPublishedHint: 'Please type the name exactly as published',
            creatorRoleLabel: 'Creator role',
            creatorRoleHint: 'Role of the creator in relation to the dataset',
            identifierLabel: 'UQ identifier (if available)',
            identifierHint: '',
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
<<<<<<< HEAD
            affiliation: ''
=======
            affiliation: '',
            orgaff: '',
            orgtype: '',
            showIdentifierLookup: false
>>>>>>> master
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
        this.props.onAdd(
            {
                ...this.state.contributor,
                ...{nameAsPublished: this.state.nameAsPublished, creatorRole: this.state.creatorRole, affiliation: this.state.affiliation, orgaff: this.state.orgaff, orgtype: this.state.orgtype}});

        // reset internal state
        this.setState({
            nameAsPublished: '',
            creatorRole: '',
            uqIdentifier: '',
<<<<<<< HEAD
            contributor: {},
            affiliation: ''
=======
            clearRoleInput: true,
            contributor: {},
            affiliation: '',
            orgaff: '',
            orgtype: ''
>>>>>>> master
        });
    };

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
    };
    _onAffChanged = (event) => {
        const value = event.target.value.replace('%', '');
        this.setState({
            affiliation: value + '%'
        });
    };


    _onUQIdentifierSelected = (selectedItem) => {
        this.setState({
            contributor: selectedItem
        }, () => {
            this._addContributor();
        });
    };

    _onUQIdentifierChanged = (newValue) => {
        console.log(newValue);
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

    handleOrgAfflicationChange = (event) => {
        this.setState({
            orgaff: event.target.value
        });
    };

    handleOrgTypeChange = (event) => {
        this.setState({
            orgtype: event.target.value,
        });
    };

    render() {
        const {showContributorAssignment, showIdentifierLookup, showRoleInput, isNtro, disabled} = this.props;
        const description = showContributorAssignment ? this.props.locale.descriptionStep1 : this.props.locale.descriptionStep1NoStep2;
        return (
            <React.Fragment>
                {description}
<<<<<<< HEAD
                <Grid container spacing={8} alignItems={'flex-end'} alignContent={'flex-end'}>
                    <Grid item xs={12} sm>
=======
                <Grid container spacing={8} style={{marginTop: 8}}>
                    {
                        isNtro &&
                        <Grid item xs={12} sm={2}>
                            <OrgAffilicationTypeSelector
                                affiliation={this.state.affiliation}
                                onAffiliationChange={this.handleAffiliationChange}
                                error={this.props.required && !this.state.affiliation && !this.props.isContributorAssigned}
                            />
                        </Grid>
                    }
                    <Grid item xs={12} sm >
>>>>>>> master
                        <TextField
                            fullWidth
                            id="nameAsPublishedField"
                            label={this.props.locale.nameAsPublishedLabel}
                            placeholder={this.props.locale.nameAsPublishedHint}
                            value={this.state.nameAsPublished}
                            onChange={this._onNameChanged}
                            onKeyPress={this._addContributor}
                            disabled={disabled || isNtro && this.state.affiliation.length === 0}
                            required={this.props.required}
                            autoComplete="off"
                            error={!!(!isNtro && this.props.required && !this.props.isContributorAssigned && !this.state.nameAsPublished) ||
                            !!(isNtro && this.state.affiliation && !this.state.nameAsPublished)}
                        />
                    </Grid>
<<<<<<< HEAD
                    <Grid item xs={12} sm={2}>
                        <TextField
                            fullWidth
                            label={'Affiliation value'}
                            placeholder={'1% - 100%'}
                            value={this.state.affiliation}
                            onChange={this._onAffChanged}
                            disabled={!this.state.nameAsPublished}
                            autoComplete="off"
                        />
                    </Grid>
                </Grid>
                <Grid container spacing={8} alignItems={'flex-end'} alignContent={'flex-end'}>
                    <Grid item xs={12} sm>
                        <TextField
                            fullWidth
                            label={'Affiliation ID'}
                            disabled={!this.state.nameAsPublished}
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={12} sm>
                        <TextField
                            fullWidth
                            label={'Affiliation country'}
                            disabled={!this.state.nameAsPublished}
                            autoComplete="off"
                        />
                    </Grid>
                    <Grid item xs={12} sm>
                        <UqIdField
                            label={this.props.locale.identifierLabel}
                            placeholder={this.props.locale.identifierHint}
                            value={this.state.uqIdentifier}
                            disabled={this.props.disabled || this.state.nameAsPublished.trim().length === 0}
                            onChange={this._onUQIdentifierSelected}
                            ref="identifierField"
                            id="identifierField"
                        />
                    </Grid>
                    <Grid item xs={'auto'}>
=======
                    {
                        (showIdentifierLookup || this.state.showIdentifierLookup) &&
                        <Grid item xs={12} sm={3}>
                            <UqIdField
                                disabled={disabled || this.state.nameAsPublished.trim().length === 0}
                                onChange={this._onUQIdentifierSelected}
                                floatingLabelText="UQ username (if known)"
                                hintText="eg. uqjsmith"
                                id="identifierField"
                            />
                        </Grid>
                    }
                    {
                        showRoleInput &&
                        <Grid item xs={12} sm={12} md={showIdentifierLookup && showRoleInput && 3 || 5}>
                            <RoleField
                                fullWidth
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
                            <NonUqOrgAffiliationFormSection
                                orgAffiliation={this.state.orgaff}
                                orgType={this.state.orgtype}
                                onOrgAffiliationChange={this.handleOrgAfflicationChange}
                                onOrgTypeChange={this.handleOrgTypeChange}
                            />
                        </Grid>
                    }
                    <Grid item xs={12} style={{marginBottom: 8}}>
>>>>>>> master
                        <Button
                            variant="contained"
                            fullWidth
                            color="primary"
                            disabled={disabled || this.state.nameAsPublished.trim().length === 0 || showRoleInput && this.state.creatorRole.length === 0 || this.state.affiliation === 'NotUQ' && this.state.orgaff === ''}
                            onClick={this._addContributor}
                        >
                            Add author
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
