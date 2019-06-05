import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/lib/immutable';

import Grid from '@material-ui/core/Grid';
import { Typography, Link } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import { RECORD_TYPE_COLLECTION, RECORD_TYPE_RECORD } from 'config/general';
import { RecordContext, FormValuesContext } from 'context';
import { viewRecordsConfig } from 'config';
import PolicyDropdown from './PolicyDropdown';
import { OverrideSecurity } from './OverrideSecurity';
import InheritedSecurityDetails from './InheritedSecurityDetails';
import SelectedSecurityPolicyDescription from './SelectedSecurityPolicyDescription';

export const isFileValid = (dataStream) => {
    const { files: { blacklist } } = viewRecordsConfig;

    return !dataStream.dsi_dsid.match(blacklist.namePrefixRegex) &&
        dataStream.dsi_state === 'A';
};

export const styles = () => ({
    dataStreamSecurity: {
        padding: '24px !important',
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    dataStreamFileBlock: {
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        paddingBottom: 8,
        paddingTop: 8,
    },
    dataStreamFileName: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
});

export const SecurityCard = ({
    disabled,
    text,
    classes,
}) => {
    const { record } = useContext(RecordContext);
    const { formValues } = useContext(FormValuesContext);

    const isOverrideSecurityNotChecked = formValues.get('rek_security_inherited') !== 0;
    const securityPolicy = formValues.get('rek_security_policy');
    const dataStreamPolicy = formValues.get('rek_datastream_policy');

    const securityType = record.rek_object_type_lookup;
    const dataStreams = (record.fez_datastream_info || []).filter(isFileValid);
    const hasDatastreams = dataStreams.length > 0;
    const isPolicyInherited = record.rek_security_inherited === 1;

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
                    {
                        (
                            isPolicyInherited &&
                            isOverrideSecurityNotChecked &&
                            securityType === RECORD_TYPE_RECORD
                        )
                            ? <InheritedSecurityDetails
                                collections={record.fez_record_search_key_ismemberof}
                            />
                            : <SecuritySelector
                                disabled={disabled}
                                text={text}
                                fieldName="rek_security_policy"
                                securityType={securityType}
                                securityPolicy={securityPolicy}
                            />
                    }
                    {
                        securityType === RECORD_TYPE_COLLECTION &&
                        <SecuritySelector
                            disabled={disabled}
                            text={{
                                prompt: text.prompt,
                                selectedTitle: text.dataStreamSelectedTitle
                            }}
                            fieldName="rek_datastream_policy"
                            securityType={securityType}
                            securityPolicy={dataStreamPolicy}
                        />
                    }
                </StandardCard>
            </Grid>
            <Grid item xs={12}>
                {
                    hasDatastreams &&
                    <StandardCard title={<span><b>Datastream</b> security - {record.rek_pid}</span>} accentHeader>
                        <Grid container spacing={8}>
                            {
                                dataStreams.length &&
                                <Grid item xs={12} className={classes.dataStreamSecurity}>
                                    <Typography variant="h6" style={{ marginTop: -8 }}>
                                        {text.dataStream.overridePrompt}
                                    </Typography>
                                    {dataStreams.map((dataStream, index) => (
                                        <DataStreamSecuritySelector
                                            {...{
                                                classes,
                                                disabled,
                                                dsi: dataStream,
                                                text: text.dataStream,
                                            }}
                                            key={index}
                                        />
                                    ))}
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
    classes: PropTypes.object.isRequired,
};

export const SecuritySelector = React.memo(({ disabled, text, securityType, securityPolicy, fieldName }) => (
    <Grid container spacing={8}>
        {
            !!text.description &&
            <Grid item xs={12}>
                <Typography variant="body2" component="p">
                    {text.description}
                </Typography>
            </Grid>
        }
        <Grid item xs={12}>
            <PolicyDropdown
                fieldName={fieldName}
                fieldLabel={`${securityType} level policy to apply to this PID`}
                displayPrompt
                prompt={text.prompt}
                disabled={disabled}
            />
        </Grid>
        {
            !!securityPolicy &&
            <SelectedSecurityPolicyDescription
                title={text.selectedTitle}
                selectedPolicyKey={securityPolicy}
            />
        }
    </Grid>
));

SecuritySelector.propTypes = {
    disabled: PropTypes.bool,
    fieldName: PropTypes.string,
    text: PropTypes.object,
    securityType: PropTypes.string,
    securityPolicy: PropTypes.number
};

export const DataStreamSecuritySelector = ({ text, disabled, dsi, classes }) => (
    <Grid
        container
        spacing={8}
        alignContent="flex-end"
        alignItems="flex-end"
        className={classes.dataStreamFileBlock}
    >
        <Grid item xs={12} sm={6} className={classes.dataStreamFileName}>
            <Link title={dsi.dsi_dsid}>
                {dsi.dsi_dsid}
            </Link>
        </Grid>
        <Grid item xs={12} sm={6}>
            <PolicyDropdown
                fieldName={dsi.fieldName}
                fieldLabel={text.overridePolicyPrompt}
                disabled={disabled}
            />
        </Grid>
    </Grid>
);

DataStreamSecuritySelector.propTypes = {
    disabled: PropTypes.bool,
    text: PropTypes.object,
    dsi: PropTypes.object,
    classes: PropTypes.object,
};

export default React.memo(withStyles(styles)(SecurityCard));

