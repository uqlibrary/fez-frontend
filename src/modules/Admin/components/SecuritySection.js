import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/lib/immutable';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';

import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { FormValuesContextConsumer } from 'context';

import SecurityCard, { renderPolicyDesc, renderPolicyItems } from './SecurityCard';
import { securityAssignments } from './MockData';

import { validation } from 'config';
import { TOP_LEVEL_SECURITY_POLICIES, DATA_STREAM_SECURITY_POLICIES } from 'config/general';
import { locale } from 'locale';

const text = locale.components.securitySection;

export const SecuritySection = ({ disabled, handleSubmit }) => {
    const [collectionSecurity, setCollectionSecurity] = useState(false);
    const [overrideSecurity, setOverrideSecurity] = useState(false);
    const [overrideDatastreamSecurity, setOverrideDatastreamSecurity] = useState(false);
    const handleSecurity = (handler, security) => () => handler(!security);

    const securityCommunity = {
        ...securityAssignments[0]
    };

    return (
        <React.Fragment>
            <Grid container spacing={16}>
                <Grid item xs={12} sm={12}>
                    <Field
                        component={SelectField}
                        name="level"
                        label={text.admin.field.label}
                        disabled={disabled}
                        required
                        validation={[validation.required]}
                    >
                        <MenuItem value="Superadmin" >
                            {text.admin.field.menuItemText.superAdmin}
                        </MenuItem>
                        <MenuItem value="Admin" >
                            {text.admin.field.menuItemText.admin}
                        </MenuItem>
                    </Field>
                    <br /><br />
                    <Field
                        component={SelectField}
                        name="type"
                        label={text.admin.typeField.label}
                        disabled={disabled}
                        required
                        validation={[validation.required]}
                    >
                        <MenuItem value="community" >
                            {text.admin.typeField.menuItemText.community}
                        </MenuItem>
                        <MenuItem value="collection" >
                            {text.admin.typeField.menuItemText.collection}
                        </MenuItem>
                        <MenuItem value="record" >
                            {text.admin.typeField.menuItemText.record}
                        </MenuItem>
                        <MenuItem value="dataStream" >
                            {text.admin.typeField.menuItemText.dataStream}
                        </MenuItem>
                    </Field>
                    <br /><br />
                    <Alert
                        type="warning"
                        title={text.admin.warning.title}
                        message={text.admin.warning.message}
                    />
                    <br /><br />
                </Grid>
            </Grid>
            <FormValuesContextConsumer>
                {({ formValues }) => (
                    <React.Fragment>
                        {
                            formValues.get('level') === 'Superadmin' &&
                            formValues.get('type') === 'community' &&
                            <Grid item xs={12}>
                                <br /><br />
                                <SecurityCard
                                    disabled={disabled}
                                    selectedPolicyKey={formValues.get('communitySecurity')}
                                    entity={securityCommunity}
                                    text={text.community}
                                    fieldID={'communitySecurity'}
                                />
                            </Grid>
                        }
                        {
                            formValues.get('level') === 'Superadmin' &&
                            formValues.get('type') === 'collection' &&
                            <Grid item xs={12}>
                                <StandardCard title={<span><b>Collection</b> level security - UQ:12345</span>} accentHeader>
                                    <Grid container spacing={8}>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" component="p">
                                                {text.collection.description}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field
                                                component={SelectField}
                                                disabled={disabled}
                                                name="collectionSecurity"
                                                label="Collection policy to apply to this PID"
                                                required
                                                validation={[validation.required]}
                                            >
                                                <MenuItem value="" disabled>
                                                    {text.collection.prompt}
                                                </MenuItem>
                                                {renderPolicyItems()}
                                            </Field>
                                        </Grid>
                                        {
                                            formValues.get('collectionSecurity') &&
                                            <Grid item xs={12} style={{
                                                marginTop: 24,
                                                padding: 24,
                                                backgroundColor: 'rgba(0,0,0,0.05)'
                                            }}>
                                                <Typography variant="h6" style={{ marginTop: -8 }}>
                                                    {text.collection.selectedTitle}
                                                </Typography>
                                                <Grid container spacing={8} style={{ marginTop: 8 }}>
                                                    <Grid item xs={2}><b>Name (ID):</b></Grid>
                                                    <Grid item xs={10}>
                                                        {renderPolicyDesc(formValues.get('collectionSecurity'))}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        }
                                    </Grid>

                                    <Grid container spacing={8} style={{ marginTop: 16 }}>
                                        <Grid item xs={12}>
                                            <Field
                                                component={SelectField}
                                                disabled={disabled}
                                                name="collectionDataSecurity"
                                                label={text.collection.dataStreamFieldLabel}
                                                required
                                                validation={[validation.required]}
                                            >
                                                <MenuItem value="" disabled>
                                                    {text.collection.prompt}
                                                </MenuItem>
                                                {renderPolicyItems()}
                                            </Field>
                                        </Grid>
                                        {
                                            formValues.get('collectionDataSecurity') &&
                                            <Grid item xs={12} style={{
                                                marginTop: 24,
                                                padding: 24,
                                                backgroundColor: 'rgba(0,0,0,0.05)'
                                            }}>
                                                <Typography variant="h6" style={{ marginTop: -8 }}>
                                                    {text.collection.dataStreamSelectedTitle}
                                                </Typography>
                                                <Grid container spacing={8} style={{ marginTop: 8 }}>
                                                    <Grid item xs={2}><b>Name (ID):</b></Grid>
                                                    <Grid item xs={10}>
                                                        {renderPolicyDesc(formValues.get('collectionDataSecurity'))}
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        }
                                    </Grid>
                                </StandardCard>
                            </Grid>
                        }
                        {
                            formValues.get('collectionDataSecurity') &&
                            formValues.get('type') === 'collection' &&
                            <Grid item xs={12}>
                                <StandardCard title={<span><b>Datastream</b> security - UQ:12345</span>} accentHeader>
                                    <Grid container spacing={8}>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" component="p">
                                                {text.collection.prompt}
                                            </Typography>
                                        </Grid>
                                        <Grid container spacing={8}>
                                            <Grid item xs={12}>
                                                <FormControlLabel
                                                    control={<Checkbox
                                                        checked={overrideSecurity}
                                                        onChange={handleSecurity(setOverrideSecurity, overrideSecurity)}
                                                    />}
                                                    label="Override inherited security (detailed below)."
                                                />
                                            </Grid>
                                        </Grid>
                                        {
                                            formValues.get('collectionDataSecurity') && !overrideSecurity ?
                                                <Grid item xs={12} style={{
                                                    marginTop: 24,
                                                    padding: 24,
                                                    backgroundColor: 'rgba(0,0,0,0.05)'
                                                }}>
                                                    <Typography variant="h6" style={{ marginTop: -8 }}>
                                                        Inherited security policy details
                                                    </Typography>
                                                    <Grid container spacing={8} style={{ marginTop: 8 }}>
                                                        <Grid item xs={2}><b>Collection:</b></Grid>
                                                        <Grid item xs={5}>UQ:12345</Grid>
                                                        <Grid item xs={5}>UQ:67890</Grid>
                                                        <Grid item xs={2}><b>Policy:</b></Grid>
                                                        <Grid item xs={5}>{renderPolicyDesc(2)}</Grid>
                                                        <Grid item xs={5}>{renderPolicyDesc(3)}</Grid>
                                                        <Grid item xs={2}><b>Description:</b></Grid>
                                                        <Grid item xs={5}>{TOP_LEVEL_SECURITY_POLICIES[1].description}</Grid>
                                                        <Grid item xs={5}>{TOP_LEVEL_SECURITY_POLICIES[2].description}</Grid>
                                                    </Grid>
                                                </Grid>
                                                :
                                                <Grid item xs={12} style={{
                                                    marginTop: 24,
                                                    padding: 24,
                                                    backgroundColor: 'rgba(0,0,0,0.05)'
                                                }}>
                                                    <Typography variant="h6" style={{ marginTop: -8 }}>
                                                        Override datastream security policy details
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
                                                                value={formValues.get('filePolicy1')}
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
                            </Grid>
                        }
                        {   formValues.get('level') &&
                            formValues.get('type') === 'record' &&
                            <Grid item xs={12}>
                                <StandardCard title={<span><b>Record</b> level security - UQ:12345</span>} accentHeader>
                                    {formValues.get('collectionSecurity') &&
                                        <Grid container spacing={8}>
                                            <Grid item xs={12}>
                                                <FormControlLabel
                                                    control={<Checkbox
                                                        checked={collectionSecurity}
                                                        onChange={handleSecurity(setCollectionSecurity, collectionSecurity)}
                                                    />}
                                                    label="Override inherited security (detailed below)."
                                                />
                                            </Grid>
                                        </Grid>
                                    }
                                    {!collectionSecurity && formValues.get('collectionSecurity')
                                        ?
                                        <Grid item xs={12} style={{
                                            padding: 24,
                                            backgroundColor: 'rgba(0,0,0,0.05)'
                                        }}>
                                            <Typography variant="h6" style={{ marginTop: -8 }}>
                                                Inherited security policy details
                                            </Typography>
                                            <Grid container spacing={8} style={{ marginTop: 8 }}>
                                                <Grid item xs={2}><b>Collection:</b></Grid>
                                                <Grid item xs={5}>UQ:12345</Grid>
                                                <Grid item xs={5}>UQ:67890</Grid>
                                                <Grid item xs={2}><b>Policy:</b></Grid>
                                                <Grid item xs={5}>{renderPolicyDesc(2)}</Grid>
                                                <Grid item xs={5}>{renderPolicyDesc(3)}</Grid>
                                            </Grid>
                                        </Grid>
                                        :
                                        <React.Fragment>
                                            <Grid item xs={12}>
                                                <Field
                                                    component={SelectField}
                                                    disabled={disabled}
                                                    name="overrideSecurity"
                                                    label="Policy to apply to override this PID`s inherited security"
                                                    required
                                                    validation={[validation.required]}
                                                >
                                                    <MenuItem value="" disabled>
                                                        Select a security policy to apply
                                                    </MenuItem>
                                                    {renderPolicyItems()}
                                                </Field>
                                            </Grid>
                                            {
                                                formValues.get('overrideSecurity') &&
                                                <Grid item xs={12} style={{
                                                    padding: 24,
                                                    backgroundColor: 'rgba(0,0,0,0.05)'
                                                }}>
                                                    <Typography variant="h6" style={{ marginTop: -8 }}>
                                                        Selected record level security policy details
                                                    </Typography>
                                                    <Grid container spacing={8} style={{ marginTop: 8 }}>
                                                        <Grid item xs={2}><b>Name (ID):</b></Grid>
                                                        <Grid item xs={10}>
                                                            {renderPolicyDesc(formValues.get('overrideSecurity'))}
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            }
                                            <Grid item>
                                                <FormControlLabel
                                                    control={<Checkbox
                                                        checked={overrideDatastreamSecurity}
                                                        onChange={
                                                            handleSecurity(
                                                                setOverrideDatastreamSecurity,
                                                                overrideDatastreamSecurity
                                                            )
                                                        }
                                                    />}
                                                    label="Override inherited datastream security (detailed below)."
                                                />
                                                {
                                                    overrideDatastreamSecurity &&
                                                    <Field
                                                        component={SelectField}
                                                        name="overridePidDatastreamSecurity"
                                                        value={formValues.get('overridePidDatastreamSecurity')}
                                                        label="Datasteam policy"
                                                        required
                                                        validation={[validation.required]}
                                                    >
                                                        <MenuItem value="" disabled>
                                                            Select a security policy to apply to this PIDs datastream
                                                        </MenuItem>
                                                        {renderPolicyItems(DATA_STREAM_SECURITY_POLICIES)}
                                                    </Field>
                                                }
                                                {
                                                    formValues.get('overridePidDatastreamSecurity') &&
                                                    <Grid item xs={12} style={{
                                                        padding: 24,
                                                        backgroundColor: 'rgba(0,0,0,0.05)'
                                                    }}>
                                                        <Typography variant="h6" style={{ marginTop: -8 }}>
                                                            Selected record level datastream security policy details
                                                        </Typography>
                                                        <Grid container spacing={8} style={{ marginTop: 8 }}>
                                                            <Grid item xs={2}><b>Name (ID):</b></Grid>
                                                            <Grid item xs={10}>
                                                                {renderPolicyDesc(
                                                                    formValues.get('overridePidDatastreamSecurity'),
                                                                    DATA_STREAM_SECURITY_POLICIES
                                                                )}
                                                            </Grid>
                                                        </Grid>
                                                    </Grid>
                                                }
                                            </Grid>
                                        </React.Fragment>
                                    }
                                </StandardCard>
                            </Grid>
                        }
                        {
                            formValues.get('level') &&
                            formValues.get('type') &&
                            <Grid item xs={12} sm="auto">
                                <Button
                                    style={{whiteSpace: 'nowrap'}}
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    children={text.submit}
                                    onClick={handleSubmit}
                                />
                            </Grid>
                        }
                    </React.Fragment>
                )}
            </FormValuesContextConsumer>
        </React.Fragment>
    );
};

SecuritySection.propTypes = {
    disabled: PropTypes.bool,
    handleSubmit: PropTypes.func
};

export default React.memo(SecuritySection);
