/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
/* eslint-disable react/jsx-no-undef */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-unreachable */
/* eslint-disable no-debugger */
/* eslint-disable no-constant-condition */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';

import { ConfirmDiscardFormChanges } from 'modules/SharedComponents/ConfirmDiscardFormChanges';
import {
    ContentIndicatorsField,
    showContentIndicatorsField,
} from 'modules/SharedComponents/Toolbox/ContentIndicatorsField';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { FileUploadField } from 'modules/SharedComponents/Toolbox/FileUploader';
import { NavigationDialogBox } from 'modules/SharedComponents/Toolbox/NavigationPrompt';
import { NtroHeader } from 'modules/SharedComponents/Toolbox/NtroFields';
import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';

import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Unstable_Grid2';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

import * as recordForms from './Forms';
import { general, publicationTypes, validation } from 'config';
import { default as txt } from 'locale/publicationForm';
import {
    DOCTYPE_SUBTYPE_MAPPING,
    NEW_DOCTYPES_OPTIONS,
    NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
    PUBLICATION_TYPE_DESIGN,
    SUBTYPE_EDITED_BOOK,
} from 'config/general';
import { createNewRecord, doesDOIExist } from '../../../../actions';
import validationErrors from '../../../../locale/validationErrors';
import { locale } from '../../../../locale';
import moment from 'moment/moment';
import { useDispatch } from 'react-redux';
import { Field } from '../../Toolbox/ReactHookForm';
import { useForm } from '../../../../hooks';
import { useNavigate } from 'react-router-dom';
import { useWatch } from 'react-hook-form';
import { flattenFormFieldKeys } from '../../../../hooks/useForm';

const asyncValidate = data => {
    const doi = data.fez_record_search_key_doi && data.fez_record_search_key_doi.rek_doi;
    if (validation.isValidDOIValue(doi)) {
        return doesDOIExist(doi).then(response => {
            if (response && response.total) {
                // redux-form error structure for field names with dots
                throw { fez_record_search_key_doi: { rek_doi: validationErrors.validationErrors.doiExists } };
            }
        });
    }
    return Promise.resolve();
};

const validate = data => {
    // add only multi field validations
    // single field validations should be implemented using validate prop: <Field validate={[validation.required]} />
    // reset global errors, eg form submit failure
    const errors = {};
    // Check authors validation for special cases
    switch (data.rek_display_type) {
        case general.PUBLICATION_TYPE_BOOK:
        case general.PUBLICATION_TYPE_AUDIO_DOCUMENT:
        case general.PUBLICATION_TYPE_VIDEO_DOCUMENT:
            // either author or editor should be selected and linked to a user
            // Edited book only require editors
            if (
                data?.rek_subtype &&
                data?.rek_subtype === SUBTYPE_EDITED_BOOK &&
                (!data.editors ||
                    (data.editors && data.editors.length === 0) ||
                    (data.editors || []).filter(item => item.selected).length === 0)
            ) {
                errors.editors = locale.validationErrors.editorRequired;
            } else if (
                (!data.authors && !data.editors) ||
                (!data.authors && data.editors && data.editors.length === 0) ||
                (!data.editors && data.authors && data.authors.length === 0) ||
                (data.authors && data.editors && data.editors.length === 0 && data.authors.length === 0) ||
                (data.authors &&
                    data.authors.length !== 0 &&
                    (data.editors || []).filter(item => item.selected).length === 0 &&
                    data.authors.filter(item => item.selected).length === 0) ||
                (data.editors &&
                    data.editors.length !== 0 &&
                    (data.authors || []).filter(item => item.selected).length === 0 &&
                    data.editors.filter(item => item.selected).length === 0)
            ) {
                errors.authors = locale.validationErrors.authorRequired;
                errors.editors = locale.validationErrors.editorRequired;
            }
            break;
        default:
            break;
    }

    // Check start\end dates are valid
    const endDate =
        data.fez_record_search_key_end_date &&
        data.fez_record_search_key_end_date.rek_end_date &&
        moment(data.fez_record_search_key_end_date.rek_end_date, 'YYYY-MM-DD').format();
    const startDate = data.rek_date && moment(data.rek_date).format();

    if (!!endDate && !!startDate && startDate > endDate) {
        errors.dateRange = locale.validationErrors.dateRange;
    }

    // Check start/end pages are valid for Book Chapters
    const startPage = data.fez_record_search_key_start_page && data.fez_record_search_key_start_page.rek_start_page;
    const endPage = data.fez_record_search_key_end_page && data.fez_record_search_key_end_page.rek_end_page;
    const docType = data.rek_display_type;
    if (
        docType === 177 &&
        (!startPage || !endPage || (!!startPage && !!endPage && parseInt(startPage, 10) > parseInt(endPage, 10)))
    ) {
        errors.pageRange = locale.validationErrors.pageRange;
    } else {
        if (errors.pageRange) {
            delete errors.pageRange;
        }
    }
    return errors;
};

const getProps = (initialValues, values, displayType, publicationSubtype) => {
    const selectedPublicationType = displayType && publicationTypes({ ...recordForms })[displayType];

    let hasDefaultDocTypeSubType = false;
    let docTypeSubTypeCombo = null;

    if (displayType && NEW_DOCTYPES_OPTIONS.includes(displayType)) {
        hasDefaultDocTypeSubType = true;
        docTypeSubTypeCombo = DOCTYPE_SUBTYPE_MAPPING[displayType] || null;
    } else if (displayType === PUBLICATION_TYPE_DESIGN) {
        hasDefaultDocTypeSubType = true;
        docTypeSubTypeCombo = {
            docTypeId: PUBLICATION_TYPE_DESIGN,
            subtype: NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
            name: NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
        };
    }

    const hasSubtypes = selectedPublicationType?.subtypes;
    const subtypes = hasSubtypes ? selectedPublicationType.subtypes : null;
    const formComponent = hasSubtypes
        ? publicationSubtype && selectedPublicationType.formComponent
        : selectedPublicationType?.formComponent || null;

    return {
        hasSubtypes,
        subtypes:
            publicationSubtype && general.NTRO_SUBTYPES.includes(publicationSubtype)
                ? subtypes?.filter(type => general.NTRO_SUBTYPES.includes(type))
                : subtypes,
        subtype: publicationSubtype,
        formComponent: (!hasSubtypes && formComponent) || (hasSubtypes && publicationSubtype && formComponent) || null,
        isNtro: general.NTRO_SUBTYPES.includes(publicationSubtype),
        hasDefaultDocTypeSubType,
        docTypeSubTypeCombo,
        isAuthorSelected: values?.authors?.some?.(object => object.selected === true) || false,
    };
};

const publicationTypesList = Object.values(publicationTypes({ ...recordForms }));
const publicationTypeItems = [
    ...publicationTypesList
        .filter(item => item.isFavourite)
        .map((item, index) => (
            <MenuItem value={item.id} key={'fav_' + index} disabled={!item.formComponent}>
                {item.name}
            </MenuItem>
        )),
    <Divider key="div_0" />,
    ...publicationTypesList
        .filter(item => item.hasFormComponent)
        .map((item, index) => (
            <MenuItem value={item.id} key={index} disabled={!item.formComponent}>
                {item.name}
            </MenuItem>
        )),
    ...NEW_DOCTYPES_OPTIONS.map((item, index) => (
        <MenuItem value={item} key={`ntro-${index}`}>
            {!!DOCTYPE_SUBTYPE_MAPPING[item] ? DOCTYPE_SUBTYPE_MAPPING[item].name : item}
        </MenuItem>
    )),
];

const formValues = values => ({ get: key => values[key], toJS: () => values });

const PublicationForm = ({ onFormCancel, initialValues, onFormSubmitSuccess }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    // form
    const {
        trigger,
        unregister,
        getValues,
        control,
        resetField,
        getPropsForAlert,
        mergeWithFormValues,
        safelyHandleSubmit,
        formState: { isDirty, isSubmitting, isSubmitSuccessful, hasValidationError },
    } = useForm({
        // shouldUnregister: true, // causes multiple re-renders - handled with useEffect bellow
        defaultValues: {
            languages: ['eng'],
            rek_title: initialValues.rek_title || '',
        },
    });
    // watch for changes on all fields, as we have to perform a form level validation below
    const [displayType, selectedSubtype] = useWatch({
        control,
        name: ['rek_display_type', 'rek_subtype'],
    });

    const values = getValues();
    const {
        hasSubtypes,
        subtypes,
        subtype,
        formComponent: FormComponent,
        isNtro,
        hasDefaultDocTypeSubType,
        docTypeSubTypeCombo,
        isAuthorSelected,
    } = useMemo(() => getProps(initialValues, values, displayType, selectedSubtype, recordForms), [
        displayType,
        selectedSubtype,
        JSON.stringify(values?.authors),
    ]);

    console.log(displayType, selectedSubtype, values);

    const publicationSubtypeList = subtypes?.map((item, index) => (
        <MenuItem value={item} key={`${displayType}-${index}`}>
            {item}
        </MenuItem>
    ));

    useEffect(() => {
        if (isSubmitSuccessful) {
            onFormSubmitSuccess();
        }
    }, [isSubmitSuccessful, onFormSubmitSuccess]);

    // clear subtype upon changing display type
    useEffect(() => {
        if (!displayType) return;
        const fields = flattenFormFieldKeys(values, ['rek_display_type', 'rek_subtype']);
        if (!!fields.length) {
            unregister(fields);
        }
        resetField('rek_subtype');
    }, [displayType]);
    // trigger validation upon selectedSubtype
    useEffect(() => {
        if (!selectedSubtype || !FormComponent) return;
        trigger();
    }, [selectedSubtype, FormComponent]);

    const handleSubmit = safelyHandleSubmit(async () => {
        const data = mergeWithFormValues({ author, publication });
        // Delete the currentAuthor if there is no author field in the form
        // (potentially editors only like conference proceedings) and its not a thesis (specific field name)
        if (!data.authors && !data['currentAuthor.0.nameAsPublished']) {
            delete data.currentAuthor;
        }
        await dispatch(createNewRecord({ ...data }));
    });

    const alertProps = validation.getErrorAlertProps({ alertLocale: txt, ...getPropsForAlert() });
    return (
        <ConfirmDiscardFormChanges dirty={isDirty} isSubmitSuccessful={isSubmitSuccessful}>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <NavigationDialogBox when={isDirty && !isSubmitSuccessful} txt={txt.cancelWorkflowConfirmation} />
                    <Grid xs={12}>
                        <StandardCard title={txt.publicationType.title} help={txt.publicationType.help}>
                            <Grid container spacing={1} padding={0}>
                                <Grid xs={12}>
                                    <Field
                                        control={control}
                                        component={SelectField}
                                        disabled={isSubmitting}
                                        name="rek_display_type"
                                        id="rek-display-type"
                                        value={values?.rek_display_type}
                                        label={txt.publicationType.inputLabelText}
                                        required
                                        placeholder={txt.publicationType.hintText}
                                        selectFieldId="rek-display-type"
                                    >
                                        {publicationTypeItems}
                                    </Field>
                                </Grid>
                                {(hasSubtypes || hasDefaultDocTypeSubType) && (
                                    <Grid xs={12}>
                                        <Field
                                            key={displayType}
                                            control={control}
                                            component={SelectField}
                                            disabled={isSubmitting}
                                            id="rek-subtype"
                                            name="rek_subtype"
                                            value={values?.rek_subtype}
                                            label={txt.publicationSubtype.inputLabelText}
                                            required
                                            placeholder={txt.publicationSubtype.hintText}
                                            selectFieldId="rek-subtype"
                                        >
                                            {publicationSubtypeList}
                                        </Field>
                                    </Grid>
                                )}
                            </Grid>
                        </StandardCard>
                    </Grid>
                    {!!control && !!FormComponent && (
                        <React.Fragment>
                            {!!isNtro && <NtroHeader />}
                            <Grid xs={12}>
                                <FormComponent
                                    key={`${displayType}${selectedSubtype}`}
                                    control={control}
                                    formValues={formValues(values)}
                                    subtype={subtype}
                                    isNtro={isNtro}
                                    isAuthorSelected={isAuthorSelected}
                                    isSubmitting={isSubmitting}
                                    navigate={navigate}
                                />
                            </Grid>
                            {showContentIndicatorsField(values) && (
                                <Grid xs={12}>
                                    <StandardCard title={txt.contentIndicators.title} help={txt.contentIndicators.help}>
                                        <Grid container spacing={3} padding={0}>
                                            <Grid xs={12}>
                                                <Typography>{txt.contentIndicators.description}</Typography>
                                                <Field
                                                    control={control}
                                                    component={ContentIndicatorsField}
                                                    displayType={values?.rek_display_type}
                                                    disabled={isSubmitting}
                                                    id="content-indicators"
                                                    name="contentIndicators"
                                                    label={txt.contentIndicators.fieldLabels.label}
                                                    multiple
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                    </StandardCard>
                                </Grid>
                            )}
                            <Grid xs={12}>
                                <StandardCard title={txt.fileUpload.title} help={txt.fileUpload.help}>
                                    <Field
                                        control={control}
                                        name="files"
                                        component={FileUploadField}
                                        disabled={isSubmitting}
                                        requireOpenAccessStatus
                                        validate={
                                            isNtro
                                                ? [validation.fileUploadRequired, validation.validFileUpload]
                                                : [validation.validFileUpload]
                                        }
                                        isNtro={isNtro}
                                    />
                                </StandardCard>
                            </Grid>
                        </React.Fragment>
                    )}
                    {!!FormComponent && alertProps && (
                        <Grid xs={12}>
                            <Alert pushToTop {...alertProps} />
                        </Grid>
                    )}
                </Grid>
                <Grid container spacing={3}>
                    <Grid xs />
                    <Grid xs={12} sm="auto">
                        <Button
                            color="secondary"
                            fullWidth
                            children={txt.cancel}
                            disabled={isSubmitting}
                            onClick={onFormCancel}
                        />
                    </Grid>
                    {(hasSubtypes || !!values?.rek_display_type) && (
                        <Grid xs={12} sm="auto">
                            <Button
                                type="submit"
                                style={{ whiteSpace: 'nowrap' }}
                                id="submit-work"
                                data-analyticsid="submit-work"
                                data-testid="submit-work"
                                variant="contained"
                                color="primary"
                                fullWidth
                                children={txt.submit}
                                disabled={isSubmitting || hasValidationError}
                            />
                        </Grid>
                    )}
                </Grid>
            </form>
        </ConfirmDiscardFormChanges>
    );
};

PublicationForm.propTypes = {
    initialValues: PropTypes.object,
    onFormCancel: PropTypes.func,
    onFormSubmitSuccess: PropTypes.func,
};

export default PublicationForm;
