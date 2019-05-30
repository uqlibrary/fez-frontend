import React from 'react';
import PropTypes from 'prop-types';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { CONTENT_INDICATORS } from 'config/general';

export const getSelected = props => {
    let selectedValues = !!props.input && props.input.value || [];
    if (selectedValues.toJS) {
        selectedValues = selectedValues.toJS();
    }
    if(
        !!props.meta &&
        !!props.meta.initial &&
        !!props.meta.initial.toJS &&
        props.meta.initial.toJS().length
    ) {
        const initialValues = props.meta.initial.toJS();
        selectedValues = [...new Set([
            ...initialValues,
            ...selectedValues
        ])];
    }
    return selectedValues;
};

export const ContentIndicatorsField = props => {
    return (
        <GenericSelectField
            itemsList={CONTENT_INDICATORS}
            hideLabel={false}
            locale={{ label: props.label }}
            selectedValue={getSelected(props)}
            onChange={!!props.input && props.input.onChange || undefined}
            errorText={!!props.meta && props.meta.error || ''}
            error={!!props.meta && !!props.meta.error || false}
            {...props}
        />
    );
};

ContentIndicatorsField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
    label: PropTypes.string,
};

export default ContentIndicatorsField;
