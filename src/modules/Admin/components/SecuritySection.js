import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {Field} from 'redux-form/lib/immutable';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';

import FormControlLabel from '@material-ui/core/FormControlLabel/FormControlLabel';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {SelectField} from 'modules/SharedComponents/Toolbox/SelectField';
import {Alert} from 'modules/SharedComponents/Toolbox/Alert';
import {FormValuesContextConsumer} from 'context';

import {validation} from 'config';

const communitySecurity = [
    {value: 'A', label: 'Policy A', id: 'PolicyAID', name: 'Policy A', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id aliquam sapien. Aliquam rhoncus congue consectetur. Aenean sed sapien ipsum. Sed lectus mauris, mollis et dolor vitae, rutrum lobortis risus. Aenean a nisl non felis pretium tincidunt id sit amet augue. Aenean ac quam non libero malesuada vulputate. Integer commodo lacus quis egestas varius. Etiam dapibus mollis feugiat. Aliquam pellentesque nunc ac libero feugiat laoreet. In hac habitasse platea dictumst. Duis sagittis lorem id vestibulum maximus. Nullam vel libero eu eros faucibus venenatis. Vestibulum interdum porttitor ipsum sed fringilla. Sed enim lacus, faucibus vel tincidunt euismod, euismod vitae turpis.'},
    {value: 'B', label: 'Policy B', id: 'PolicyBID', name: 'Policy B', description: 'Suspendisse pellentesque libero eget molestie vehicula. Vestibulum eget purus euismod, imperdiet massa non, vulputate lectus. Sed mi mi, placerat ultricies purus nec, sollicitudin fringilla odio. Aliquam erat volutpat. Vestibulum at augue sed arcu condimentum finibus id et dolor.'},
    {value: 'C', label: 'Policy C', id: 'PolicyCID', name: 'Policy C', description: 'Mauris pulvinar tortor eu lectus facilisis, ut ultricies risus elementum. Aenean ac sem quis enim molestie egestas ut id sem. Nulla nibh elit, efficitur fermentum nisl et, semper ultrices quam. Aenean in sollicitudin mi. Cras ultricies eros quis maximus pellentesque. Mauris justo mi, aliquet vitae nisl et, tristique pulvinar risus.'},
];

const pidDatastreamSecurity = [
    {value: 'A', label: 'Policy A', id: 'PolicyAID', name: 'Policy A', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut id aliquam sapien. Aliquam rhoncus congue consectetur. Aenean sed sapien ipsum. Sed lectus mauris, mollis et dolor vitae, rutrum lobortis risus. Aenean a nisl non felis pretium tincidunt id sit amet augue. Aenean ac quam non libero malesuada vulputate. Integer commodo lacus quis egestas varius. Etiam dapibus mollis feugiat. Aliquam pellentesque nunc ac libero feugiat laoreet. In hac habitasse platea dictumst. Duis sagittis lorem id vestibulum maximus. Nullam vel libero eu eros faucibus venenatis. Vestibulum interdum porttitor ipsum sed fringilla. Sed enim lacus, faucibus vel tincidunt euismod, euismod vitae turpis.'},
    {value: 'B', label: 'Policy B', id: 'PolicyBID', name: 'Policy B', description: 'Suspendisse pellentesque libero eget molestie vehicula. Vestibulum eget purus euismod, imperdiet massa non, vulputate lectus. Sed mi mi, placerat ultricies purus nec, sollicitudin fringilla odio. Aliquam erat volutpat. Vestibulum at augue sed arcu condimentum finibus id et dolor.'},
    {value: 'C', label: 'Policy C', id: 'PolicyCID', name: 'Policy C', description: 'Mauris pulvinar tortor eu lectus facilisis, ut ultricies risus elementum. Aenean ac sem quis enim molestie egestas ut id sem. Nulla nibh elit, efficitur fermentum nisl et, semper ultrices quam. Aenean in sollicitudin mi. Cras ultricies eros quis maximus pellentesque. Mauris justo mi, aliquet vitae nisl et, tristique pulvinar risus.'},
];

const findWithAttr = (array, attr, value) => {
    for(let i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
};

export const SecuritySection = ({disabled}) => {
    const [collectionSecurity, setCollectionSecurity] = useState(false);
    const [overrideSecurity, setOverrideSecurity] = useState(false);
    const [overrideDatastreamSecurity, setOverrideDatastreamSecurity] = useState(false);
    const handleSecurity = (handler, security) => () => handler(!security);

    return (
        <React.Fragment>
            <Grid container spacing={16}>
                <Grid item xs={12} sm={12}>
                    <Field
                        component={SelectField}
                        name="level"
                        label="Use this interface as a..."
                        disabled={disabled}
                        required
                        validation={[validation.required]}>
                        <MenuItem value="Superadmin" >Super admin</MenuItem>
                        <MenuItem value="Admin" >Admin</MenuItem>
                    </Field>
                    <br/><br/>
                    <Alert type="warning" title="Warning" message="This section is to be handled by admins only - changes made to these sections may inadvertantly hide or show records in error - please make sure you know what you`re doing." />
                </Grid>
            </Grid>
            <FormValuesContextConsumer>
                {({formValues}) => (
                    <React.Fragment>
                        {formValues.get('level') === 'Superadmin' &&
                            <Grid item xs={12}>
                                <StandardCard title={<span><b>Community</b> level security - UQ:12345</span>} accentHeader>
                                    <Grid container spacing={8}>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" component="p">Lorem ipsum dolor sit
                                                amet, consectetur adipiscing elit. Ut id aliquam sapien. Aliquam
                                                rhoncus congue consectetur. Aenean sed sapien
                                                ipsum.</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field
                                                component={SelectField}
                                                disabled={disabled}
                                                name="communitySecurity"
                                                label="Community policy to apply to this PID"
                                                required
                                                validation={[validation.required]}>
                                                <MenuItem value="" disabled>Select a security policy to
                                                    apply</MenuItem>
                                                {communitySecurity.map((item, index) => {
                                                    return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                })}
                                            </Field>
                                        </Grid>
                                        {
                                            formValues.get('communitySecurity') &&
                                            <Grid item xs={12} style={{
                                                marginTop: 24,
                                                padding: 24,
                                                backgroundColor: 'rgba(0,0,0,0.05)'
                                            }}>
                                                <Typography variant="h6" style={{marginTop: -8}}>Selected
                                                    community record security policy details</Typography>
                                                <Grid container spacing={8} style={{marginTop: 8}}>
                                                    <Grid item xs={2}><b>Name (ID):</b></Grid>
                                                    <Grid item xs={10}>{communitySecurity[findWithAttr(communitySecurity, 'value', formValues.get('communitySecurity'))].name} ({communitySecurity[findWithAttr(communitySecurity, 'value', formValues.get('communitySecurity'))].id})</Grid>
                                                </Grid>
                                            </Grid>
                                        }
                                    </Grid>
                                </StandardCard>
                            </Grid>
                        }
                        {formValues.get('level') === 'Superadmin' &&
                            <Grid item xs={12}>
                                <StandardCard title={<span><b>Collection</b> level security - UQ:12345</span>} accentHeader>
                                    <Grid container spacing={8}>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" component="p">Lorem ipsum dolor sit
                                                amet, consectetur adipiscing elit. Ut id aliquam sapien. Aliquam
                                                rhoncus congue consectetur. Aenean sed sapien
                                                ipsum.</Typography>
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Field
                                                component={SelectField}
                                                disabled={disabled}
                                                name="collectionSecurity"
                                                label="Collection policy to apply to this PID"
                                                required
                                                validation={[validation.required]}>
                                                <MenuItem value="" disabled>Select a security policy to
                                                    apply</MenuItem>
                                                {communitySecurity.map((item, index) => {
                                                    return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                })}
                                            </Field>
                                        </Grid>
                                        {
                                            formValues.get('collectionSecurity') &&
                                            <Grid item xs={12} style={{
                                                marginTop: 24,
                                                padding: 24,
                                                backgroundColor: 'rgba(0,0,0,0.05)'
                                            }}>
                                                <Typography variant="h6" style={{marginTop: -8}}>Selected
                                                    collection record security policy details</Typography>
                                                <Grid container spacing={8} style={{marginTop: 8}}>
                                                    <Grid item xs={2}><b>Name (ID):</b></Grid>
                                                    <Grid item xs={10}>{communitySecurity[findWithAttr(communitySecurity, 'value', formValues.get('collectionSecurity'))].name} ({communitySecurity[findWithAttr(communitySecurity, 'value', formValues.get('collectionSecurity'))].id})</Grid>
                                                </Grid>
                                            </Grid>
                                        }
                                    </Grid>

                                    <Grid container spacing={8} style={{marginTop: 16}}>
                                        {false &&
                                            <Grid item xs={12}>
                                                <Field
                                                    component={SelectField}
                                                    disabled={disabled}
                                                    name="collectionDataSecurity"
                                                    label={<span>Collection policy to apply to the <b>datastream</b> of this PID</span>}
                                                    required
                                                    validation={[validation.required]}>
                                                    <MenuItem value="" disabled>Select a security policy to
                                                        apply</MenuItem>
                                                    {communitySecurity.map((item, index) => {
                                                        return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                    })}
                                                </Field>
                                            </Grid>
                                        }
                                        {
                                            formValues.get('collectionDataSecurity') &&
                                            <Grid item xs={12} style={{
                                                marginTop: 24,
                                                padding: 24,
                                                backgroundColor: 'rgba(0,0,0,0.05)'
                                            }}>
                                                <Typography variant="h6" style={{marginTop: -8}}>Selected collection <b>datastream</b> security policy details</Typography>
                                                <Grid container spacing={8} style={{marginTop: 8}}>
                                                    <Grid item xs={2}><b>Name (ID):</b></Grid>
                                                    <Grid item xs={10}>{communitySecurity[findWithAttr(communitySecurity, 'value', formValues.get('collectionDataSecurity'))].name} ({communitySecurity[findWithAttr(communitySecurity, 'value', formValues.get('collectionDataSecurity'))].id})</Grid>
                                                </Grid>
                                            </Grid>
                                        }
                                    </Grid>
                                </StandardCard>
                            </Grid>
                        }
                        {formValues.get('collectionDataSecurity') &&
                            <Grid item xs={12}>
                                <StandardCard title={
                                    <span><b>Datastream</b> security - UQ:12345</span>} accentHeader>
                                    <Grid container spacing={8}>
                                        <Grid item xs={12}>
                                            <Typography variant="body2" component="p">Lorem ipsum
                                                dolor
                                                sit amet, consectetur adipiscing elit. Ut id aliquam
                                                sapien.
                                                Aliquam rhoncus congue consectetur. Aenean sed sapien
                                                ipsum.</Typography>
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
                                                <Grid item xs={12} style={{marginTop: 24, padding: 24, backgroundColor: 'rgba(0,0,0,0.05)'}}>
                                                    <Typography variant="h6" style={{marginTop: -8}}>Inherited security policy details</Typography>
                                                    <Grid container spacing={8} style={{marginTop: 8}}>
                                                        <Grid item xs={2}><b>Collection:</b></Grid>
                                                        <Grid item xs={5}>UQ:12345</Grid>
                                                        <Grid item xs={5}>UQ:67890</Grid>
                                                        <Grid item xs={2}><b>Policy:</b></Grid>
                                                        <Grid item xs={5}>{communitySecurity[1].name} ({communitySecurity[1].id})</Grid>
                                                        <Grid item xs={5}>{communitySecurity[2].name} ({communitySecurity[2].id})</Grid>
                                                        <Grid item xs={2}><b>Description:</b></Grid>
                                                        <Grid item xs={5}>{communitySecurity[1].description}</Grid>
                                                        <Grid item xs={5}>{communitySecurity[2].description}</Grid>
                                                    </Grid>
                                                </Grid>
                                                :
                                                <Grid item xs={12} style={{marginTop: 24, padding: 24, backgroundColor: 'rgba(0,0,0,0.05)'}}>
                                                    <Typography variant="h6" style={{marginTop: -8}}>Override datastream security policy details</Typography>
                                                    <Grid container spacing={8} alignContent="flex-end" alignItems="flex-end" style={{borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: 8, paddingTop: 8}}>
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
                                                                validation={[validation.required]}>
                                                                {communitySecurity.map((item, index) => {
                                                                    return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                                })}
                                                            </Field>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid container spacing={8} alignContent="flex-end" alignItems="flex-end" style={{borderBottom: '1px solid rgba(0,0,0,0.1)', paddingBottom: 8, paddingTop: 8}}>
                                                        <Grid item xs={2}>Filename:</Grid>
                                                        <Grid item xs={4}>Test_3.JPG</Grid>
                                                        <Grid item xs={6}>
                                                            <Field
                                                                component={SelectField}
                                                                disabled={disabled}
                                                                name="filePolicy2"
                                                                label={<span>Security policy for this file to override inheritance</span>}
                                                                required
                                                                validation={[validation.required]}>
                                                                {communitySecurity.map((item, index) => {
                                                                    return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                                })}
                                                            </Field>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                        }
                                    </Grid>
                                </StandardCard>
                            </Grid>
                        }
                        {formValues.get('level') &&
                            <React.Fragment>
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
                                            <Grid item xs={12} style={{marginTop: 24, padding: 24, backgroundColor: 'rgba(0,0,0,0.05)'}}>
                                                <Typography variant="h6" style={{marginTop: -8}}>Inherited security policy details</Typography>
                                                <Grid container spacing={8} style={{marginTop: 8}}>
                                                    <Grid item xs={2}><b>Collection:</b></Grid>
                                                    <Grid item xs={5}>UQ:12345</Grid>
                                                    <Grid item xs={5}>UQ:67890</Grid>
                                                    <Grid item xs={2}><b>Policy:</b></Grid>
                                                    <Grid item xs={5}>{communitySecurity[1].name} ({communitySecurity[1].id})</Grid>
                                                    <Grid item xs={5}>{communitySecurity[2].name} ({communitySecurity[2].id})</Grid>
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
                                                        validation={[validation.required]}>
                                                        <MenuItem value="" disabled>Select a security
                                                            policy
                                                            to apply</MenuItem>
                                                        {communitySecurity.map((item, index) => {
                                                            return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                        })}
                                                    </Field>
                                                </Grid>
                                                {
                                                    formValues.get('overrideSecurity') &&
                                                        <Grid item xs={12} style={{
                                                            marginTop: 24,
                                                            padding: 24,
                                                            backgroundColor: 'rgba(0,0,0,0.05)'
                                                        }}>
                                                            <Typography variant="h6" style={{marginTop: -8}}>Selected
                                                                record level security policy
                                                                details</Typography>
                                                            <Grid container spacing={8} style={{marginTop: 8}}>
                                                                <Grid item xs={2}><b>Name (ID):</b></Grid>
                                                                <Grid item xs={10}>{communitySecurity[findWithAttr(communitySecurity, 'value', formValues.get('overrideSecurity'))].name} ({communitySecurity[findWithAttr(communitySecurity, 'value', formValues.get('overrideSecurity'))].id})</Grid>
                                                            </Grid>
                                                        </Grid>
                                                }
                                                <Grid item>
                                                    <FormControlLabel
                                                        control={<Checkbox
                                                            checked={overrideDatastreamSecurity}
                                                            onChange={handleSecurity(setOverrideDatastreamSecurity, overrideDatastreamSecurity)}
                                                        />}
                                                        label="Override inherited datastream security (detailed below)."
                                                    />
                                                    {
                                                        overrideDatastreamSecurity &&
                                                        <Field
                                                            component={SelectField}
                                                            name="ovveridePidDatastreamSecurity"
                                                            value={formValues.get('ovveridePidDatastreamSecurity')}
                                                            label="Datasteam policy"
                                                            required
                                                            validation={[validation.required]}>
                                                            <MenuItem value="" disabled>Select a security
                                                                policy to apply to this PIDs
                                                                datastream</MenuItem>
                                                            {pidDatastreamSecurity.map((item, index) => {
                                                                return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                                                            })}
                                                        </Field>
                                                    }
                                                    {
                                                        formValues.get('ovveridePidDatastreamSecurity') &&
                                                        <Grid item xs={12} style={{
                                                            marginTop: 24,
                                                            padding: 24,
                                                            backgroundColor: 'rgba(0,0,0,0.05)'
                                                        }}>
                                                            <Typography variant="h6" style={{marginTop: -8}}>Selected record level datastream security policy details</Typography>
                                                            <Grid container spacing={8} style={{marginTop: 8}}>
                                                                <Grid item xs={2}><b>Name (ID):</b></Grid>
                                                                <Grid item xs={10}>{pidDatastreamSecurity[findWithAttr(pidDatastreamSecurity, 'value', formValues.get('ovveridePidDatastreamSecurity'))].name} ({pidDatastreamSecurity[findWithAttr(pidDatastreamSecurity, 'value', formValues.get('ovveridePidDatastreamSecurity'))].id})</Grid>
                                                            </Grid>
                                                        </Grid>
                                                    }
                                                </Grid>
                                            </React.Fragment>
                                        }
                                    </StandardCard>
                                </Grid>
                            </React.Fragment>
                        }
                    </React.Fragment>
                )}
            </FormValuesContextConsumer>
        </React.Fragment>
    );
};

SecuritySection.propTypes = {
    disabled: PropTypes.bool
};

export default React.memo(SecuritySection);
