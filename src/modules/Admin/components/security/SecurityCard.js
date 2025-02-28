import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import Grid from '@mui/material/Unstable_Grid2';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import OverrideSecurity from './OverrideSecurity';
import InheritedSecurityDetails from './InheritedSecurityDetails';
import DataStreamSecuritySelector from './DataStreamSecuritySelector';
import SecuritySelector from './SecuritySelector';

import { useRecordContext, useFormValuesContext } from 'context';
import { RECORD_TYPE_COLLECTION, RECORD_TYPE_RECORD, RECORD_TYPE_COMMUNITY } from 'config/general';
import { locale } from 'locale';
import { publicationTypes } from 'config';
import * as recordForms from 'modules/SharedComponents/PublicationForm/components/Forms';

/**
 * Redux-form normalize callback
 */
export const overrideSecurityValueNormalizer = value => (value ? 0 : 1);

export const getRecordType = record =>
    (
        record.rek_object_type_lookup ||
        (record.rek_display_type && publicationTypes({ ...recordForms })[record.rek_display_type].name) ||
        ''
    ).toLowerCase() || null;

export const SecurityCard = ({ disabled, isSuperAdmin }) => {
    const { record } = useRecordContext();
    const { formValues } = useFormValuesContext();

    const recordType = getRecordType(record);
    const { ...rest } = locale.components.securitySection;
    const text = rest[recordType];

    const dataStreams = !!(formValues.dataStreams || {}).toJS ? formValues.dataStreams.toJS() : formValues.dataStreams;
    const isOverrideSecurityChecked = formValues.rek_security_inherited === 0;
    const securityPolicy = formValues.rek_security_policy;
    const dataStreamPolicy = formValues.rek_datastream_policy;

    return (
        <Grid container spacing={2}>
            <Grid xs={12}>
                <StandardCard
                    standardCardId="record-security-card"
                    title={text.cardTitle(record.rek_pid)}
                    accentHeader
                    subCard
                >
                    <Grid container spacing={2} padding={0}>
                        {recordType === RECORD_TYPE_RECORD && (
                            <React.Fragment>
                                <Grid xs={12}>
                                    <InheritedSecurityDetails
                                        title={text.inheritedPolicy.record.title}
                                        collections={record?.fez_record_search_key_ismemberof || []}
                                        parentKey="rek_security_policy"
                                    />
                                </Grid>
                                <Grid xs={12}>
                                    <Field
                                        component={OverrideSecurity}
                                        name="securitySection.rek_security_inherited"
                                        label="Override inherited security (detailed below)"
                                        normalize={overrideSecurityValueNormalizer}
                                        disabled={disabled}
                                        overrideSecurityId="rek-security-inherited"
                                    />
                                </Grid>
                            </React.Fragment>
                        )}
                        {(recordType === RECORD_TYPE_COMMUNITY ||
                            recordType === RECORD_TYPE_COLLECTION ||
                            (recordType === RECORD_TYPE_RECORD && isOverrideSecurityChecked)) && (
                            <Grid xs={12}>
                                <SecuritySelector
                                    disabled={disabled || (recordType === RECORD_TYPE_COLLECTION && !isSuperAdmin)}
                                    text={text}
                                    fieldName="securitySection.rek_security_policy"
                                    recordType={recordType}
                                    securityPolicy={securityPolicy}
                                    securitySelectorId="rek-security-policy"
                                />
                            </Grid>
                        )}
                        {recordType === RECORD_TYPE_COLLECTION && (
                            <Grid xs={12}>
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
                                    securitySelectorId="rek-datastream-policy"
                                />
                            </Grid>
                        )}
                    </Grid>
                </StandardCard>
            </Grid>
            {!!dataStreams && dataStreams.length > 0 && (
                <React.Fragment>
                    <Grid xs={12}>
                        <StandardCard
                            standardCardId="datastream-security-card"
                            title={text.dataStream.cardTitle(record.rek_pid)}
                            accentHeader
                            subCard
                        >
                            <Grid container spacing={1} padding={0}>
                                <Grid xs={12}>
                                    <InheritedSecurityDetails
                                        title={text.inheritedPolicy.dataStream.title}
                                        collections={record.fez_record_search_key_ismemberof}
                                        parentKey="rek_datastream_policy"
                                    />
                                </Grid>
                                <Grid xs={12}>
                                    <Field
                                        key={dataStreams.length}
                                        component={DataStreamSecuritySelector}
                                        name="securitySection.dataStreams"
                                        attachedDataStreams={dataStreams}
                                        {...{
                                            disabled,
                                            text: text.dataStream,
                                        }}
                                        collections={record.fez_record_search_key_ismemberof}
                                    />
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>
                </React.Fragment>
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
