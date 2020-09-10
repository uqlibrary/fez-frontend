import React from 'react';
import { connect } from 'react-redux';
import { GenericSelectField } from 'modules/SharedComponents/GenericSelectField';
import { publicationTypes } from 'config';

const documentTypeList = () => {
    return Object.values(publicationTypes(false)).map(item => {
        return {
            value: item.id,
            text: item.name,
        };
    });
};
const mapStateToProps = (state, props) => {
    return {
        value: (!!props.input && props.input.value) || props.value || '',
        itemsList: documentTypeList() || [],
        itemsLoadingHint: props.loadingHint || 'Loading..',
    };
};

function mapDispatchToProps() {
    return {};
}

const SingleDocumentTypeList = connect(mapStateToProps, mapDispatchToProps)(GenericSelectField);

const _onChange = fieldProps => {
    return (!!fieldProps.input && fieldProps.input.onChange) || (!!fieldProps.onChange && fieldProps.onChange);
};

/**
 * provide a drop down that returns a Single Document Type (Publication type)
 * (see DocumentTypeMultipleField for selecting MULTIPLE document type)
 * @param fieldProps
 * @returns {*}
 * @constructor
 */
export default function DocumentTypeSingleField(fieldProps) {
    return (
        <SingleDocumentTypeList onChange={_onChange(fieldProps)} genericSelectFieldId="doc-type-id" {...fieldProps} />
    );
}
