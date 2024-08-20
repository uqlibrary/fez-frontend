import React from 'react';
import PropTypes from 'prop-types';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import Editor from '../../../../../custom_modules/ckeditor5-custom-build';
import Typography from '@mui/material/Typography';

const RichEditor = ({
    richEditorId,
    title,
    description,
    instructions,
    maxValue,
    className = '',
    required = false,
    singleLine = false,
    textOnlyOnPaste = true,
    value = {},
    onChange,
    input,
    meta,
    titleProps,
}) => {
    const editorConfig = {
        toolbar: {
            items: [
                'bold',
                'italic',
                'underline',
                'strikethrough',
                'subscript',
                'superscript',
                ...(!!singleLine ? [] : ['|', 'link', 'numberedList', 'bulletedList']),
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

    function handleEditorDataChange(event, editor) {
        const textValue = editor.getData().replace(/<[^>]*>?/gm, '');
        const newTypedValue =
            textValue.length > 0
                ? {
                      htmlText: editor.getData(),
                      plainText: textValue,
                  }
                : null;
        onChange(newTypedValue);
    }

    function getContent() {
        let dataForEditor = '';
        /* istanbul ignore else */
        if (input?.value?.size > 0) {
            dataForEditor = input.value.get('htmlText') || input.value.get('plainText') || '';
        } else if (value) {
            if (!!value.get && !!value.get('htmlText')) {
                dataForEditor = value.get('htmlText');
            } else if (!!value.htmlText) {
                dataForEditor = value.htmlText;
            } else if (typeof value === 'string' && value.length > 0) {
                dataForEditor = value;
            }
        }
        return typeof dataForEditor === 'string' ? dataForEditor : /* istanbul ignore next */ '';
    }

    let error = null;
    // default rich editor has "<p></p>"
    const inputLength = (value && value.plainText && value.plainText.length) || value.length - 7;
    if (meta && meta.error) {
        error =
            !!meta.error.props &&
            React.Children.map(meta.error.props.children, (child, index) => {
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
        <div id={richEditorId} data-testid={richEditorId} data-analyticsid={richEditorId}>
            <span>
                {title && (
                    <Typography color={meta && meta.error && 'error'} {...titleProps}>
                        {title}
                        {required && <span> *</span>}
                    </Typography>
                )}
                {description && (
                    <Typography color={meta && meta.error && 'error'} variant={'caption'}>
                        {description}
                    </Typography>
                )}
            </span>
            <CKEditor
                className={className}
                editor={Editor}
                config={editorConfig}
                data={getContent()}
                onReady={editor => {
                    if (textOnlyOnPaste) {
                        const documentView = editor.editing.view.document;
                        /* istanbul ignore next */
                        documentView.on('clipboardInput', (event, data) => {
                            data.content = editor.data.htmlProcessor.toView(data.dataTransfer.getData('text/plain'));
                        });
                    }
                }}
                onChange={(event, editor) => {
                    handleEditorDataChange(event, editor);
                }}
            />
            {meta && meta.error && (
                <Typography
                    color="error"
                    variant="caption"
                    component={'span'}
                    style={{
                        display: 'inline-block',
                    }}
                >
                    {error || meta.error}
                    {maxValue && <span>&nbsp;-&nbsp;</span>}
                </Typography>
            )}
            {maxValue && (
                <Typography
                    component={'span'}
                    style={{
                        display: 'inline-block',
                    }}
                    variant="caption"
                    color={meta && meta.error && 'error'}
                >
                    {inputLength > 0 ? inputLength : 0} characters of {maxValue}
                    {instructions || ''}
                </Typography>
            )}
        </div>
    );
};

RichEditor.propTypes = {
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
    textOnlyOnPaste: PropTypes.bool,
    description: PropTypes.string,
    title: PropTypes.string,
    value: PropTypes.object,
    titleProps: PropTypes.object,
};

export default RichEditor;
