import React, { useRef } from 'react';
import PropTypes from 'prop-types';
// import Immutable from 'immutable';

import { Section } from '../common/Section';
// import Typography from '@material-ui/core/Typography';
// import MenuItem from '@material-ui/core/MenuItem';

// import { TextField as GenericTextField } from 'modules/SharedComponents/Toolbox/TextField';
// import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
// import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
// import { DatePickerField } from 'modules/SharedComponents/Toolbox/DatePickerField';
// import { DownshiftMultiChipSelectField } from 'modules/SharedComponents/Toolbox/DownshiftMultiChipSelectField';
// import { RichEditorField } from 'modules/SharedComponents/RichEditor';
// import { ListEditorField } from 'modules/SharedComponents/Toolbox/ListEditor';
// import { FilteredFieldOfResearchListField } from 'modules/SharedComponents/LookupFields';

import { useRecordContext } from 'context';
// import locale from 'locale/components';
// import { languages } from '../MockData';
import { adminInterfaceConfig } from 'config/adminInterface';

/* istanbul ignore next */
export const BibliographicSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const cards = useRef(
        adminInterfaceConfig[record.rek_display_type].bibliographic(
            record.fez_record_search_key_language.length > 1 ||
                record.fez_record_search_key_language[0].rek_language !== 'eng'
        )
    );

    return <Section cards={cards} disabled={disabled} />;
    // return (
    //     <Grid container spacing={8}>
    //         <Grid item xs={12}>
    //             <StandardCard
    //                 title={`${record.rek_display_type_lookup} Information`}
    //                 accentHeader={!tabbed}
    //             >
    //                 <Grid container spacing={8}>
    //                     <Grid item xs={12}>
    //                         <Field
    //                             component={DownshiftMultiChipSelectField}
    //                             disabled={disabled}
    //                             label="Collection"
    //                             placeholder="Begin typing to select and add collection(s)"
    //                             name="bibliographicSection.collections"
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12}>
    //                         <Typography
    //                             variant="caption"
    //                             component="span"
    //                             style={{ opacity: 0.66 }}
    //                         >
    //                             Formatted title
    //                         </Typography>
    //                         <Field
    //                             component={RichEditorField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.rek_title"
    //                             height={100}
    //                             format={value => Immutable.Map(value)}
    //                             validate={[validation.required]}
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12}>
    //                         <Field
    //                             component={GenericTextField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.authorAffiliationAddress"
    //                             fullWidth
    //                             label="Author affiliation full address"
    //                             placeholder=""
    //                             required
    //                             validate={[validation.required]}
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12}>
    //                         <Field
    //                             component={SelectField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.fez_record_search_key_language.0.rek_language"
    //                             label="Language"
    //                             required
    //                             placeholder=""
    //                         >
    //                             <MenuItem value="" disabled>
    //                                 Please select a language
    //                             </MenuItem>
    //                             {languages.map((item, index) => {
    //                                 return (
    //                                     <MenuItem
    //                                         key={index}
    //                                         value={item.value}
    //                                     >
    //                                         {item.label}
    //                                     </MenuItem>
    //                                 );
    //                             })}
    //                         </Field>
    //                     </Grid>
    //                     <Grid item xs={12} sm={4}>
    //                         <Field
    //                             component={GenericTextField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.nativeTitle"
    //                             fullWidth
    //                             label="Native title"
    //                             placeholder=""
    //                             required
    //                             validate={[validation.required]}
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12} sm={4}>
    //                         <Field
    //                             component={GenericTextField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.romanScriptTitle"
    //                             fullWidth
    //                             label="Roman script title"
    //                             placeholder=""
    //                             required
    //                             validate={[validation.required]}
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12} sm={4}>
    //                         <Field
    //                             component={GenericTextField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.translatedTitle"
    //                             fullWidth
    //                             label="Translated title"
    //                             placeholder=""
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12} sm={4}>
    //                         <Field
    //                             component={GenericTextField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.fez_record_search_key_journal_name.rek_journal_name"
    //                             fullWidth
    //                             label="Journal name"
    //                             placeholder=""
    //                             required
    //                             validate={[validation.required]}
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12} sm={4}>
    //                         <Field
    //                             component={GenericTextField}
    //                             disabled={disabled}
    //                             name={`${bibliographicSection
    // .fez_record_search_key_place_of_publication
    // .rek_place_of_publication}`}
    //                             fullWidth
    //                             label="Place of publication"
    //                             placeholder=""
    //                             required
    //                             validate={[validation.required]}
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12} sm={4}>
    //                         <Field
    //                             component={GenericTextField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.fez_record_search_key_publisher.rek_publisher"
    //                             fullWidth
    //                             label="Publisher"
    //                             placeholder=""
    //                             required
    //                             validate={[validation.required]}
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12} sm={6}>
    //                         <Field
    //                             component={GenericTextField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.eraJournal"
    //                             fullWidth
    //                             label="ERA journal list match"
    //                             placeholder=""
    //                             required
    //                             validate={[validation.required]}
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12} sm={6}>
    //                         <Field
    //                             component={GenericTextField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.eraJournalId"
    //                             fullWidth
    //                             label="ERA journal ID"
    //                             placeholder=""
    //                             required
    //                             validate={[validation.required]}
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12} sm={6}>
    //                         <Field
    //                             component={DatePickerField}
    //                             disabled={disabled}
    //                             fullWidth
    //                             label="Publication date"
    //                             name="bibliographicSection.publicationDate"
    //                         />
    //                     </Grid>
    //                     {!!subtypes && subtypes.length > 0 && (
    //                         <Grid item xs={12} sm={6}>
    //                             <Field
    //                                 component={SelectField}
    //                                 disabled={disabled}
    //                                 name="bibliographicSection.rek_subtype"
    //                                 label="eSpace subtype"
    //                                 required
    //                                 placeholder=""
    //                             >
    //                                 <MenuItem value="" disabled>
    //                                     Select a document subtype
    //                                 </MenuItem>
    //                                 {subtypes.map((item, index) => {
    //                                     return (
    //                                         <MenuItem key={index} value={item}>
    //                                             {item}
    //                                         </MenuItem>
    //                                     );
    //                                 })}
    //                             </Field>
    //                         </Grid>
    //                     )}
    //                     <Grid item xs={12} sm={8}>
    //                         <Field
    //                             component={GenericTextField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.fez_record_search_key_doi.rek_doi"
    //                             fullWidth
    //                             label="DOI"
    //                             placeholder=""
    //                             required
    //                             validate={[validation.required]}
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12} sm={4}>
    //                         <Field
    //                             component={GenericTextField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.fez_record_search_key_oa_embargo_days.rek_oa_embargo_days"
    //                             fullWidth
    //                             label="DOI Embargo days"
    //                             placeholder=""
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12} sm={4}>
    //                         <Field
    //                             component={GenericTextField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.fez_record_search_key_volume_number.rek_volume_number"
    //                             fullWidth
    //                             label="Volume"
    //                             placeholder=""
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12} sm={4}>
    //                         <Field
    //                             component={GenericTextField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.fez_record_search_key_issue_number.rek_issue_number"
    //                             fullWidth
    //                             label="Issue"
    //                             placeholder=""
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12} sm={4}>
    //                         <Field
    //                             component={GenericTextField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.articlenumber"
    //                             fullWidth
    //                             label="Article number"
    //                             placeholder=""
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12} sm={4}>
    //                         <Field
    //                             component={GenericTextField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.fez_record_search_key_start_page.rek_start_page"
    //                             fullWidth
    //                             label="Start page"
    //                             placeholder=""
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12} sm={4}>
    //                         <Field
    //                             component={GenericTextField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.fez_record_search_key_end_page.rek_end_page"
    //                             fullWidth
    //                             label="End page"
    //                             placeholder=""
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12} sm={4}>
    //                         <Field
    //                             component={GenericTextField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.fez_record_search_key_total_pages.rek_total_pages"
    //                             fullWidth
    //                             label="Total pages"
    //                             placeholder=""
    //                         />
    //                     </Grid>
    //                     <Grid item xs={12}>
    //                         <Typography
    //                             variant="caption"
    //                             component="span"
    //                             style={{ opacity: 0.66 }}
    //                         >
    //                             Formatted abstract
    //                         </Typography>
    //                         <Field
    //                             component={RichEditorField}
    //                             disabled={disabled}
    //                             name="bibliographicSection.rek_description"
    //                             height={100}
    //                             format={value => Immutable.Map(value)}
    //                             validate={[validation.required]}
    //                         />
    //                     </Grid>
    //                 </Grid>
    //             </StandardCard>
    //         </Grid>

    //         <Grid item xs={12}>
    //             <StandardCard
    //                 title={locale.components.subjectForm.title}
    //                 accentHeader={!tabbed}
    //             >
    //                 <Typography>
    //                     {locale.components.subjectForm.text}
    //                 </Typography>
    //                 <Field
    //                     component={FilteredFieldOfResearchListField}
    //                     name="bibliographicSection.subjects"
    //                     required
    //                     validate={[validation.subRequired]}
    //                     distinctOnly
    //                     disabled={disabled}
    //                     locale={locale.components.subjectForm.field}
    //                 />
    //             </StandardCard>
    //         </Grid>
    //         <Grid item xs={12}>
    //             <StandardCard title="Keywords" accentHeader={!tabbed}>
    //                 <Field
    //                     component={ListEditorField}
    //                     name="bibliographicSection.fez_record_search_key_keywords"
    //                     required
    //                     validate={[validation.requiredList]}
    //                     maxInputLength={111}
    //                     searchKey={{
    //                         value: 'rek_keywords',
    //                         order: 'rek_keywords_order'
    //                     }}
    //                     locale={locale.components.keywordsForm.field}
    //                     disabled={disabled}
    //                 />
    //             </StandardCard>
    //         </Grid>
    //         <Grid item xs={12}>
    //             <StandardCard
    //                 title={locale.components.issnForm.title}
    //                 help={locale.components.issnForm.title.help}
    //                 accentHeader={!tabbed}
    //             >
    //                 <Typography>{locale.components.issnForm.text}</Typography>
    //                 <Field
    //                     component={ListEditorField}
    //                     remindToAdd
    //                     isValid={validation.isValidIssn}
    //                     name="bibliographicSection.fez_record_search_key_issn"
    //                     maxCount={5}
    //                     locale={locale.components.issnForm.field}
    //                     searchKey={{
    //                         value: 'rek_issn',
    //                         order: 'rek_issn_order'
    //                     }}
    //                     disabled={disabled}
    //                 />
    //             </StandardCard>
    //         </Grid>
    //         <Grid item xs={12}>
    //             <StandardCard
    //                 title={locale.components.isbnForm.title}
    //                 help={locale.components.isbnForm.title.help}
    //                 accentHeader={!tabbed}
    //             >
    //                 <Typography>{locale.components.isbnForm.text}</Typography>
    //                 <Field
    //                     component={ListEditorField}
    //                     remindToAdd
    //                     name="bibliographicSection.fez_record_search_key_isbn"
    //                     isValid={validation.isValidIsbn}
    //                     maxCount={5}
    //                     searchKey={{
    //                         value: 'rek_isbn',
    //                         order: 'rek_isbn_order'
    //                     }}
    //                     locale={locale.components.isbnForm.field}
    //                     disabled={disabled}
    //                 />
    //             </StandardCard>
    //         </Grid>
    //     </Grid>
    // );
};

BibliographicSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(BibliographicSection);
