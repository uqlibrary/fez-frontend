import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';

import { TextField as GenericTextField } from 'modules/SharedComponents/Toolbox/TextField';
import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
import { DownshiftMultiChipSelectField } from 'modules/SharedComponents/Toolbox/DownshiftMultiChipSelectField';

import { validation } from 'config';
import { collectionItems, WOSDocTypes, ScopusDocTypes, PubmedDocTypes } from './MockData';
import { FormValuesContextConsumer } from 'context';

/* istanbul ignore next */
export const IdentifiersSection = ({ disabled = false }) => (
    <Grid container spacing={8}>
        <Grid item xs={12} sm={12}>
            <Typography variant="body2" component="p">Some explanatory text might go here. It may not. Time will tell.</Typography>
        </Grid>
        <Grid item xs={12}>
            <FormValuesContextConsumer>
                {({ formValues }) => (
                    <Field
                        component={DownshiftMultiChipSelectField}
                        initialValue={formValues.collection}
                        disabled={disabled}
                        label="Collection"
                        placeholder="Begin typing to select and add collection(s)"
                        optionsList={collectionItems}
                        name="identifiersSection.collection" />
                )}
            </FormValuesContextConsumer>
        </Grid>
        <Grid item xs={12} sm={6}>
            <Field
                component={GenericTextField}
                name="identifiersSection.wosIsi"
                fullWidth
                label="WOS ID (ISI Loc)"
                placeholder=""
                required
                validate={[validation.required]} />
        </Grid>
        <Grid item xs={12} sm={6}>
            <Field
                component={SelectField}
                disabled={disabled}
                name="identifiersSection.wosDocType"
                label="WOS Document type"
                required
                placeholder="">
                <MenuItem value="" disabled>Select a document type</MenuItem>
                {WOSDocTypes.map((item, index) => {
                    return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                })}
            </Field>
        </Grid>
        <Grid item xs={12} sm={6}>
            <Field
                component={GenericTextField}
                name="identifiersSection.scopusId"
                fullWidth
                label="Scopus ID"
                placeholder=""
                required
                validate={[validation.required]} />
        </Grid>
        <Grid item xs={12} sm={6}>
            <Field
                component={SelectField}
                disabled={disabled}
                name="identifiersSection.scopusDocType"
                label="Scopus Document type"
                required
                placeholder="">
                <MenuItem value="" disabled>Select a document type</MenuItem>
                {ScopusDocTypes.map((item, index) => {
                    return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                })}
            </Field>
        </Grid>
        <Grid item xs={12} sm={6}>
            <Field
                component={GenericTextField}
                name="identifiersSection.pubmedId"
                fullWidth
                label="PubMed ID"
                placeholder=""
                required
                validate={[validation.required]} />
        </Grid>
        <Grid item xs={12} sm={6}>
            <Field
                component={SelectField}
                disabled={disabled}
                name="identifiersSection.pubmedDocType"
                label="PubMed Document type"
                required
                placeholder="">
                <MenuItem value="" disabled>Select a document type</MenuItem>
                {PubmedDocTypes.map((item, index) => {
                    return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                })}
            </Field>
        </Grid>
    </Grid>
);

IdentifiersSection.propTypes = {
    disabled: PropTypes.bool
};

export default React.memo(IdentifiersSection);
