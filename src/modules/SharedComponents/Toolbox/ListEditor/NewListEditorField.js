import React from 'react';
import PropTypes from 'prop-types';
import NewListEditor from './components/NewListEditor';

export const NewListEditorField = props => {
    const {
        normalize = (value, searchKey) => value.map(item => item[searchKey.value]),
        searchKey = {
            value: 'rek_value',
            order: 'rek_order',
        },
    } = props;

    const value = React.useMemo(() => props?.input?.value?.toJS?.() || props?.input?.value || props.value || [], [
        props,
    ]);
    const propNormalize = React.useCallback(() => normalize(value, searchKey), [normalize, searchKey, value]);
    const propValueNormalised = propNormalize();

    return (
        <NewListEditor
            key={propValueNormalised.length}
            errorText={props.meta ? props.meta.error : null}
            error={props.meta && !!props.meta.error}
            onChange={props?.onChange ?? props?.input?.onChange}
            remindToAdd={props.remindToAdd}
            list={propValueNormalised}
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
    value: PropTypes.array,
};

export default React.memo(NewListEditorField);
