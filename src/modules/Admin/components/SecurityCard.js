import React from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form/lib/immutable';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {SelectField} from 'modules/SharedComponents/Toolbox/SelectField';

import {validation} from 'config';
import {TOP_LEVEL_SECURITY_POLICIES, RECORD_TYPE_COLLECTION, RECORD_TYPE_RECORD} from 'config/general';
import {RecordContextConsumer, FormValuesContextConsumer} from 'context';
import {viewRecordsConfig} from 'config';
import { InheritedSecurityDetails } from './InheritedSecurityDetails';

export const PolicyDescription = ({selectedPolicyKey, policyArray}) => {
    const policyDesc = policyArray.find(
        policy => policy.value === selectedPolicyKey
    );
    return (
        <React.Fragment>
            {policyDesc.name} ({policyDesc.id})
        </React.Fragment>
    );
};

PolicyDescription.propTypes = {
    selectedPolicyKey: PropTypes.number,
    policyArray: PropTypes.array
};

PolicyDescription.defaultProps = {
    policyArray: TOP_LEVEL_SECURITY_POLICIES
};

export const renderPolicyItems = (policyList = TOP_LEVEL_SECURITY_POLICIES) => {
    return policyList.map((policy, index) => {
        return (
            <MenuItem key={index} value={policy.value}>
                {policy.label}
            </MenuItem>
        );
    });
};

export const isFileValid = (dataStream) => {
    const {files: {blacklist}} = viewRecordsConfig;

    return !dataStream.dsi_dsid.match(blacklist.namePrefixRegex) &&
        (!dataStream.dsi_label || !dataStream.dsi_label.match(new RegExp(blacklist.descriptionKeywordsRegex, 'gi'))) &&
        dataStream.dsi_state === 'A';
};

export const OverrideSecurity = ({label, input}) => {
    return (
        <FormControlLabel
            control={<Checkbox
                onChange={input.onChange}
            />}
            label={label}
        />
    );
};

OverrideSecurity.propTypes = {
    label: PropTypes.string,
    input: PropTypes.object
};

export const SelectedSecurityPolicyDescription = ({title, selectedPolicyKey}) => {
    return (
        <Grid item xs={12} style={{
            marginTop: 12,
            padding: 24,
            backgroundColor: 'rgba(0,0,0,0.05)'
        }}>
            <Typography variant="h6" style={{ marginTop: -8 }}>
                {title}
            </Typography>
            <Grid container spacing={8} style={{ marginTop: 8 }}>
                <Grid item xs={2}><b>Name (ID):</b></Grid>
                <Grid item xs={10}>
                    <PolicyDescription selectedPolicyKey={selectedPolicyKey} />
                </Grid>
            </Grid>
        </Grid>
    );
};

SelectedSecurityPolicyDescription.propTypes = {
    title: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.node
    ]),
    selectedPolicyKey: PropTypes.number
};

export const SecurityCard = ({ disabled, text }) => {
    return (
        <RecordContextConsumer>
            {({record}) => {
                const securityType = record.rek_object_type_lookup;
                const dataStreams = !!record.fez_datastream_info
                    && record.fez_datastream_info.length > 0
                    && record.fez_datastream_info.filter(isFileValid);
                const hasDatastreams = dataStreams.length > 0;
                const isPolicyInherited = record.rek_security_inherited;

                const title = (
                    <span>
                        <b>{securityType}</b> level security - {record.rek_pid}
                    </span>
                );

                return (
                    <Grid container spacing={16}>
                        <Grid item xs={12}>
                            <StandardCard title={title} accentHeader>
                                {
                                    securityType === RECORD_TYPE_RECORD &&
                                    <Grid item xs={12}>
                                        <Field
                                            component={OverrideSecurity}
                                            name="rek_security_inherited"
                                            label="Override inherited security (detailed below)"
                                            normalize={(value) => value ? 0 : 1}
                                        />
                                    </Grid>
                                }
                                <FormValuesContextConsumer>
                                    {({formValues}) => (
                                        isPolicyInherited && securityType === RECORD_TYPE_RECORD && formValues.get('rek_security_inherited') !== 0
                                            ? <InheritedSecurityDetails />
                                            : <Grid container spacing={8}>
                                                <Grid item xs={12}>
                                                    <Typography variant="body2" component="p">
                                                        {text.description}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <Field
                                                        component={SelectField}
                                                        disabled={disabled}
                                                        name="rek_security_policy"
                                                        label={`${securityType} policy to apply to this PID`}
                                                        required
                                                        validation={[validation.required]}
                                                    >
                                                        <MenuItem value="" disabled>
                                                            {text.prompt}
                                                        </MenuItem>
                                                        {renderPolicyItems()}
                                                    </Field>
                                                </Grid>
                                                {
                                                    !!formValues.get('rek_security_policy') &&
                                                    <SelectedSecurityPolicyDescription
                                                        title={text.selectedTitle}
                                                        selectedPolicyKey={formValues.get('rek_security_policy')}
                                                    />
                                                }
                                            </Grid>
                                    )}
                                </FormValuesContextConsumer>
                                {
                                    securityType === RECORD_TYPE_COLLECTION &&
                                    <Grid container spacing={8} style={{ marginTop: 16 }}>
                                        <Grid item xs={12}>
                                            <Field
                                                component={SelectField}
                                                disabled={disabled}
                                                name="rek_datastream_policy"
                                                label={text.dataStreamFieldLabel}
                                                required
                                                validation={[validation.required]}
                                            >
                                                <MenuItem value="" disabled>
                                                    {text.prompt}
                                                </MenuItem>
                                                {renderPolicyItems()}
                                            </Field>
                                        </Grid>
                                        <FormValuesContextConsumer>
                                            {({formValues}) => (
                                                !!formValues.get('rek_datastream_policy') &&
                                                    <SelectedSecurityPolicyDescription
                                                        title={text.dataStreamSelectedTitle}
                                                        selectedPolicyKey={formValues.get('rek_datastream_policy')}
                                                    />
                                            )}
                                        </FormValuesContextConsumer>
                                    </Grid>
                                }
                            </StandardCard>
                        </Grid>
                        <Grid item xs={12}>
                            {
                                hasDatastreams &&
                                <StandardCard title={<span><b>Datastream</b> security - {record.rek_pid}</span>} accentHeader>
                                    <Grid container spacing={8}>
                                        {
                                            isPolicyInherited ?
                                                <InheritedSecurityDetails />
                                                :
                                                <Grid item xs={12} style={{
                                                    marginTop: 24,
                                                    padding: 24,
                                                    backgroundColor: 'rgba(0,0,0,0.05)'
                                                }}>
                                                    <Typography variant="h6" style={{ marginTop: -8 }}>
                                                        Override datastream security policy details
                                                    </Typography>
                                                    <Typography variant="body2" component="p">
                                                        {text.prompt}
                                                    </Typography>
                                                    <Grid container spacing={8} alignContent="flex-end" alignItems="flex-end" style={{
                                                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                                                        paddingBottom: 8,
                                                        paddingTop: 8
                                                    }}>
                                                        <Grid item xs={2}>Filename:</Grid>
                                                        <Grid item xs={4}>Test_1.PDF</Grid>
                                                        <Grid item xs={6}>
                                                            <Field
                                                                component={SelectField}
                                                                disabled={disabled}
                                                                name="filePolicy1"
                                                                label={<span>Security policy for this file to override inheritance</span>}
                                                                required
                                                                validation={[validation.required]}
                                                            >
                                                                {renderPolicyItems()}
                                                            </Field>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container spacing={8} alignContent="flex-end" alignItems="flex-end" style={{
                                                        borderBottom: '1px solid rgba(0,0,0,0.1)',
                                                        paddingBottom: 8,
                                                        paddingTop: 8
                                                    }}>
                                                        <Grid item xs={2}>Filename:</Grid>
                                                        <Grid item xs={4}>Test_3.JPG</Grid>
                                                        <Grid item xs={6}>
                                                            <Field
                                                                component={SelectField}
                                                                disabled={disabled}
                                                                name="filePolicy2"
                                                                label={<span>Security policy for this file to override inheritance</span>}
                                                                required
                                                                validation={[validation.required]}
                                                            >
                                                                {renderPolicyItems()}
                                                            </Field>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                        }
                                    </Grid>
                                </StandardCard>
                            }
                        </Grid>
                    </Grid>
                );
            }}
        </RecordContextConsumer>
    );
};

SecurityCard.propTypes = {
    disabled: PropTypes.bool,
    text: PropTypes.object
};

export default React.memo(SecurityCard);
