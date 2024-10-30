import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'modules/SharedComponents/Toolbox/ReactHookForm';

import { useNavigate } from 'react-router-dom';
import { useFormContext } from 'react-hook-form';

import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';

import { validation, publicationTypes, pathConfig } from 'config';
import {
    DOCUMENT_TYPES_EDIT_ONLY,
    NEW_DOCTYPES_OPTIONS,
    /* DOCTYPE_SUBTYPE_MAPPING,*/ NTRO_SUBTYPES,
} from 'config/general';
import locale from 'locale/pages';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
import { CollectionField } from 'modules/SharedComponents/LookupFields';
import * as recordForms from 'modules/SharedComponents/PublicationForm/components/Forms';

export const AddSection = ({ onCreate, disabled }) => {
    const navigate = useNavigate();
    const attributes = useFormContext();
    const displayType = attributes.getValues('rek_display_type');
    const selectedPublicationType = !!displayType && publicationTypes({ ...recordForms }, true)[displayType];
    const hasSubtypes = !!(selectedPublicationType || {}).subtypes;
    const publicationSubtype = hasSubtypes ? attributes.getValues('adminSection.rek_subtype') : null;
    const _subtypes = (hasSubtypes && selectedPublicationType.subtypes) || null;
    const subtypes =
        (!!publicationSubtype &&
            !!_subtypes &&
            NTRO_SUBTYPES.includes(publicationSubtype) &&
            _subtypes.filter(type => NTRO_SUBTYPES.includes(type))) ||
        _subtypes ||
        null;
    const collections = attributes.getValues('adminSection.collections');

    let hasDefaultDocTypeSubType = false;
    // let docTypeSubTypeCombo = null;
    if (!!displayType && NEW_DOCTYPES_OPTIONS.includes(displayType)) {
        hasDefaultDocTypeSubType = true;
        // docTypeSubTypeCombo = !!DOCTYPE_SUBTYPE_MAPPING[displayType] && DOCTYPE_SUBTYPE_MAPPING[displayType];
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
                                        control={attributes.control}
                                        component={CollectionField}
                                        disabled={disabled}
                                        name="adminSection.collections"
                                        floatingLabelText={
                                            locale.pages.adminAdd.formLabels.ismemberof.floatingLabelText
                                        }
                                        hintText={locale.pages.adminAdd.formLabels.ismemberof.hintText}
                                        required
                                        validate={[validation.requiredList]}
                                        fullWidth
                                        collectionFieldId="rek-ismemberof"
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        control={attributes.control}
                                        component={SelectField}
                                        disabled={disabled}
                                        label={locale.pages.adminAdd.formLabels.rek_display_type.inputLabelText}
                                        name="rek_display_type"
                                        placeholder={locale.pages.adminAdd.formLabels.rek_display_type.hintText}
                                        required
                                        selectFieldId="rek-display-type"
                                        validate={[validation.required]}
                                        value={selectedPublicationType}
                                    >
                                        {publicationTypeItems}
                                    </Field>
                                </Grid>
                                <Grid item xs={12}>
                                    {(hasSubtypes || hasDefaultDocTypeSubType) && (
                                        <Grid item xs={12}>
                                            <Field
                                                control={attributes.control}
                                                component={SelectField}
                                                disabled={disabled}
                                                id="rek-subtype"
                                                name="adminSection.rek_subtype"
                                                value={publicationSubtype}
                                                label={locale.pages.adminAdd.formLabels.rek_subtype.inputLabelText}
                                                required
                                                validate={[validation.required]}
                                                placeholder={locale.pages.adminAdd.formLabels.rek_subtype.hintText}
                                                selectFieldId="rek-subtype"
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
