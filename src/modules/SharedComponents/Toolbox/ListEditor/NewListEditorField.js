import React from 'react';
import FreeTextForm from './components/FreeTextForm';
import NewListEditor from './components/NewListEditor';
import GenericTemplate from './components/GenericTemplate';

const getValue = (input, normalize, searchKey) =>
    normalize(
        (!!input && !!input.value && !!input.value.toJS && input.value.toJS()) ||
            (!!input && !!input.value && input.value) ||
            [],
        searchKey,
    );

export const useItemsList = (input, normalize, searchKey) => {
    const [value, setValue] = React.useState(getValue(input, normalize, searchKey));

    return [value, setValue];
};

export const NewListEditorField = fieldProps => {
    const { normalize, searchKey } = fieldProps;
    const [value, setValue] = useItemsList(fieldProps.input, normalize, searchKey);

    React.useEffect(() => {
        setValue(getValue(fieldProps.input, normalize, searchKey));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fieldProps.input]);

    return (
        <NewListEditor
            errorText={fieldProps.meta ? fieldProps.meta.error : null}
            error={fieldProps.meta && !!fieldProps.meta.error}
            onChange={fieldProps.input.onChange}
            remindToAdd={fieldProps.remindToAdd}
            list={value}
            ListEditorForm={FreeTextForm}
            ListEditorItemTemplate={GenericTemplate}
            {...fieldProps}
        />
    );
};

NewListEditorField.defaultProps = {
    searchKey: {
        value: 'rek_value',
        order: 'rek_order',
    },
    normalize: (value, searchKey) => value.map(item => item[searchKey.value]),
};

export default React.memo(NewListEditorField);
