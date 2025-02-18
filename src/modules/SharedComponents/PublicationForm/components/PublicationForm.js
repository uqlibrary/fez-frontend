import React, { useEffect, useRef } from 'react';
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
import { useDispatch } from 'react-redux';
import { Field } from '../../Toolbox/ReactHookForm';
import { useForm } from '../../../../hooks';
import { useNavigate } from 'react-router-dom';
import { useWatch } from 'react-hook-form';
import { flattenFormFieldKeys } from '../../../../hooks/useForm';
import { isEmptyObject } from '../../../../helpers/general';
import { dateRange } from 'config/validation';

const asyncValidate = async (data, setError) => {
    const doi = data.fez_record_search_key_doi?.rek_doi;
    if (!validation.isValidDOIValue(doi) || !(await doesDOIExist(doi))?.total) return true;
    setError('fez_record_search_key_doi.rek_doi', { message: validationErrors.validationErrors.doiExists });
    return false;
};

const hasAtLeastOneContributorSelected = items => items?.some(v => v.selected);

const validateAuthors = data => {
    const errors = {};
    if (data.rek_subtype === SUBTYPE_EDITED_BOOK && !hasAtLeastOneContributorSelected(data.editors)) {
        errors.editors = locale.validationErrors.editorRequired;
    } else if ((!data.authors || !data.authors.length) && (!data.editors || !data.editors.length)) {
        errors.authors = locale.validationErrors.authorRequired;
        errors.editors = locale.validationErrors.editorRequired;
    } else if (
        data.authors?.length &&
        !hasAtLeastOneContributorSelected(data.authors) &&
        !hasAtLeastOneContributorSelected(data.editors)
    ) {
        errors.authors = locale.validationErrors.authorRequired;
    }
    return errors;
};

const validateDates = data => {
    const error = dateRange(data.rek_date, data.fez_record_search_key_end_page?.rek_end_date);
    if (!error) {
        return {};
    }
    return { dateRange: error };
};

const validatePages = data => {
    const startPage = data.fez_record_search_key_start_page?.rek_start_page;
    const endPage = data.fez_record_search_key_end_page?.rek_end_page;
    const docType = data.rek_display_type;
    if (
        docType === 177 &&
        (!startPage || !endPage || (startPage && endPage && parseInt(startPage, 10) > parseInt(endPage, 10)))
    ) {
        return { pageRange: locale.validationErrors.pageRange };
    }
    return {};
};

const getFormLevelError = data => {
    if (!data) return {};
    return {
        ...validateAuthors(data),
        ...validateDates(data),
        ...validatePages(data),
    };
};

const getState = (initialValues, values, displayType, subtype) => {
    const publicationType = displayType && publicationTypes({ ...recordForms })[displayType];

    let selectedTypeComboOption = null;
    if (displayType && NEW_DOCTYPES_OPTIONS.includes(displayType)) {
        selectedTypeComboOption = DOCTYPE_SUBTYPE_MAPPING[displayType];
    } else if (displayType === PUBLICATION_TYPE_DESIGN) {
        selectedTypeComboOption = {
            docTypeId: PUBLICATION_TYPE_DESIGN,
            subtype: NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
        };
    }

    const hasSubtype = !!publicationType?.subtypes?.length;
    return {
        hasSubtype: !!publicationType?.subtypes?.length,
        subtypes:
            // restrict to NTRO only if one NTRO subtype is selected
            subtype && general.NTRO_SUBTYPES.includes(subtype)
                ? publicationType?.subtypes?.filter(type => general.NTRO_SUBTYPES.includes(type))
                : publicationType?.subtypes,
        formComponent: displayType && (!hasSubtype || subtype) && publicationType?.formComponent,
        isNtro: general.NTRO_SUBTYPES.includes(subtype),
        selectedTypeComboOption,
        isAuthorSelected: !!values.authors?.some?.(object => object.selected === true),
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

export const formValues = values => ({ get: key => values[key], toJS: () => values });

const PublicationForm = ({ initialValues, onFormSubmitSuccess, onFormCancel }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const shouldIgnoreDisplayTypeChange = useRef(false);

    // form
    const {
        trigger,
        control,
        setValue,
        setError,
        unregister,
        resetField,
        getPropsForAlert,
        safelyHandleSubmit,
        formState: { isDirty, isSubmitting, isSubmitSuccessful, hasValidationError },
    } = useForm({
        // shouldUnregister: true, // causes multiple re-renders - handled by useEffect bellow
    });
    const values = useWatch({ control });
    let displayType = values.rek_display_type;
    let subtype = values.rek_subtype;

    const {
        hasSubtype,
        subtypes,
        formComponent: FormComponent,
        isNtro,
        selectedTypeComboOption,
        isAuthorSelected,
    } = getState(initialValues, values, displayType, subtype, recordForms);
    // update displayType and subtype according to selected selectedTypeComboOption prior to the useLayoutEffect call
    // below, where displayType changes are handled, in order to avoid unnecessary re-renders
    if (selectedTypeComboOption) {
        displayType = selectedTypeComboOption.docTypeId;
        subtype = selectedTypeComboOption.subtype;
    }

    // handles combo displayType + subtype option selection
    useEffect(() => {
        if (!selectedTypeComboOption?.docTypeId || !selectedTypeComboOption?.subtype) {
            return;
        }
        // using setValue() on watched values triggers a re-render
        // we have to use a ref var to avoid re-renders from the displayType changes - handle by the useEffect below
        shouldIgnoreDisplayTypeChange.current = true;
        setValue('rek_display_type', selectedTypeComboOption.docTypeId);
        setValue('rek_subtype', selectedTypeComboOption.subtype);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTypeComboOption?.docTypeId, selectedTypeComboOption?.subtype]);

    // handle displayType changes
    useEffect(() => {
        if (!displayType) return;
        if (shouldIgnoreDisplayTypeChange.current) {
            shouldIgnoreDisplayTypeChange.current = false;
            return;
        }
        // unregister previously registered form fields, as they are no longer present
        const fields = flattenFormFieldKeys(values, ['rek_display_type', 'rek_subtype']);
        if (!!fields.length) {
            unregister(fields);
        }
        resetField('rek_subtype');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayType]);

    // handle FormComponent changes
    useEffect(() => {
        if (!FormComponent) return;
        // set default title value if it's present, and it hasn't been overridden by the use yet
        if (initialValues.rek_title?.trim?.() && !values.rek_title?.trim?.()) {
            setValue('rek_title', initialValues.rek_title);
        }
        if (!values.languages?.length) {
            setValue('languages', ['eng']);
        }
        // queue validation trigger, to allow selected pub. form's fields to be fully rendered prior to validation
        setTimeout(() => trigger());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [FormComponent]);

    // handle successful form submission
    useEffect(() => {
        if (!isSubmitSuccessful) return;
        resetField('rek_display_type');
        onFormSubmitSuccess();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSubmitSuccessful]);

    const handleSubmit = safelyHandleSubmit(async data => {
        if (!(await asyncValidate({ ...data }, setError))) return;
        await dispatch(createNewRecord(data));
    });

    const formLevelError = getFormLevelError({ ...values });
    const alertProps = validation.getErrorAlertProps({ alertLocale: txt, ...getPropsForAlert(formLevelError) });
    return (
        <ConfirmDiscardFormChanges dirty={isDirty} submitSucceeded={isSubmitSuccessful}>
            <form onSubmit={e => e.preventDefault()}>
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
                                        value={displayType}
                                        label={txt.publicationType.inputLabelText}
                                        required
                                        placeholder={txt.publicationType.hintText}
                                        selectFieldId="rek-display-type"
                                    >
                                        {publicationTypeItems}
                                    </Field>
                                </Grid>
                                {hasSubtype && (!subtype || subtypes.includes(subtype)) && (
                                    <Grid xs={12}>
                                        <Field
                                            key={`${displayType}${subtype}`}
                                            control={control}
                                            component={SelectField}
                                            disabled={isSubmitting}
                                            id="rek-subtype"
                                            name="rek_subtype"
                                            value={subtype}
                                            label={txt.publicationSubtype.inputLabelText}
                                            required
                                            placeholder={txt.publicationSubtype.hintText}
                                            selectFieldId="rek-subtype"
                                        >
                                            {subtypes?.map((item, index) => (
                                                <MenuItem value={item} key={`${displayType}-${index}`}>
                                                    {item}
                                                </MenuItem>
                                            ))}
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
                                                    displayType={displayType}
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
                    {(hasSubtype || !!displayType) && (
                        <Grid xs={12} sm="auto">
                            <Button
                                onClick={handleSubmit}
                                style={{ whiteSpace: 'nowrap' }}
                                id="submit-work"
                                data-analyticsid="submit-work"
                                data-testid="submit-work"
                                variant="contained"
                                color="primary"
                                fullWidth
                                children={txt.submit}
                                disabled={isSubmitting || !isEmptyObject(formLevelError) || hasValidationError}
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
