import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/lib/immutable';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';

import { validation } from 'config';
import { TOP_LEVEL_SECURITY_POLICIES } from 'config/general';

export const getIndexWithAttr = (array, attr, value) => array.map(item => item[attr]).indexOf(value);

export const renderPolicyDesc = (selectedPolicyKey, policyArray = TOP_LEVEL_SECURITY_POLICIES) => {
    const policyDesc = policyArray[
        getIndexWithAttr(
            policyArray,
            'value',
            selectedPolicyKey
        )
    ];
    return (
        <React.Fragment>
            {policyDesc.name} ({policyDesc.id})
        </React.Fragment>
    );
};

export const SecurityCard = ({ disabled, cardType, fieldID, text, selectedPolicyKey = '' }) => {
    const title = (
        <span>
            <b>{cardType}</b> level security - {text.entryName}
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
                    <Field component={SelectField} disabled={disabled}
                        name={fieldID}
                        label={`${cardType} policy to apply to this PID`}
                        required
                        validation={[validation.required]}
                    >
                        <MenuItem value="" disabled>
                            {text.prompt}
                        </MenuItem>
                        {TOP_LEVEL_SECURITY_POLICIES.map((item, index) => {
                            return (
                                <MenuItem
                                    key={index}
                                    value={item.value}
                                >
                                    {item.label}
                                </MenuItem>
                            );
                        })}
                    </Field>
                </Grid>
                {selectedPolicyKey &&
                    <Grid item xs={12} style={{
                        marginTop: 24,
                        padding: 24,
                        backgroundColor: 'rgba(0,0,0,0.05)'
                    }}>
                        <Typography variant="h6" style={{ marginTop: -8 }}>
                            {text.selectedTitle}
                        </Typography>
                        <Grid container spacing={8} style={{ marginTop: 8 }}>
                            <Grid item xs={2}><b>Name (ID):</b></Grid>
                            <Grid item xs={10}>
                                {renderPolicyDesc(selectedPolicyKey)}
                            </Grid>
                        </Grid>
                    </Grid>}
            </Grid>
        </StandardCard>
    );
};

SecurityCard.propTypes = {
    disabled: PropTypes.bool,
    cardType: PropTypes.string,
    selectedPolicyKey: PropTypes.string,
    text: PropTypes.object,
    fieldID: PropTypes.string
};

export default React.memo(SecurityCard);
