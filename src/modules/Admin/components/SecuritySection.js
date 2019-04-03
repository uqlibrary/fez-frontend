import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/lib/immutable';

import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';

import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { FormValuesContextConsumer } from 'context';
import SecurityCard from './SecurityCard';

import { validation } from 'config';
import { locale } from 'locale';

const text = locale.components.securitySection;

export const SecuritySection = ({ disabled, handleSubmit, recordType }) => {
    return (
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
            </Grid>
            <Grid item xs={12} sm={12}>
                <Alert
                    type="warning"
                    title={text.admin.warning.title}
                    message={text.admin.warning.message}
                />
            </Grid>
            <FormValuesContextConsumer>
                {({ formValues }) => (
                    <React.Fragment>
                        {
                            formValues.get('level') === 'Superadmin' &&
                            <Grid item xs={12}>
                                <SecurityCard
                                    disabled={disabled}
                                    text={text[recordType.toLowerCase()]}
                                />
                            </Grid>
                        }
                        {
                            formValues.get('level') &&
                            <Grid item xs={12} sm={12}>
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
        </Grid>
    );
};

SecuritySection.propTypes = {
    disabled: PropTypes.bool,
    recordType: PropTypes.string,
    handleSubmit: PropTypes.func
};

export default React.memo(SecuritySection);
