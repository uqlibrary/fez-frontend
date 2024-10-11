import React from 'react';
import RichEditor from './components/RichEditor';

export default React.forwardRef((fieldProps, ref) => {
    return (
        <RichEditor
            onChange={fieldProps?.input?.onChange ?? fieldProps?.onChange}
            value={fieldProps.input?.value ?? fieldProps.value}
            {...fieldProps}
            inputRef={ref}
        />
    );
});
