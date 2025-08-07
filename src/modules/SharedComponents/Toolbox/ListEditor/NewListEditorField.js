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

    const value = React.useMemo(() => props.value || [], [props]);
    const propNormalize = React.useCallback(() => normalize(value, searchKey), [normalize, searchKey, value]);
    const propValueNormalised = propNormalize();

    return (
        <NewListEditor
            key={propValueNormalised.length}
            error={!!props.state?.error}
            errorText={props.state?.error}
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
    value: PropTypes.array,
    state: PropTypes.object,
};

export default React.memo(NewListEditorField);
