import React from 'react';
import PropTypes from 'prop-types';
import NewListEditor from './components/NewListEditor';

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

export const NewListEditorField = props => {
    const {
        normalize = (value, searchKey) => value.map(item => item[searchKey.value]),
        searchKey = {
            value: 'rek_value',
            order: 'rek_order',
        },
    } = props;

    const [value] = useItemsList(props.input, normalize, searchKey);

    return (
        <NewListEditor
            key={value.length}
            errorText={props.meta ? props.meta.error : null}
            error={props.meta && !!props.meta.error}
            onChange={props?.onChange ?? props?.input?.onChange}
            remindToAdd={props.remindToAdd}
            list={value}
            searchKey={searchKey}
            normalize={normalize}
            {...props}
        />
    );
};

NewListEditorField.propTypes = {
    searchKey: PropTypes.object,
    normalize: PropTypes.func,
    onChange: PropTypes.func,
    remindToAdd: PropTypes.bool,
    input: PropTypes.object,
    meta: PropTypes.object,
};

export default React.memo(NewListEditorField);
