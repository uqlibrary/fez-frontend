import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { Field } from 'redux-form/immutable';
import { validation } from 'config';
import StandardPage from 'modules/SharedComponents/Toolbox/StandardPage/components/StandardPage';
import { CollectionField } from 'modules/SharedComponents/LookupFields';
import { SelectField } from 'modules/SharedComponents/Toolbox/SelectField';
import locale from 'locale/pages';
import StandardCard from 'modules/SharedComponents/Toolbox/StandardCard/components/StandardCard';
import MenuItem from '@material-ui/core/MenuItem';
import Divider from '@material-ui/core/Divider';
import { publicationTypes } from 'config';
import * as recordForms from 'modules/SharedComponents/PublicationForm/components/Forms';
import { NEW_DOCTYPES_OPTIONS, DOCTYPE_SUBTYPE_MAPPING } from 'config/general';

/* istanbul ignore next */
export const AddSection = ({
    hasDefaultDocTypeSubType,
    publicationSubtypeItems,
    selectedPublicationType,
    publicationSubtype,
    hasSubtypes,
    disabled = false,
}) => {
    const allPublicationTypes = Object.values(publicationTypes({ ...recordForms }));
    const publicationTypeItems = [
        ...allPublicationTypes
            .filter(item => {
                return item.isFavourite;
            })
            .map((item, index) => {
                return (
                    <MenuItem value={item.id} key={'fav_' + index} disabled={!item.formComponent}>
                        {item.name}
                    </MenuItem>
                );
            }),
        ...[<Divider key="div_0" />],
        ...allPublicationTypes
            .filter(item => {
                return item.hasFormComponent;
            })
            .map((item, index) => {
                return (
                    <MenuItem value={item.id} key={index} disabled={!item.formComponent}>
                        {item.name}
                    </MenuItem>
                );
            }),
        ...NEW_DOCTYPES_OPTIONS.map((item, index) => (
            <MenuItem value={item} key={`ntro-${index}`}>
                {!!DOCTYPE_SUBTYPE_MAPPING[item] ? DOCTYPE_SUBTYPE_MAPPING[item].name : item}
            </MenuItem>
        )),
    ];
    return (
        <form>
            <StandardPage title={locale.pages.adminAdd.title}>
                <Grid container spacing={24}>
                    <Grid item xs={12}>
                        <StandardCard title={locale.pages.adminAdd.step1} help={locale.pages.adminAdd.help}>
                            <Grid container spacing={24}>
                                <Grid item xs={12}>
                                    <Field
                                        component={CollectionField}
                                        disabled={disabled}
                                        name="additionalInformationSection.collections"
                                        id="additionalInformationSectioncollections"
                                        floatingLabelText={
                                            locale.pages.adminAdd.formLabels.ismemberof.floatingLabelText
                                        }
                                        hintText={locale.pages.adminAdd.formLabels.ismemberof.hintText}
                                        required
                                        validate={[validation.requiredList]}
                                        fullwidth
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <Field
                                        component={SelectField}
                                        disabled={disabled}
                                        name="rek_display_type"
                                        value={selectedPublicationType}
                                        label={locale.pages.adminAdd.formLabels.rek_display_type.inputLabelText}
                                        required
                                        validate={[validation.required]}
                                        placeholder={locale.pages.adminAdd.formLabels.rek_display_type.hintText}
                                        SelectDisplayProps={{
                                            id: 'rek-display-type',
                                        }}
                                    >
                                        {publicationTypeItems}
                                    </Field>
                                </Grid>
                                <Grid item xs={12}>
                                    {(hasSubtypes || hasDefaultDocTypeSubType) && (
                                        <Grid item xs={12}>
                                            <Field
                                                component={SelectField}
                                                disabled={disabled}
                                                id="rek-subtype"
                                                name="rek_subtype"
                                                value={publicationSubtype}
                                                label={locale.pages.adminAdd.formLabels.rek_subtype.inputLabelText}
                                                required
                                                validate={[validation.required]}
                                                placeholder={locale.pages.adminAdd.formLabels.rek_subtype.hintText}
                                                SelectDisplayProps={{
                                                    id: 'rek-subtype',
                                                }}
                                            >
                                                {publicationSubtypeItems}
                                            </Field>
                                        </Grid>
                                    )}
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
    hasDefaultDocTypeSubType: PropTypes.bool,
    publicationSubtypeItems: PropTypes.array,
    selectedPublicationType: PropTypes.object,
    publicationSubtype: PropTypes.object,
    hasSubtypes: PropTypes.bool,
    formValues: PropTypes.any,
    location: PropTypes.object,
    history: PropTypes.object,
    actions: PropTypes.object,
};

export default React.memo(AddSection);
