import React from 'react';
import PropTypes from 'prop-types';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicExtended from 'ckeditor5-build-classic-extended';
import Typography from '@mui/material/Typography';

const RichEditor = fieldProps => {
    function getCkEditorConfig() {
        const singleLineItems = ['rek-title']; // fields which don't have paragraphs entered so don't get multi-line controls
        const extraButtons = singleLineItems.includes(fieldProps.richEditorId)
            ? []
            : ['|', 'link', 'numberedList', 'bulletedList'];
        return {
            toolbar: [
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'subscript',
                'superscript',
                ...extraButtons,
                '|',
                'removeFormat',
                'specialCharacters',
                '|',
                'undo',
                'redo',
            ],
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
        if (fieldProps.input?.value?.get) {
            dataForEditor = fieldProps.input.value.get('htmlText');
            /* istanbul ignore next */
        } else if (!!fieldProps && fieldProps.hasOwnProperty('value')) {
            if (!!fieldProps.value.get && !!fieldProps.value.get('htmlText')) {
                dataForEditor = fieldProps.value.get('htmlText');
            } else if (!!fieldProps.value.htmlText) {
                /* istanbul ignore next */
                dataForEditor = fieldProps.value.htmlText;
            } else if (typeof fieldProps.value === 'string' && fieldProps.value.length > 0) {
                dataForEditor = fieldProps.value;
            }
        }
        return dataForEditor;
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
                editor={ClassicExtended}
                config={getCkEditorConfig()}
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
    title: PropTypes.string,
    value: PropTypes.string,
};

RichEditor.defaultProps = {
    className: '',
    disabled: false,
    required: false,
    value: '',
};

export default RichEditor;
