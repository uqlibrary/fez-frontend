import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';

import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { useFormValuesContext, useRecordContext } from 'context';
import { RECORD_TYPE_COLLECTION, RECORD_TYPE_COMMUNITY } from 'config/general';
import SecurityCard from './SecurityCard';

import { validation } from 'config';
import { locale } from 'locale';


const text = locale.components.securitySection;

export const SecuritySection = ({ disabled }) => {
    const { formValues } = useFormValuesContext();
    const { record } = useRecordContext();

    const isPolicyInherited = record.rek_security_inherited === 1;
    const recordType = record.rek_object_type_lookup.toLowerCase();

    const accessLevel = formValues.accessLevel;

    let canEdit = false;
    switch(recordType) {
        case RECORD_TYPE_COLLECTION:
        case RECORD_TYPE_COMMUNITY:
            canEdit = accessLevel === 'Superadmin';
            break;
        default:
            canEdit = ['Admin', 'Superadmin'].indexOf(accessLevel) > -1;
    }

    return (
        <Grid container spacing={16}>
            <Grid item xs={12} sm={12}>
                <Field
                    component={SelectField}
                    name="securitySection.accessLevel"
                    label={text.admin.field.label}
                    disabled={disabled}
                    required
                    validation={[validation.required]}
                >
                    <MenuItem value="Superadmin">
                        {text.admin.field.menuItemText.superAdmin}
                    </MenuItem>
                    <MenuItem value="Admin">
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
            {
                canEdit &&
                <Grid item xs={12}>
                    <SecurityCard
                        disabled={disabled}
                        text={text[recordType]}
                        recordType={recordType}
                        isPolicyInherited={isPolicyInherited}
                    />
                </Grid>
            }
        </Grid>
    );
};

SecuritySection.propTypes = {
    disabled: PropTypes.bool
};

function isSame(prevProps, nextProps) {
    return prevProps.disabled === nextProps.disabled;
}

export default React.memo(SecuritySection, isSame);
