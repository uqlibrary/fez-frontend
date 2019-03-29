import React from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form/lib/immutable';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';

import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {SelectField} from 'modules/SharedComponents/Toolbox/SelectField';

import {validation} from 'config';
import {TOP_LEVEL_SECURITY_POLICIES, RECORD_TYPE_COMMUNITY} from 'config/general';
import {RecordContextConsumer, FormValuesContextConsumer} from 'context';

export const renderPolicyDesc = (selectedPolicyKey, policyArray = TOP_LEVEL_SECURITY_POLICIES) => {
    if (selectedPolicyKey) {
        const policyDesc = policyArray.find(
            policy => policy.value === selectedPolicyKey
        );
        return (
            <React.Fragment>
                {policyDesc.name} ({policyDesc.id})
            </React.Fragment>
        );
    } else {
        return <div />;
    }
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

export const SecurityCard = ({ disabled, text }) => {
    return (
        <RecordContextConsumer>
            {({record}) => {
                const securityType = record.rek_display_type_lookup || record.rek_object_type_lookup;
                const title = (
                    <span>
                        <b>{securityType}</b> level security - {record.rek_pid}
                    </span>
                );
                return (
                    <StandardCard title={title} accentHeader>
                        <Grid container spacing={8}>
                            <Grid item xs={12}>
                                <Typography variant="body2" component="p">
                                    {text.description}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Field
                                    component={SelectField}
                                    disabled={disabled}
                                    name="securityPolicy"
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
                            <Grid item xs={12} style={{
                                padding: 24,
                                backgroundColor: 'rgba(0,0,0,0.05)'
                            }}>
                                <Typography variant="h6" style={{ marginTop: -8 }}>
                                    {text.selectedTitle}
                                </Typography>
                                <Grid container spacing={8} style={{ marginTop: 8 }}>
                                    <Grid item xs={2}><b>Name (ID):</b></Grid>
                                    <FormValuesContextConsumer>
                                        {({formValues}) => (
                                            <Grid item xs={10}>
                                                {renderPolicyDesc(formValues.get('securityPolicy'))}
                                            </Grid>
                                        )}
                                    </FormValuesContextConsumer>
                                </Grid>
                            </Grid>
                        </Grid>
                        {
                            securityType !== RECORD_TYPE_COMMUNITY &&
                            <Grid container spacing={8} style={{ marginTop: 16 }}>
                                <Grid item xs={12}>
                                    <Field
                                        component={SelectField}
                                        disabled={disabled}
                                        name="datastreamSecurityPolicy"
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
                                <Grid item xs={12} style={{
                                    marginTop: 24,
                                    padding: 24,
                                    backgroundColor: 'rgba(0,0,0,0.05)'
                                }}>
                                    <Typography variant="h6" style={{ marginTop: -8 }}>
                                        {text.dataStreamSelectedTitle}
                                    </Typography>
                                    <Grid container spacing={8} style={{ marginTop: 8 }}>
                                        <Grid item xs={2}><b>Name (ID):</b></Grid>
                                        <FormValuesContextConsumer>
                                            {({formValues}) => (
                                                <Grid item xs={10}>
                                                    {renderPolicyDesc(formValues.get('datastreamSecurityPolicy'))}
                                                </Grid>
                                            )}
                                        </FormValuesContextConsumer>
                                    </Grid>
                                </Grid>
                            </Grid>
                        }
                    </StandardCard>
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
