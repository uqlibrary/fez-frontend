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

    const [value, setValue] = useItemsList(props.input, normalize, searchKey);

    React.useEffect(() => {
        setValue(getValue(props.input, normalize, searchKey));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.input]);

    return (
        <NewListEditor
            key={value.length}
            errorText={props.meta ? props.meta.error : null}
            error={props.meta && !!props.meta.error}
            onChange={props.input.onChange}
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
    remindToAdd: PropTypes.bool,
    input: PropTypes.object,
    meta: PropTypes.object,
};

export default React.memo(NewListEditorField);
