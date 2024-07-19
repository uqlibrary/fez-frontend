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

// eslint-disable-next-line no-unused-vars
export const NewListEditorField = React.forwardRef((props, ref) => {
    const { normalize, searchKey } = props;
    const [value, setValue] = useItemsList(props, normalize, searchKey);

    React.useEffect(() => {
        setValue(getValue(props, normalize, searchKey));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props]);

    return (
        <NewListEditor
            key={value.length}
            errorText={props.meta ? props.meta.error : null}
            error={props.meta && !!props.meta.error}
            onChange={props.onChange}
            remindToAdd={props.remindToAdd}
            list={value}
            {...props}
        />
    );
});

NewListEditorField.defaultProps = {
    searchKey: {
        value: 'rek_value',
        order: 'rek_order',
    },
    normalize: (value, searchKey) => value.map(item => item[searchKey.value]),
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
