import React from 'react';
import RichEditor from './components/RichEditor';

export default function RichEditorField(fieldProps) {
    console.log('RichEditorField::fieldProps=', fieldProps);
    return (
        <RichEditor
            onChange={fieldProps.input.onChange}
            value={fieldProps.input.value}
            {...fieldProps}
            inputRef={React.createRef()}
        />
    );
}
