import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { Field } from 'redux-form/immutable';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';

import { TextField as GenericTextField } from 'modules/SharedComponents/Toolbox/TextField';
import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
import { DatePickerField } from 'modules/SharedComponents/Toolbox/DatePickerField';
import { DownshiftMultiChipSelectField } from 'modules/SharedComponents/Toolbox/DownshiftMultiChipSelectField';
import { RichEditorField } from 'modules/SharedComponents/RichEditor';
import { ListEditorField } from 'modules/SharedComponents/Toolbox/ListEditor';
import { FormValuesContext } from 'context';

import { validation } from 'config';
import {
    subjects, subtypes, languages,
} from './MockData';

/* istanbul ignore next */
export const BibliographicSection = ({ disabled = false }) => (
    <Grid container spacing={8}>
        <Grid item xs={12}>
            <Typography variant="caption" component="span" style={{ opacity: 0.66 }}>Formatted title</Typography>
            <Field
                component={RichEditorField}
                disabled={disabled}
                name="title"
                height={100}
                format={value => Immutable.Map(value)}
                validate={[validation.required]} />
        </Grid>
        <Grid item xs={12}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="authorAffiliationAddress"
                fullWidth
                label="Author affiliation full address"
                placeholder=""
                required
                validate={[validation.required]} />
        </Grid>
        <Grid item xs={12}>
            <Field
                component={SelectField}
                disabled={disabled}
                name="language"
                label="Language"
                required
                placeholder="">
                <MenuItem value="" disabled>Please select a language</MenuItem>
                {
                    languages.map((item, index) => {
                        return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                    })
                }
            </Field>
        </Grid>
        <Grid item xs={12} sm={4}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="nativeTitle"
                fullWidth
                label="Native title"
                placeholder=""
                required
                validate={[validation.required]} />
        </Grid>
        <Grid item xs={12} sm={4}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="romanScriptTitle"
                fullWidth
                label="Roman script title"
                placeholder=""
                required
                validate={[validation.required]} />
        </Grid>
        <Grid item xs={12} sm={4}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="translatedTitle"
                fullWidth
                label="Translated title"
                placeholder="" />
        </Grid>
        <Grid item xs={12} sm={4}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="journalName"
                fullWidth
                label="Journal name"
                placeholder=""
                required
                validate={[validation.required]} />
        </Grid>
        <Grid item xs={12} sm={4}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="ISSN"
                fullWidth
                label="ISSN"
                placeholder=""
                required
                validate={[validation.required]} />
        </Grid>
        <Grid item xs={12} sm={4}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="ISBN"
                fullWidth
                label="ISBN"
                placeholder=""
                required
                validate={[validation.required]} />
        </Grid>
        <Grid item xs={12} sm={6}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="pubplace"
                fullWidth
                label="Place of publication"
                placeholder=""
                required
                validate={[validation.required]} />
        </Grid>
        <Grid item xs={12} sm={6}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="publisher"
                fullWidth
                label="Publisher"
                placeholder=""
                required
                validate={[validation.required]} />
        </Grid>
        <Grid item xs={12} sm={6}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="eraJournal"
                fullWidth
                label="ERA journal list match"
                placeholder=""
                required
                validate={[validation.required]} />
        </Grid>
        <Grid item xs={12} sm={6}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="eraJournalId"
                fullWidth
                label="ERA journal ID"
                placeholder=""
                required
                validate={[validation.required]} />
        </Grid>
        <Grid item xs={12} sm={6}>
            <Field
                component={DatePickerField}
                disabled={disabled}
                fullWidth
                label="Publication date"
                name="publicationDate"
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <Field
                component={SelectField}
                disabled={disabled}
                name="subtype"
                label="eSpace subtype"
                required
                placeholder="">
                <MenuItem value="" disabled>Select a document subtype</MenuItem>
                {
                    subtypes.map((item, index) => {
                        return <MenuItem key={index} value={item.value}>{item.label}</MenuItem>;
                    })}
            </Field>
        </Grid>
        <Grid item xs={12} sm={8}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="doi"
                fullWidth
                label="DOI"
                placeholder=""
                required
                validate={[validation.required]} />
        </Grid>
        <Grid item xs={12} sm={4}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="doiembargodays"
                fullWidth
                label="DOI Embargo days"
                placeholder="" />
        </Grid>
        <Grid item xs={12} sm={4}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="volume"
                fullWidth
                label="Volume"
                placeholder="" />
        </Grid>
        <Grid item xs={12} sm={4}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="issue"
                fullWidth
                label="Issue"
                placeholder="" />
        </Grid>
        <Grid item xs={12} sm={4}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="articlenumber"
                fullWidth
                label="Article number"
                placeholder="" />
        </Grid>
        <Grid item xs={12} sm={4}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="startpage"
                fullWidth
                label="Start page"
                placeholder="" />
        </Grid>
        <Grid item xs={12} sm={4}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="endpage"
                fullWidth
                label="End page"
                placeholder="" />
        </Grid>
        <Grid item xs={12} sm={4}>
            <Field
                component={GenericTextField}
                disabled={disabled}
                name="totalpages"
                fullWidth
                label="Total pages"
                placeholder="" />
        </Grid>
        <Grid item xs={12}>
            <FormValuesContext.Consumer>
                {({ formValues }) => (
                    <Field
                        component={DownshiftMultiChipSelectField}
                        disabled={disabled}
                        label="Subject(s)"
                        initialValue={formValues.get('subject')}
                        placeholder="Begin typing to select and add subject(s)"
                        optionsList={subjects}
                        name="subject" />
                )}
            </FormValuesContext.Consumer>
        </Grid>
        <Grid item xs={12}>
            <Field
                component={ListEditorField}
                disabled={disabled}
                name="keywords"
                remindToAdd
                maxCount={10}
                searchKey={{ value: 'keyword', order: 'order' }}
                locale={{
                    form: {
                        locale: {
                            inputFieldLabel: 'Keywords',
                            inputFieldHint: 'Type keywords',
                            addButtonLabel: 'Add',
                        },
                    },
                }} />
        </Grid>
        <Grid item xs={12}>
            <Typography variant="caption" component="span" style={{ opacity: 0.66 }}>Formatted abstract</Typography>
            <Field
                component={RichEditorField}
                disabled={disabled}
                name="abstract"
                height={100}
                format={value => Immutable.Map(value)}
                validate={[validation.required]} />
        </Grid>
    </Grid>
);

BibliographicSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(BibliographicSection);
