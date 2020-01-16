import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { UqIdField, RoleField } from 'modules/SharedComponents/LookupFields';

import OrgAffiliationTypeSelector from './OrgAffiliationTypeSelector';
import NonUqOrgAffiliationFormSection from './NonUqOrgAffiliationFormSection';

import {
    AFFILIATION_TYPE_NOT_UQ,
    AFFILIATION_TYPE_UQ,
    DATA_COLLECTION_CREATOR_ROLES,
    ORG_TYPE_ID_UNIVERSITY,
} from 'config/general';
import locale from 'locale/global';

export class ContributorForm extends PureComponent {
    static propTypes = {
        onSubmit: PropTypes.func.isRequired,
        showIdentifierLookup: PropTypes.bool,
        showRoleInput: PropTypes.bool,
        errorText: PropTypes.string,
        locale: PropTypes.object,
        disabled: PropTypes.bool,
        showContributorAssignment: PropTypes.bool,
        required: PropTypes.bool,
        isNtro: PropTypes.bool,
        isContributorAssigned: PropTypes.bool,
        contributor: PropTypes.object,
        disableNameAsPublished: PropTypes.bool,
        enableUqIdentifierOnAffiliationChange: PropTypes.bool,
        displayCancel: PropTypes.bool,
        canEdit: PropTypes.bool,
    };

    static defaultProps = {
        canEdit: false,
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
                    <span className="authorSteps">Step 1 of 2</span>- Please <b>add to a list of contributors below</b>,
                    in the format and order that they are published.
                </div>
            ),
            descriptionStep1NoStep2: (
                <div>
                    Please <b>add to a list of contributors below</b>, in the format and order that they are published.
                </div>
            ),
        },
        showIdentifierLookup: false,
        disableNameAsPublished: false,
        enableUqIdentifierOnAffiliationChange: true,
    };

    constructor(props) {
        super(props);

        this.state = this.defaultState(props);
    }

    componentWillReceiveProps(nextProps) {
        this.props.contributor !== nextProps.contributor &&
            this.setState({
                ...this.state,
                contributor: {
                    ...nextProps.contributor,
                },
            });
    }

    defaultState = props => ({
        clearRoleInput: true,
        contributor: {
            nameAsPublished: '',
            creatorRole: '',
            uqIdentifier: '',
            orgaff: '',
            orgtype: '',
            affiliation: '',
            uqUsername: '',
            ...props.contributor,
        },
        showIdentifierLookup: props.showIdentifierLookup,
    });

    _onSubmit = event => {
        const { contributor } = this.state;
        // add contributor if user hits 'enter' key on input field
        if (
            this.props.disabled ||
            (event &&
                event.key &&
                (event.key !== 'Enter' ||
                    !contributor.nameAsPublished ||
                    contributor.nameAsPublished.trim().length === 0 ||
                    (this.props.showRoleInput && contributor.creatorRole.length === 0) ||
                    (contributor.affiliation === AFFILIATION_TYPE_NOT_UQ &&
                        contributor.orgaff.trim().length === 0 &&
                        contributor.orgtype.trim().length === 0)))
        ) {
            return;
        }

        // pass on the selected contributor
        this.props.onSubmit({
            ...contributor,
            orgtype: (contributor.affiliation === AFFILIATION_TYPE_UQ && ORG_TYPE_ID_UNIVERSITY) || contributor.orgtype,
            orgaff: (contributor.affiliation === AFFILIATION_TYPE_UQ && locale.global.orgTitle) || contributor.orgaff,
        });

        // reset internal state
        this.setState(this.defaultState(this.props));
    };

    _onCancel = () => {
        this.props.onSubmit({ ...this.props.contributor });
        this.setState(this.defaultState(this.props));
    };

    _onNameChanged = event => {
        const nameAsPublished = event.target.value;
        this.setState(prevState => ({
            ...prevState,
            contributor: {
                ...prevState.contributor,
                nameAsPublished,
            },
            clearRoleInput: true,
        }));
    };

    _onRoleChanged = value => {
        this.setState(
            prevState => ({
                ...prevState,
                contributor: {
                    ...prevState.contributor,
                    creatorRole: value,
                },
                clearRoleInput: DATA_COLLECTION_CREATOR_ROLES.some(role => role.value === value),
            }),
            () => {
                this.state.contributor.nameAsPublished.trim().length !== 0 &&
                    DATA_COLLECTION_CREATOR_ROLES.some(role => role.value === value) &&
                    !this.props.canEdit &&
                    this._onSubmit();
            },
        );
    };

    _onUQIdentifierSelected = selectedItem => {
        this.setState(
            prevState => ({
                ...prevState,
                contributor: {
                    ...prevState.contributor,
                    nameAsPublished:
                        prevState.contributor.nameAsPublished ||
                        (selectedItem &&
                            selectedItem.aut_lname &&
                            `${selectedItem.aut_lname}, ${selectedItem.aut_fname}`) ||
                        '',
                    uqIdentifier: `${selectedItem.aut_id}`,
                    uqUsername: `${selectedItem.aut_org_username}`,
                    ...selectedItem,
                },
            }),
            () => {
                (!this.props.canEdit || (this.props.canEdit && !this.props.showRoleInput)) && this._onSubmit();
            },
        );
    };

    _onUQIdentifierCleared = () => {
        this.setState(
            prevState => ({
                ...prevState,
                contributor: {
                    nameAsPublished: prevState.contributor.nameAsPublished,
                    creatorRole: prevState.contributor.creatorRole,
                    orgaff: 'Missing',
                    orgtype: '',
                    uqIdentifier: '0',
                    authorId: 0,
                    affiliation: AFFILIATION_TYPE_NOT_UQ,
                },
            }),
            () => {
                this._onSubmit();
            },
        );
    };

    handleAffiliationChange = event => {
        const affiliation = event.target.value;
        this.setState(prevState => ({
            ...prevState,
            contributor: {
                ...prevState.contributor,
                affiliation,
            },
        }));
    };

    handleOrgAffliationChange = event => {
        const orgaff = event.target.value;
        this.setState(prevState => ({
            ...prevState,
            ...{
                contributor: {
                    ...prevState.contributor,
                    orgaff,
                },
        }));
    };

    handleOrgTypeChange = event => {
        const orgtype = event.target.value;
        this.setState(prevState => ({
            ...prevState,
            contributor: {
                ...prevState.contributor,
                orgtype,
            },
        }));
    };

    render() {
        const {
            canEdit,
            disabled,
            disableNameAsPublished,
            displayCancel,
            isContributorAssigned,
            isNtro,
            locale,
            required,
            showContributorAssignment,
            showIdentifierLookup,
            showRoleInput,
        } = this.props;

        const { contributor } = this.state;
        const description = showContributorAssignment ? locale.descriptionStep1 : locale.descriptionStep1NoStep2;
        const buttonDisabled =
            disabled ||
            (contributor.nameAsPublished || '').trim().length === 0 ||
            (showRoleInput && contributor.creatorRole.length === 0) ||
            (contributor.affiliation === AFFILIATION_TYPE_NOT_UQ &&
                (contributor.orgaff.trim().length === 0 || contributor.orgtype.trim().length === 0));
        const addButtonLabel =
            canEdit && !!this.props.contributor.nameAsPublished ? 'Change Details' : locale.addButton;
        return (
            <React.Fragment>
                {description}
                <Grid container spacing={8} style={{ marginTop: 8 }}>
                    {(isNtro || !!contributor.affiliation || canEdit) && (
                        <Grid item xs={12} sm={2}>
                            <OrgAffiliationTypeSelector
                                affiliation={contributor.affiliation}
                                onAffiliationChange={this.handleAffiliationChange}
                                error={required && !contributor.affiliation && !isContributorAssigned}
                                disabled={disabled}
                            />
                        </Grid>
                    )}
                    <Grid item xs={12} sm>
                        <TextField
                            fullWidth
                            id={locale.nameAsPublishedFieldId || 'nameAsPublishedField'}
                            label={locale.nameAsPublishedLabel}
                            placeholder={locale.nameAsPublishedHint}
                            value={contributor.nameAsPublished}
                            onChange={this._onNameChanged}
                            onKeyDown={this._onSubmit}
                            disabled={disabled || disableNameAsPublished || (isNtro && contributor.affiliation === '')}
                            required={required}
                            autoComplete="off"
                            error={
                                !isContributorAssigned &&
                                (contributor.nameAsPublished || '').trim().length === 0 &&
                                (isNtro ? contributor.affiliation !== '' : !!required)
                            }
                        />
                    </Grid>
                    {(!contributor.affiliation && this.state.showIdentifierLookup ||
                        (this.props.enableUqIdentifierOnAffiliationChange &&
                            contributor.affiliation === AFFILIATION_TYPE_UQ)) && (
                        <Grid item xs={12} sm={3}>
                            <UqIdField
                                disabled={
                                    disabled || (!canEdit && (contributor.nameAsPublished || '').trim().length === 0)
                                }
                                floatingLabelText="UQ Author ID"
                                hintText="Type UQ author name to search"
                                id="identifierField"
                                key={contributor.authorId}
                                onChange={this._onUQIdentifierSelected}
                                onClear={this._onUQIdentifierCleared}
                                showClear={!!parseInt(contributor.uqIdentifier, 10)}
                                value={contributor.uqUsername || ''}
                            />
                        </Grid>
                    )}
                    {showRoleInput && (
                        <Grid item xs={12} sm={12} md={(showIdentifierLookup && 3) || 5}>
                            <RoleField
                                fullWidth
                                id="creatorRoleField"
                                floatingLabelText={locale.creatorRoleLabel}
                                hintText={locale.creatorRoleHint}
                                onChange={this._onRoleChanged}
                                disabled={disabled || contributor.nameAsPublished.trim().length === 0}
                                required={required}
                                autoComplete="off"
                                error={
                                    contributor.nameAsPublished.trim().length === 0
                                        ? false
                                        : contributor.creatorRole.trim().length === 0
                                }
                                value={contributor.creatorRole}
                                clearInput={this.state.clearRoleInput}
                            />
                        </Grid>
                    )}
                    {contributor.affiliation === AFFILIATION_TYPE_NOT_UQ && (
                        <Grid item xs={12}>
                            <NonUqOrgAffiliationFormSection
                                orgAffiliation={contributor.orgaff || ''}
                                orgType={contributor.orgtype || ''}
                                onOrgAffiliationChange={this.handleOrgAffliationChange}
                                onOrgTypeChange={this.handleOrgTypeChange}
                                disableAffiliationEdit={disabled}
                                disableOrgTypeEdit={disabled}
                            />
                        </Grid>
                    )}
                </Grid>
                <Grid container spacing={8} style={{ marginTop: 8 }}>
                    <Grid item xs={displayCancel ? 6 : 12} style={{ marginBottom: 8 }}>
                        <Button
                            variant="contained"
                            fullWidth
                            color="primary"
                            disabled={buttonDisabled}
                            onClick={this._onSubmit}
                            id="submit-author"
                        >
                            {addButtonLabel}
                        </Button>
                    </Grid>
                    {displayCancel && (
                        <Grid item xs={6} style={{ marginBottom: 8 }}>
                            <Button
                                variant="contained"
                                fullWidth
                                color="primary"
                                disabled={!this.props.contributor.nameAsPublished}
                                onClick={this._onCancel}
                                id="cancel-submit-author"
                            >
                                {locale.cancelButton || 'Cancel'}
                            </Button>
                        </Grid>
                    )}
                </Grid>
            </React.Fragment>
        );
    }
}

export default ContributorForm;
