/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react';
import PropTypes from 'prop-types';
import NewListEditor from './components/NewListEditor';

const getValue = (props, normalize, searchKey) =>
    normalize(props?.input?.value?.toJS?.() || props?.input?.value || props.value || [], searchKey);

export const useItemsList = (props, normalize, searchKey) => {
    const [value, setValue] = React.useState(getValue(props, normalize, searchKey));
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

    const [value, setValue] = useItemsList(props, normalize, searchKey);
    const prevValue = React.useRef();
    const propValueNormalised = getValue(props, normalize, searchKey);
    const propValueStringified = JSON.stringify(propValueNormalised);

    if (propValueStringified !== prevValue.current) {
        prevValue.current = propValueStringified;
        setValue(propValueNormalised);
    }

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
