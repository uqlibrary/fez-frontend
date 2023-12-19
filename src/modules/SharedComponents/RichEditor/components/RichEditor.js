import React from 'react';
import PropTypes from 'prop-types';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from '../../../../../custom_modules/ckeditor5-custom-build';
import Typography from '@mui/material/Typography';

const RichEditor = fieldProps => {
    function editorConfig() {
        return {
            toolbar: {
                items: [
                    'bold',
                    'italic',
                    'underline',
                    'strikethrough',
                    'subscript',
                    'superscript',
                    ...(!!fieldProps.singleLine ? [] : ['|', 'link', 'numberedList', 'bulletedList']),
                    '|',
                    'LetterCase',
                    'removeFormat',
                    'specialCharacters',
                    '|',
                    'undo',
                    'redo',
                ],
            },
            removePlugins: ['MediaEmbedToolbar'],
        };
    }

    // A handler executed when the user types or modifies the editor content.
    // It updates the state of the application.
    function handleEditorDataChange(event, editor) {
        const textValue = editor.getData().replace(/<[^>]*>?/gm, '');
        const newTypedValue =
            textValue.length > 0
                ? {
                      htmlText: editor.getData(),
                      plainText: textValue,
                  }
                : null;
        fieldProps.onChange(newTypedValue);
    }

    function getContent() {
        let dataForEditor = '';
        /* istanbul ignore else */
        if (fieldProps?.input?.value?.size > 0) {
            dataForEditor = fieldProps.input.value.get('htmlText') || fieldProps.input.value.get('plainText') || '';
        } else if (!!fieldProps && fieldProps.hasOwnProperty('value')) {
            if (!!fieldProps.value.get && !!fieldProps.value.get('htmlText')) {
                dataForEditor = fieldProps.value.get('htmlText');
            } else if (!!fieldProps.value.htmlText) {
                dataForEditor = fieldProps.value.htmlText;
            } else if (typeof fieldProps.value === 'string' && fieldProps.value.length > 0) {
                dataForEditor = fieldProps.value;
            }
        }
        return typeof dataForEditor === 'string' ? dataForEditor : /* istanbul ignore next */ '';
    }

    let error = null;
    const inputLength =
        (fieldProps.value && fieldProps.value.plainText && fieldProps.value.plainText.length) ||
        fieldProps.value.length - 7; // default rich editor has "<p></p>"
    if (fieldProps.meta && fieldProps.meta.error) {
        error =
            !!fieldProps.meta.error.props &&
            React.Children.map(fieldProps.meta.error.props.children, (child, index) => {
                if (child.type) {
                    return React.cloneElement(child, {
                        key: index,
                    });
                } else {
                    return child;
                }
            });
    }
    // rendered content of empty CKEditor:
    // <p><br data-cke-filler="true"></p>
    return (
        <div
            id={fieldProps.richEditorId}
            data-testid={fieldProps.richEditorId}
            data-analyticsid={fieldProps.richEditorId}
        >
            <span>
                {fieldProps.title && (
                    <Typography color={fieldProps.meta && fieldProps.meta.error && 'error'} {...fieldProps.titleProps}>
                        {fieldProps.title}
                        {fieldProps.required && <span> *</span>}
                    </Typography>
                )}
                {fieldProps.description && (
                    <Typography color={fieldProps.meta && fieldProps.meta.error && 'error'} variant={'caption'}>
                        {fieldProps.description}
                    </Typography>
                )}
            </span>
            <CKEditor
                className={fieldProps.className}
                editor={Editor}
                config={editorConfig()}
                data={getContent()}
                onChange={(event, editor) => {
                    handleEditorDataChange(event, editor);
                }}
            />
            {fieldProps.meta && fieldProps.meta.error && (
                <Typography
                    color="error"
                    variant="caption"
                    component={'span'}
                    style={{
                        display: 'inline-block',
                    }}
                >
                    {error || fieldProps.meta.error}
                    {fieldProps.maxValue && <span>&nbsp;-&nbsp;</span>}
                </Typography>
            )}
            {fieldProps.maxValue && (
                <Typography
                    component={'span'}
                    style={{
                        display: 'inline-block',
                    }}
                    variant="caption"
                    color={fieldProps.meta && fieldProps.meta.error && 'error'}
                >
                    {inputLength > 0 ? inputLength : 0} characters of {fieldProps.maxValue}
                    {fieldProps.instructions || ''}
                </Typography>
            )}
        </div>
    );
};

RichEditor.prototypes = {
    className: PropTypes.string,
    input: PropTypes.object,
    inputRef: PropTypes.any,
    instructions: PropTypes.any,
    maxValue: PropTypes.number,
    meta: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    richEditorId: PropTypes.string,
    required: PropTypes.bool,
    singleLine: PropTypes.bool,
    title: PropTypes.string,
    value: PropTypes.string,
};

RichEditor.defaultProps = {
    className: '',
    disabled: false,
    required: false,
    singleLine: false,
    value: '',
};

export default RichEditor;
