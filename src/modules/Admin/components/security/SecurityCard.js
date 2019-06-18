import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import { RECORD_TYPE_COLLECTION, RECORD_TYPE_RECORD } from 'config/general';
import { useRecordContext, useFormValuesContext } from 'context';

import OverrideSecurity from './OverrideSecurity';
import InheritedSecurityDetails from './InheritedSecurityDetails';
import DataStreamSecuritySelector from './DataStreamSecuritySelector';
import SecuritySelector from './SecuritySelector';

export const SecurityCard = ({ disabled, text, recordType, isPolicyInherited }) => {
    const { record } = useRecordContext();
    const { formValues } = useFormValuesContext();

    const dataStreams = !!(formValues.dataStreams || {}).toJS ? formValues.dataStreams.toJS() : formValues.dataStreams;
    const isOverrideSecurityNotChecked = formValues.rek_security_inherited !== 0;
    const securityPolicy = formValues.rek_security_policy;
    const dataStreamPolicy = formValues.rek_datastream_policy;

    const title = (
        <span>
            <b>{recordType}</b> level security - {record.rek_pid}
        </span>
    );

    /* istanbul ignore next */
    /**
     * Redux-form normalize callback
     */
    const overrideSecurityValueNormalizer = (value) => value ? 0 : 1;

    return (
        <Grid container spacing={16}>
            <Grid item xs={12}>
                <StandardCard title={title} accentHeader>
                    <Grid container spacing={16}>
                        {
                            recordType === RECORD_TYPE_RECORD &&
                            <Grid item xs={12}>
                                <Field
                                    component={OverrideSecurity}
                                    name="securitySection.rek_security_inherited"
                                    label="Override inherited security (detailed below)"
                                    normalize={overrideSecurityValueNormalizer}
                                />
                            </Grid>
                        }
                        {
                            (
                                isPolicyInherited &&
                                isOverrideSecurityNotChecked &&
                                recordType === RECORD_TYPE_RECORD
                            )
                                ? <InheritedSecurityDetails
                                    collections={record.fez_record_search_key_ismemberof}
                                />
                                : <Grid item xs={12}>
                                    <SecuritySelector
                                        disabled={disabled}
                                        text={text}
                                        fieldName="securitySection.rek_security_policy"
                                        recordType={recordType}
                                        securityPolicy={securityPolicy}
                                    />
                                </Grid>
                        }
                        {
                            recordType === RECORD_TYPE_COLLECTION &&

                            <Grid item xs={12}>
                                <SecuritySelector
                                    disabled={disabled}
                                    text={{
                                        prompt: text.prompt,
                                        selectedTitle: text.dataStreamSelectedTitle
                                    }}
                                    fieldName="securitySection.rek_datastream_policy"
                                    recordType={recordType}
                                    securityPolicy={dataStreamPolicy}
                                />
                            </Grid>
                        }
                    </Grid>
                </StandardCard>
            </Grid>
            {
                !!dataStreams && dataStreams.length > 0 &&
                <Grid item xs={12}>
                    <StandardCard title={<span><b>Datastream</b> security - {record.rek_pid}</span>} accentHeader>
                        <Grid container spacing={8}>
                            {
                                dataStreams.length &&
                                <Grid item xs={12}>
                                    <Field
                                        component={DataStreamSecuritySelector}
                                        name="securitySection.dataStreams"
                                        {...{
                                            disabled,
                                            text: text.dataStream,
                                        }}
                                    />
                                </Grid>
                            }
                        </Grid>
                    </StandardCard>
                </Grid>
            }
        </Grid>
    );
};

SecurityCard.propTypes = {
    disabled: PropTypes.bool,
    text: PropTypes.object,
    recordType: PropTypes.string.isRequired,
    isPolicyInherited: PropTypes.bool
};

export default React.memo(SecurityCard);

