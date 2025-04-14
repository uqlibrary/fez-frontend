import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import { validation, publicationTypes, pathConfig } from 'config';
import { DOCUMENT_TYPES_EDIT_ONLY, NEW_DOCTYPES_OPTIONS, NTRO_SUBTYPES } from 'config/general';
import locale from 'locale/pages';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
import { CollectionField } from 'modules/SharedComponents/LookupFields';
import * as recordForms from 'modules/SharedComponents/PublicationForm/components/Forms';

export const AddSection = ({ onCreate, disabled = false }) => {
    const navigate = useNavigate();
    const form = useFormContext();
    const displayType = form.getValues('rek_display_type');
    const selectedPublicationType = !!displayType && publicationTypes({ ...recordForms }, true)[displayType];
    const hasSubtypes = !!(selectedPublicationType || {}).subtypes;
    const publicationSubtype = hasSubtypes ? form.getValues('adminSection.rek_subtype') : null;
    const _subtypes = (hasSubtypes && selectedPublicationType.subtypes) || null;
    const subtypes =
        (!!publicationSubtype &&
            !!_subtypes &&
            NTRO_SUBTYPES.includes(publicationSubtype) &&
            _subtypes.filter(type => NTRO_SUBTYPES.includes(type))) ||
        _subtypes ||
        null;
    const collections = form.getValues('adminSection.collections');

    let hasDefaultDocTypeSubType = false;
    if (!!displayType && NEW_DOCTYPES_OPTIONS.includes(displayType)) {
        hasDefaultDocTypeSubType = true;
    }

    const publicationSubtypeItems = subtypes
        ? subtypes.map((item, index) => (
              <MenuItem value={item} key={index}>
                  {item}
              </MenuItem>
          ))
        : [];
    const disableSubmit =
        !collections || !collections.length || !selectedPublicationType || (hasSubtypes && !publicationSubtype);

    const allPublicationTypes = Object.values(publicationTypes());
    const availablePublicationTypes = allPublicationTypes.filter(
        pubType => !DOCUMENT_TYPES_EDIT_ONLY.includes(pubType.id),
    );
    const publicationTypeItems = [
        ...availablePublicationTypes.map((item, index) => {
            return (
                <MenuItem value={item.id} key={index}>
                    {item.name}
                </MenuItem>
            );
        }),
    ];
    /* istanbul ignore next */
    const handleCancel = event => {
        event.preventDefault();
        navigate(pathConfig.index);
    };

    return (
        <form>
            <StandardPage title={locale.pages.adminAdd.title}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <StandardCard title={locale.pages.adminAdd.step1} help={locale.pages.adminAdd.help}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Field
                                        name="adminSection.collections"
                                        collectionFieldId="rek-ismemberof"
                                        control={form.control}
                                        component={CollectionField}
                                        disabled={disabled}
                                        floatingLabelText={
                                            locale.pages.adminAdd.formLabels.ismemberof.floatingLabelText
                                        }
                                        hintText={locale.pages.adminAdd.formLabels.ismemberof.hintText}
                                        required
                                        validate={[validation.requiredList]}
                                        fullWidth
                                        {...(!!form.getFieldState('adminSection.collections').error
                                            ? {
                                                  error: true,
                                                  errorText: form.getFieldState('adminSection.collections').error
                                                      ?.message,
                                              }
                                            : {})}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        name="rek_display_type"
                                        selectFieldId="rek-display-type"
                                        control={form.control}
                                        component={SelectField}
                                        disabled={disabled}
                                        label={locale.pages.adminAdd.formLabels.rek_display_type.inputLabelText}
                                        placeholder={locale.pages.adminAdd.formLabels.rek_display_type.hintText}
                                        required
                                        validate={[validation.required]}
                                        value={selectedPublicationType}
                                        {...(!!form.getFieldState('rek_display_type').error
                                            ? {
                                                  error: true,
                                                  errorText: form.getFieldState('rek_display_type').error,
                                              }
                                            : {})}
                                    >
                                        {publicationTypeItems}
                                    </Field>
                                </Grid>
                                <Grid item xs={12}>
                                    {(hasSubtypes || hasDefaultDocTypeSubType) && (
                                        <Grid item xs={12}>
                                            <Field
                                                id="rek-subtype"
                                                name="adminSection.rek_subtype"
                                                selectFieldId="rek-subtype"
                                                control={form.control}
                                                component={SelectField}
                                                disabled={disabled}
                                                value={publicationSubtype}
                                                label={locale.pages.adminAdd.formLabels.rek_subtype.inputLabelText}
                                                required
                                                validate={[validation.required]}
                                                placeholder={locale.pages.adminAdd.formLabels.rek_subtype.hintText}
                                                {...(!!form.getFieldState('adminSection.rek_subtype').error
                                                    ? {
                                                          error: true,
                                                          errorText: form.getFieldState('adminSection.rek_subtype')
                                                              .error,
                                                      }
                                                    : {})}
                                            >
                                                {publicationSubtypeItems}
                                            </Field>
                                        </Grid>
                                    )}
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container spacing={1}>
                                        <Grid item xs sx={{ display: { xs: 'none', sm: 'block' } }} />
                                        <Grid item xs={12} sm={'auto'}>
                                            <Button
                                                id="cancel-work"
                                                data-analyticsid="cancel-work"
                                                data-testid="cancel-work"
                                                variant="contained"
                                                color="secondary"
                                                fullWidth
                                                children={locale.pages.adminAdd.cancelLabel}
                                                onClick={handleCancel}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={'auto'}>
                                            <Button
                                                id="submit-work"
                                                data-analyticsid="submit-work"
                                                data-testid="submit-work"
                                                variant="contained"
                                                color="primary"
                                                fullWidth
                                                children={locale.pages.adminAdd.buttonLabel}
                                                onClick={onCreate}
                                                disabled={disabled || disableSubmit}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </StandardCard>
                    </Grid>
                </Grid>
            </StandardPage>
        </form>
    );
};

AddSection.propTypes = {
    disabled: PropTypes.bool,
    disableSubmit: PropTypes.bool,
    hasDefaultDocTypeSubType: PropTypes.bool,
    publicationSubtypeItems: PropTypes.array,
    selectedPublicationType: PropTypes.object,
    publicationSubtype: PropTypes.string,
    hasSubtypes: PropTypes.bool,
    formValues: PropTypes.any,
    actions: PropTypes.object,
    onCreate: PropTypes.func,
};

export default React.memo(AddSection);
