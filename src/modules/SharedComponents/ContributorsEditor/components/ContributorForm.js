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
        onSubmit: PropTypes.func.isRequired,
        showIdentifierLookup: PropTypes.bool,
        showRoleInput: PropTypes.bool,
        errorText: PropTypes.string,
        actions: PropTypes.object.isRequired,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        showContributorAssignment: PropTypes.bool,
        required: PropTypes.bool,
        isNtro: PropTypes.bool,
        isContributorAssigned: PropTypes.bool,
        contributor: PropTypes.object,
        initialValues: PropTypes.object,
        affiliation: PropTypes.string,
    };

    static defaultProps = {
        required: false,
        contributor: {},
        locale: {
            nameAsPublishedLabel: 'Name as published',
            nameAsPublishedHint: 'Please type the name exactly as published',
            creatorRoleLabel: 'Creator role',
            creatorRoleHint: 'Role of the creator in relation to the dataset',
            identifierLabel: 'UQ identifier (if available)',
            addButton: 'Add author',
            descriptionStep1: (
                <div>
                    <span className="authorSteps">Step 1 of 2</span>
                    - Please <b>add to a list of contributors below</b>,
                    in the format and order that they are published.
                </div>
            ),
            descriptionStep1NoStep2: (
                <div>
                    Please <b>add to a list of contributors below</b>,
                    in the format and order that they are published.
                </div>
            )
        },
        showIdentifierLookup: false,
        onSubmit: () => {},
    };

    constructor(props) {
        super(props);

        this.state = {
            nameAsPublished: '',
            creatorRole: '',
            uqIdentifier: '',
            clearRoleInput: true,
            contributor: {},
            affiliation: '',
            orgaff: '',
            orgtype: '',
            ...props,
            ...props.contributor
        };
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.contributor !== nextProps.contributor) {
            this.setState({
                ...nextProps,
                ...nextProps.contributor,
                contributor: nextProps.contributor || {},
            });
        }
    }

    _onSubmit = (event) => {
        // add contributor if user hits 'enter' key on input field
        if(
            this.props.disabled ||
            (
                event &&
                event.key && (
                    event.key !== 'Enter' ||
                    !this.state.nameAsPublished ||
                    this.state.nameAsPublished.trim().length === 0 || (
                        this.props.showRoleInput &&
                        this.state.creatorRole.length === 0
                    ) || (
                        this.state.affiliation !== 'UQ' &&
                        this.state.orgaff.trim().length === 0 &&
                        this.state.orgtype.trim().length === 0
                    )
                )
            )
        ) return;

        // pass on the selected contributor
        const newContributor = {
            ...this.state.contributor,
            ...{
                nameAsPublished: this.state.nameAsPublished,
                creatorRole: this.state.creatorRole,
                affiliation: this.state.affiliation,
                orgaff: this.state.orgaff,
                orgtype: this.state.orgtype,
                uqIdentifier: this.state.contributor.aut_id,
            }
        };
        this.props.onSubmit(newContributor);

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
    };

    _onNameChanged = (event) => {
        this.setState({
            nameAsPublished: event.target.value,
            clearRoleInput: false
        });
    };

    _onRoleChanged = (value) => {
        this.setState({
            creatorRole: value
        });
    };

    _onUQIdentifierSelected = (selectedItem) => {
        this.setState({
            contributor: selectedItem
        }, () => {
            this._onSubmit();
        });
    };

    handleAffiliationChange = (event) => {
        const newState = {
            affiliation: event.target.value,
            showIdentifierLookup: (event.target.value === 'UQ')
        };
        if (event.target.value === 'NotUQ') {
            newState.uqIdentifier = '';
            newState.orgaff = this.props.contributor.orgaff;
        }
        this.setState(newState);
    };

    handleOrgAffliationChange = (event) => {
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
        const {
            disabled,
            initialValues,
            isContributorAssigned,
            isNtro,
            locale,
            required,
            showContributorAssignment,
            showIdentifierLookup,
            showRoleInput,
        } = this.props;

        const description = showContributorAssignment
            ? locale.descriptionStep1
            : locale.descriptionStep1NoStep2
        ;

        const buttonDisabled = disabled ||
            (this.state.nameAsPublished || '').trim().length === 0 ||
            (
                showRoleInput &&
                this.state.creatorRole.trim().length === 0
            ) ||
            (
                this.state.affiliation === 'NotUQ' &&
                (
                    (this.state.orgaff || '').trim().length === 0 ||
                    (this.state.orgtype || '').trim().length === 0
                )
            )
        ;

        return (
            <React.Fragment>
                {description}
                <Grid container spacing={8} style={{marginTop: 8}}>
                    {
                        isNtro &&
                        <Grid item xs={12} sm={2}>
                            <OrgAffilicationTypeSelector
                                affiliation={this.state.affiliation}
                                onAffiliationChange={this.handleAffiliationChange}
                                error={required && !this.state.affiliation && !isContributorAssigned}
                                disabled={(initialValues || {}).affiliation === 'UQ'}
                            />
                        </Grid>
                    }
                    <Grid item xs={12} sm >
                        <TextField
                            fullWidth
                            id="nameAsPublishedField"
                            label={locale.nameAsPublishedLabel}
                            placeholder={locale.nameAsPublishedHint}
                            value={this.state.nameAsPublished}
                            onChange={this._onNameChanged}
                            disabled={disabled ||
                                (
                                    isNtro &&
                                    this.state.affiliation.length === 0
                                ) ||
                                !!(this.props.contributor || {}).nameAsPublished
                            }
                            required={required}
                            autoComplete="off"
                            error={
                                !isContributorAssigned &&
                                this.state.nameAsPublished.trim().length === 0 && (
                                    isNtro ? !!this.state.affiliation : !!required
                                )
                            }
                        />
                    </Grid>
                    {
                        this.state.showIdentifierLookup &&
                        <Grid item xs={12} sm={3}>
                            <UqIdField
                                disabled={disabled ||
                                    !!(initialValues || {}).uqIdentifier ||
                                    (this.state.nameAsPublished || '').trim().length === 0
                                }
                                onChange={this._onUQIdentifierSelected}
                                value={String(this.state.uqIdentifier || '')}
                                floatingLabelText="UQ Author ID"
                                hintText="Type UQ author name to search"
                                id="identifierField"
                            />
                        </Grid>
                    }
                    {
                        showRoleInput &&
                        <Grid item xs={12} sm={12} md={showIdentifierLookup && 3 || 5}>
                            <RoleField
                                fullWidth
                                id="creatorRoleField"
                                floatingLabelText={locale.creatorRoleLabel}
                                hintText={locale.creatorRoleHint}
                                onChange={this._onRoleChanged}
                                disabled={disabled}
                                required={required}
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
                                orgAffiliation={this.state.orgaff || ''}
                                orgType={this.state.orgtype || ''}
                                onOrgAffiliationChange={this.handleOrgAffliationChange}
                                onOrgTypeChange={this.handleOrgTypeChange}
                                disableAffiliationEdit={disabled}
                                disableOrgTypeEdit={disabled || !!(initialValues || {}).orgtype}
                            />
                        </Grid>
                    }
                    <Grid item xs={12} style={{marginBottom: 8}}>
                        <Button
                            variant="contained"
                            fullWidth
                            color="primary"
                            disabled={buttonDisabled}
                            onClick={this._onSubmit}
                        >
                            {locale.addButton}
                        </Button>
                    </Grid>
                </Grid>
            </React.Fragment>
        );
    }
}

export const mapStateToProps = (state) => {
    return {
        authorsList: state && state.get('authorsReducer')
            ? state.get('authorsReducer').authorsList
            : []
    };
};

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ContributorForm);
