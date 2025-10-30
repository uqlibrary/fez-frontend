import React from 'react';
import PropTypes from 'prop-types';
import LazyLoadSuspense from 'modules/SharedComponents/LazyLoadSuspense';

// Lazy load the RichEditor component
const RichEditor = React.lazy(() => import('./RichEditor'));

const RichEditorLazy = props => {
    return (
        <LazyLoadSuspense>
            <RichEditor {...props} />
        </LazyLoadSuspense>
    );
};

RichEditorLazy.propTypes = {
    className: PropTypes.string,
    instructions: PropTypes.any,
    maxValue: PropTypes.number,
    state: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    richEditorId: PropTypes.string,
    required: PropTypes.bool,
    singleLine: PropTypes.bool,
    textOnlyOnPaste: PropTypes.bool,
    description: PropTypes.string,
    error: PropTypes.bool,
    errorText: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    title: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    titleProps: PropTypes.object,
};

export default RichEditorLazy;
