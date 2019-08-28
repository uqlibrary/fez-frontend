import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import OverrideSecurity from './OverrideSecurity';
import InheritedSecurityDetails from './InheritedSecurityDetails';
import DataStreamSecuritySelector from './DataStreamSecuritySelector';
import SecuritySelector from './SecuritySelector';

import { useRecordContext, useFormValuesContext } from 'context';
import { RECORD_TYPE_COLLECTION, RECORD_TYPE_RECORD, RECORD_TYPE_COMMUNITY } from 'config/general';
import { locale } from 'locale';

export const SecurityCard = ({ disabled, isSuperAdmin }) => {
    const { record } = useRecordContext();
    const { formValues } = useFormValuesContext();

    const recordType = record.rek_object_type_lookup.toLowerCase();
    const { admin, ...rest } = locale.components.securitySection;
    const text = rest[recordType];

    const dataStreams = !!(formValues.dataStreams || {}).toJS ? formValues.dataStreams.toJS() : formValues.dataStreams;
    const isOverrideSecurityChecked = formValues.rek_security_inherited === 0;
    const securityPolicy = formValues.rek_security_policy;
    const dataStreamPolicy = formValues.rek_datastream_policy;

    /* istanbul ignore next */
    /**
     * Redux-form normalize callback
     */
    const overrideSecurityValueNormalizer = value => (value ? 0 : 1);
    return (
        <Grid container spacing={16}>
            <Grid item xs={12} sm={12}>
                <Alert type="warning" title={admin.warning.title} message={admin.warning.message} />
            </Grid>
            <Grid item xs={12}>
                <StandardCard title={text.cardTitle(record.rek_pid)} accentHeader>
                    <Grid container spacing={16}>
                        {recordType === RECORD_TYPE_RECORD && (
                            <React.Fragment>
                                <Grid item xs={12}>
                                    <InheritedSecurityDetails
                                        title={text.inheritedPolicy.record.title}
                                        collections={record.fez_record_search_key_ismemberof}
                                        parentKey="rek_security_policy"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        component={OverrideSecurity}
                                        name="securitySection.rek_security_inherited"
                                        label="Override inherited security (detailed below)"
                                        normalize={overrideSecurityValueNormalizer}
                                        disabled={disabled}
                                    />
                                </Grid>
                            </React.Fragment>
                        )}
                        {(recordType === RECORD_TYPE_COMMUNITY ||
                            recordType === RECORD_TYPE_COLLECTION ||
                            (recordType === RECORD_TYPE_RECORD && isOverrideSecurityChecked)) && (
                            <Grid item xs={12}>
                                <SecuritySelector
                                    disabled={disabled || (recordType === RECORD_TYPE_COLLECTION && !isSuperAdmin)}
                                    text={text}
                                    fieldName="securitySection.rek_security_policy"
                                    recordType={recordType}
                                    securityPolicy={securityPolicy}
                                />
                            </Grid>
                        )}
                        {recordType === RECORD_TYPE_COLLECTION && (
                            <Grid item xs={12}>
                                <SecuritySelector
                                    disabled={disabled || (recordType === RECORD_TYPE_COLLECTION && !isSuperAdmin)}
                                    text={{
                                        prompt: text.prompt,
                                        fieldLabel: text.dataStreamFieldLabel,
                                        selectedTitle: text.dataStreamSelectedTitle,
                                    }}
                                    fieldName="securitySection.rek_datastream_policy"
                                    recordType={recordType}
                                    securityPolicy={dataStreamPolicy}
                                />
                            </Grid>
                        )}
                    </Grid>
                </StandardCard>
            </Grid>
            {!!dataStreams && dataStreams.length > 0 && (
                <Grid item xs={12}>
                    <StandardCard title={text.dataStream.cardTitle(record.rek_pid)} accentHeader>
                        <Grid container spacing={8}>
                            {dataStreams.length && (
                                <React.Fragment>
                                    <Grid item xs={12}>
                                        <InheritedSecurityDetails
                                            title={text.inheritedPolicy.dataStream.title}
                                            collections={record.fez_record_search_key_ismemberof}
                                            parentKey="rek_datastream_policy"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Field
                                            component={DataStreamSecuritySelector}
                                            name="securitySection.dataStreams"
                                            {...{
                                                disabled,
                                                text: text.dataStream,
                                            }}
                                            collections={record.fez_record_search_key_ismemberof}
                                        />
                                    </Grid>
                                </React.Fragment>
                            )}
                        </Grid>
                    </StandardCard>
                </Grid>
            )}
        </Grid>
    );
};

SecurityCard.propTypes = {
    disabled: PropTypes.bool,
    isSuperAdmin: PropTypes.bool,
};

export function isSame(prevProps, nextProps) {
    return prevProps.disabled === nextProps.disabled && prevProps.isSuperAdmin === nextProps.isSuperAdmin;
}

export default React.memo(SecurityCard, isSame);
