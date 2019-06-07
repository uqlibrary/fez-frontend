import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/lib/immutable';

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

    const dataStreams = (
        !!formValues.get('dataStreams').toJS &&
        formValues.get('dataStreams').toJS()
    ) || formValues.get('dataStreams');

    const isOverrideSecurityNotChecked = formValues.get('rek_security_inherited') !== 0;
    const securityPolicy = formValues.get('rek_security_policy');
    const dataStreamPolicy = formValues.get('rek_datastream_policy');

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
                    {
                        recordType === RECORD_TYPE_RECORD &&
                        <Grid item xs={12}>
                            <Field
                                component={OverrideSecurity}
                                name="rek_security_inherited"
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
                            : <SecuritySelector
                                disabled={disabled}
                                text={text}
                                fieldName="rek_security_policy"
                                recordType={recordType}
                                securityPolicy={securityPolicy}
                            />
                    }
                    {
                        recordType === RECORD_TYPE_COLLECTION &&
                        <SecuritySelector
                            disabled={disabled}
                            text={{
                                prompt: text.prompt,
                                selectedTitle: text.dataStreamSelectedTitle
                            }}
                            fieldName="rek_datastream_policy"
                            recordType={recordType}
                            securityPolicy={dataStreamPolicy}
                        />
                    }
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                {
                    dataStreams.length > 0 &&
                    <StandardCard title={<span><b>Datastream</b> security - {record.rek_pid}</span>} accentHeader>
                        <Grid container spacing={8}>
                            {
                                dataStreams.length &&
                                <Grid item xs={12}>
                                    <Field
                                        component={DataStreamSecuritySelector}
                                        name="dataStreams"
                                        {...{
                                            disabled,
                                            text: text.dataStream,
                                        }}
                                    />
                                </Grid>
                            }
                        </Grid>
                    </StandardCard>
                }
            </Grid>
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

