import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { formValueSelector, getFormValues } from 'redux-form/immutable';
import { FORM_NAME } from '../../constants';
import { FormValuesContext } from 'context';
import AddSection from './AddSection';
import { publicationTypes } from 'config';
import { NEW_DOCTYPES_OPTIONS, DOCTYPE_SUBTYPE_MAPPING, NTRO_SUBTYPES } from 'config/general';
import * as recordForms from 'modules/SharedComponents/PublicationForm/components/Forms';
import MenuItem from '@material-ui/core/MenuItem';

const AddSectionContainer = ({
    disabled,
    hasSubtypes,
    publicationSubtype,
    publicationSubtypeItems,
    hasDefaultDocTypeSubType,
    subtypes,
    docTypeSubTypeCombo,
    formValues,
}) => {
    return (
        <FormValuesContext.Provider value={{ formValues: formValues.toJS() }}>
            <AddSection
                disabled={disabled}
                publicationSubtypeItems={publicationSubtypeItems}
                publicationSubtype={publicationSubtype}
                hasDefaultDocTypeSubType={hasDefaultDocTypeSubType}
                hasSubtypes={hasSubtypes}
                subtypes={subtypes}
                docTypeSubTypeCombo={docTypeSubTypeCombo}
                formValues={formValues.toJS()}
            />
        </FormValuesContext.Provider>
    );
};

AddSectionContainer.propTypes = {
    disabled: PropTypes.bool,
    publicationSubtype: PropTypes.any,
    publicationSubtypeItems: PropTypes.array,
    hasDefaultDocTypeSubType: PropTypes.bool,
    subtypes: PropTypes.array,
    hasSubtypes: PropTypes.bool,
    docTypeSubTypeCombo: PropTypes.any,
    formValues: PropTypes.object,
};

const mapStateToProps = (state, ownProps) => {
    const selector = formValueSelector(FORM_NAME);
    const formValues = getFormValues(FORM_NAME)(state) || Immutable.Map({});
    const displayType = selector(state, 'rek_display_type');
    const selectedPublicationType = !!displayType && publicationTypes({ ...recordForms })[displayType];
    const hasSubtypes = !!(selectedPublicationType || {}).subtypes;
    const subtypes = (hasSubtypes && selectedPublicationType.subtypes) || null;
    const publicationSubtype = hasSubtypes ? selector(state, 'rek_subtype') : null;
    let hasDefaultDocTypeSubType = false;
    let docTypeSubTypeCombo = null;
    if (!!displayType && NEW_DOCTYPES_OPTIONS.includes(displayType)) {
        hasDefaultDocTypeSubType = true;
        docTypeSubTypeCombo = !!DOCTYPE_SUBTYPE_MAPPING[displayType] && DOCTYPE_SUBTYPE_MAPPING[displayType];
    }
    const publicationSubtypeItems = subtypes
        ? subtypes.map((item, index) => (
            <MenuItem value={item} key={index}>
                {item}
            </MenuItem>
        ))
        : [];
    return {
        disabled: ownProps.disabled,
        hasSubtypes: hasSubtypes,
        publicationSubtypeItems: publicationSubtypeItems,
        hasDefaultDocTypeSubType: hasDefaultDocTypeSubType,
        docTypeSubTypeCombo: docTypeSubTypeCombo,
        subtypes:
            (!!publicationSubtype &&
                !!subtypes &&
                NTRO_SUBTYPES.includes(publicationSubtype) &&
                subtypes.filter(type => NTRO_SUBTYPES.includes(type))) ||
            subtypes ||
            null,
        formValues: formValues.get('adminSection') || Immutable.Map({}),
    };
};

export default connect(mapStateToProps)(React.memo(AddSectionContainer));
