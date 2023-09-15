import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { UqIdField, RoleField } from 'modules/SharedComponents/LookupFields';

import OrgAffiliationTypeSelector from './OrgAffiliationTypeSelector';
import NonUqOrgAffiliationFormSection from './NonUqOrgAffiliationFormSection';
import { default as globalLocale } from 'locale/global';
import { validation } from 'config';

import {
    AFFILIATION_TYPE_NOT_UQ,
    AFFILIATION_TYPE_UQ,
    DATA_COLLECTION_CREATOR_ROLES,
    ORG_TYPE_ID_UNIVERSITY,
} from 'config/general';

const initialContributorState = {
    nameAsPublished: '',
    creatorRole: '',
    uqIdentifier: '',
    orgaff: '',
    orgtype: '',
    affiliation: '',
    uqUsername: '',
};

export const ContributorForm = ({
    canEdit,
    contributor: initialContributor,
    contributorFormId,
    disabled,
    disableNameAsPublished,
    displayCancel,
    isContributorAssigned,
    isNtro,
    locale,
    onSubmit,
    required,
    showContributorAssignment,
    showIdentifierLookup: initialShowIdentifierLookup,
    showRoleInput,
}) => {
    const [contributor, setContributor] = useState({ ...initialContributorState, ...initialContributor });
    const [clearRoleInput, setClearRoleInput] = useState(true);
    const [showIdentifierLookup, setShowIdentifierLookup] = useState(initialShowIdentifierLookup);
    const [uqIdentifierUpdatedFlag, setUqIdentifierUpdatedFlag] = useState(false);
    const [isEditFormClean, setIsEditFormClean] = useState(!!initialContributor.nameAsPublished);

    const resetInternalState = useCallback(() => {
        setContributor(initialContributor);
        setClearRoleInput(true);
        setShowIdentifierLookup(initialShowIdentifierLookup);
    }, [initialContributor, initialShowIdentifierLookup, setContributor]);

    const _onSubmit = useCallback(
        event => {
            // add contributor if user hits 'enter' key on input field
            if (
                disabled ||
                (event &&
                    event.key &&
                    (event.key !== 'Enter' ||
                        !contributor.nameAsPublished ||
                        contributor.nameAsPublished.trim().length === 0 ||
                        (showRoleInput && contributor.creatorRole.length === 0) ||
                        (contributor.affiliation === AFFILIATION_TYPE_NOT_UQ &&
                            contributor.orgaff.trim().length === 0 &&
                            contributor.orgtype.trim().length === 0)))
            ) {
                return;
            }

            // pass on the selected contributor
            onSubmit({
                ...contributor,
                orgtype:
                    (contributor.affiliation === AFFILIATION_TYPE_UQ && ORG_TYPE_ID_UNIVERSITY) || contributor.orgtype,
                orgaff:
                    (contributor.affiliation === AFFILIATION_TYPE_UQ && globalLocale.global.orgTitle) ||
                    contributor.orgaff,
                required: false,
            });

            // reset internal state
            resetInternalState();
        },
        [contributor, disabled, onSubmit, resetInternalState, showRoleInput],
    );

    const _onCancel = () => {
        initialContributor.nameAsPublished && onSubmit({ ...initialContributor });
        resetInternalState();
    };

    const _onNameChanged = event => {
        const nameAsPublished = event.target.value;
        setContributor({ ...contributor, nameAsPublished });
        setClearRoleInput(true);
    };

    const _onRoleChanged = value => {
        setContributor({ ...contributor, creatorRole: value });
        setClearRoleInput(DATA_COLLECTION_CREATOR_ROLES.some(role => role.value === value));
        setIsEditFormClean(false);
    };

    const _onUQIdentifierSelected = selectedItem => {
        setContributor({
            ...contributor,
            nameAsPublished:
                contributor.nameAsPublished ||
                (selectedItem && selectedItem.aut_lname && `${selectedItem.aut_lname}, ${selectedItem.aut_fname}`),
            uqIdentifier: `${selectedItem.aut_id}`,
            orgaff:
                (contributor.affiliation !== AFFILIATION_TYPE_NOT_UQ && globalLocale.global.orgTitle) ||
                contributor.orgaff,
            orgtype:
                (contributor.affiliation !== AFFILIATION_TYPE_NOT_UQ && ORG_TYPE_ID_UNIVERSITY) || contributor.orgtype,
            uqUsername: `${selectedItem.aut_org_username ||
                selectedItem.aut_student_username ||
                selectedItem.aut_ref_num} - ${selectedItem.aut_id}`,
            ...selectedItem,
        });
        setUqIdentifierUpdatedFlag(true);
        setIsEditFormClean(false);
    };

    const _onUQIdentifierCleared = () => {
        setContributor({
            nameAsPublished: initialContributor.nameAsPublished,
            creatorRole: contributor.creatorRole,
            orgaff: 'Missing',
            orgtype: '',
            uqIdentifier: '0',
            uqUsername: '',
            affiliation: '',
        });
        setUqIdentifierUpdatedFlag(true);
        setIsEditFormClean(false);
    };

    const handleAffiliationChange = event => {
        setContributor({
            ...contributor,
            affiliation: event.target.value,
        });
    };

    const handleOrgAffliationChange = event => {
        setContributor({
            ...contributor,
            orgaff: event.target.value,
        });
    };

    const handleOrgTypeChange = event => {
        setContributor({
            ...contributor,
            orgtype: event.target.value,
        });
    };

    const description = showContributorAssignment ? locale.descriptionStep1 : locale.descriptionStep1NoStep2;
    const buttonDisabled =
        disabled ||
        (contributor.nameAsPublished || '').trim().length === 0 ||
        (showRoleInput && contributor.creatorRole.length === 0) ||
        (isNtro &&
            contributor.affiliation === AFFILIATION_TYPE_NOT_UQ &&
            (contributor.orgaff.trim().length === 0 || contributor.orgtype.trim().length === 0));
    const addButtonLabel = canEdit && !!initialContributor.nameAsPublished ? 'Change Details' : locale.addButton;

    useEffect(() => {
        if (
            uqIdentifierUpdatedFlag &&
            ((!canEdit && !showRoleInput) ||
                (canEdit && !isNtro && !showRoleInput) ||
                (canEdit && isNtro && contributor.affiliation !== AFFILIATION_TYPE_NOT_UQ))
        ) {
            _onSubmit();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [canEdit, showRoleInput, uqIdentifierUpdatedFlag]);

    useEffect(() => {
        if (
            !isEditFormClean &&
            contributor.nameAsPublished.trim().length !== 0 &&
            contributor.creatorRole !== '' &&
            DATA_COLLECTION_CREATOR_ROLES.some(role => role.value === contributor.creatorRole)
        ) {
            _onSubmit();
        }
    }, [_onSubmit, contributor.creatorRole, contributor.nameAsPublished, isEditFormClean]);

    const renderUqIdField = () => {
        const prefilledSearch = !!contributor && contributor.uqIdentifier === '0';
        if (prefilledSearch) {
            contributor.uqUsername = contributor.nameAsPublished;
        }
        return (
            <UqIdField
                disabled={disabled || (!canEdit && (contributor.nameAsPublished || '').trim().length === 0)}
                floatingLabelText="UQ Author ID"
                hintText="Type UQ author name to search"
                uqIdFieldId={`${contributorFormId}-aut-id`}
                key={!!contributor.uqIdentifier ? contributor.uqIdentifier : contributor.uqUsername || 'aut-id'}
                onChange={_onUQIdentifierSelected}
                onClear={_onUQIdentifierCleared}
                value={contributor.uqUsername || contributor.uqIdentifier || ''}
                prefilledSearch={prefilledSearch}
            />
        );
    };

    const isValid = value => !validation.isEmpty(value.trim()) && !validation.maxLength255Validator(value.trim());

    return (
        <React.Fragment>
            {description}
            <Grid container spacing={1} style={{ marginTop: 8 }} id="contributorForm">
                {isNtro && (
                    <Grid item xs={12} sm={2}>
                        <OrgAffiliationTypeSelector
                            affiliation={contributor.affiliation}
                            onAffiliationChange={handleAffiliationChange}
                            error={required && !contributor.affiliation && !isContributorAssigned}
                            disabled={disabled}
                        />
                    </Grid>
                )}
                <Grid item xs={12} sm>
                    <TextField
                        fullWidth
                        id={locale.nameAsPublishedFieldId || 'name-as-published'}
                        textFieldId={contributorFormId}
                        label={locale.nameAsPublishedLabel}
                        placeholder={locale.nameAsPublishedHint}
                        value={contributor.nameAsPublished}
                        onChange={_onNameChanged}
                        onKeyDown={_onSubmit}
                        disabled={
                            disabled || disableNameAsPublished || (!canEdit && isNtro && contributor.affiliation === '')
                        }
                        required={required}
                        autoComplete="off"
                        error={
                            !isContributorAssigned &&
                            (isNtro ? contributor.affiliation !== '' : !!required) &&
                            !isValid(contributor.nameAsPublished)
                        }
                        errorText={
                            !isContributorAssigned &&
                            (isNtro ? contributor.affiliation !== '' : !!required) &&
                            !isValid(contributor.nameAsPublished)
                                ? validation.maxLength255Validator(contributor.nameAsPublished)
                                : undefined
                        }
                    />
                </Grid>
                {(((showIdentifierLookup || isNtro) &&
                    (!contributor.affiliation || contributor.affiliation === AFFILIATION_TYPE_UQ)) ||
                    (!isNtro && canEdit) ||
                    (showIdentifierLookup && canEdit)) && (
                    <Grid item xs={12} sm={3}>
                        {renderUqIdField()}
                    </Grid>
                )}
                {showRoleInput && (
                    <Grid item xs={12} sm={12} md={(showIdentifierLookup && 3) || 5}>
                        <RoleField
                            fullWidth
                            key={`role-input-${(contributor.nameAsPublished || '').trim().length === 0}`}
                            id="creator-role-field"
                            floatingLabelText={locale.creatorRoleLabel}
                            hintText={locale.creatorRoleHint}
                            onChange={_onRoleChanged}
                            disabled={disabled || contributor.nameAsPublished.trim().length === 0}
                            required={required}
                            autoComplete="off"
                            allowFreeText
                            error={
                                contributor.nameAsPublished.trim().length === 0
                                    ? false
                                    : contributor.creatorRole.trim().length === 0
                            }
                            value={contributor.creatorRole}
                            clearInput={clearRoleInput}
                        />
                    </Grid>
                )}
                {isNtro && contributor.affiliation === AFFILIATION_TYPE_NOT_UQ && (
                    <Grid item xs={12}>
                        <NonUqOrgAffiliationFormSection
                            orgAffiliation={contributor.orgaff || ''}
                            orgType={contributor.orgtype || ''}
                            onOrgAffiliationChange={handleOrgAffliationChange}
                            onOrgTypeChange={handleOrgTypeChange}
                            disableAffiliationEdit={disabled}
                            disableOrgTypeEdit={disabled}
                            orgAffiliationError={contributor.orgaff === ''}
                            orgAffiliationTypeError={contributor.orgtype === ''}
                            fullWidthFields
                        />
                    </Grid>
                )}
            </Grid>
            <Grid container spacing={1} style={{ marginTop: 8 }}>
                <Grid item xs={displayCancel ? 6 : 12} style={{ marginBottom: 8 }}>
                    <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        disabled={buttonDisabled || !isValid(contributor.nameAsPublished)}
                        onClick={_onSubmit}
                        id={`${contributorFormId}-add`}
                        data-analyticsid={`${contributorFormId}-add`}
                        data-testid={`${contributorFormId}-add`}
                        sx={theme => ({
                            [theme.breakpoints.down('sm')]: {
                                height: '100%',
                            },
                        })}
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
                            disabled={!contributor.nameAsPublished}
                            onClick={_onCancel}
                            id={`${contributorFormId}-cancel`}
                            data-analyticsid={`${contributorFormId}-cancel`}
                            data-testid={`${contributorFormId}-cancel`}
                            sx={theme => ({
                                [theme.breakpoints.down('sm')]: {
                                    height: '100%',
                                },
                            })}
                        >
                            {locale.cancelButton || 'Cancel'}
                        </Button>
                    </Grid>
                )}
            </Grid>
        </React.Fragment>
    );
};

ContributorForm.propTypes = {
    canEdit: PropTypes.bool,
    contributor: PropTypes.object,
    contributorFormId: PropTypes.string,
    disabled: PropTypes.bool,
    disableNameAsPublished: PropTypes.bool,
    displayCancel: PropTypes.bool,
    enableUqIdentifierOnAffiliationChange: PropTypes.bool,
    isContributorAssigned: PropTypes.bool,
    isNtro: PropTypes.bool,
    locale: PropTypes.object,
    onSubmit: PropTypes.func.isRequired,
    required: PropTypes.bool,
    showContributorAssignment: PropTypes.bool,
    showIdentifierLookup: PropTypes.bool,
    showRoleInput: PropTypes.bool,
};

ContributorForm.defaultProps = {
    canEdit: false,
    contributor: initialContributorState,
    displayCancel: false,
    disableNameAsPublished: false,
    enableUqIdentifierOnAffiliationChange: true,
    locale: {
        nameAsPublishedLabel: 'Name as published',
        nameAsPublishedHint: 'Please type the name exactly as published',
        creatorRoleLabel: 'Creator role',
        creatorRoleHint: 'Role of the creator in relation to the dataset',
        identifierLabel: 'UQ identifier (if available)',
        addButton: 'Add author',
        descriptionStep1: (
            <div>
                <span className="authorSteps">Step 1 of 2</span>- Please <b>add to a list of contributors below</b>, in
                the format and order that they are published.
            </div>
        ),
        descriptionStep1NoStep2: (
            <div>
                Please <b>add to a list of contributors below</b>, in the format and order that they are published.
            </div>
        ),
    },
    required: false,
    showIdentifierLookup: false,
    showRoleInput: false,
};

export default ContributorForm;
