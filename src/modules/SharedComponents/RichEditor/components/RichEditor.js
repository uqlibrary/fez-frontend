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
    state,
    error: hasFormError,
    errorText,
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
        if (typeof value === 'string' && value.length > 0) {
            dataForEditor = value;
        } else if (!!value?.htmlText || !!value?.plainText) {
            dataForEditor = value.htmlText || value.plainText || /* istanbul ignore next */ '';
        } else if (!!value?.get) {
            /* istanbul ignore next */
            dataForEditor = value.get('htmlText') || value.get('plainText') || ''; // TODO, remove
        }

        return typeof dataForEditor === 'string' ? dataForEditor : /* istanbul ignore next */ '';
    }

    let error = null;
    // default rich editor has "<p></p>"
    const inputLength = value?.plainText?.length || value?.length - 7;
    if (state && state?.error) {
        error =
            !!state.error.props &&
            React.Children.map(state.error.props.children, (child, index) => {
                if (child.type) {
                    return React.cloneElement(child, {
                        key: index,
                    });
                } else {
                    return child;
                }
            });
    }
    if (!error && hasFormError) {
        if (typeof errorText === 'string') error = errorText;
        else error = errorText.message;
    }

    // rendered content of empty CKEditor:
    // <p><br data-cke-filler="true"></p>
    return (
        <div id={richEditorId} data-testid={richEditorId} data-analyticsid={richEditorId}>
            <span>
                {title && (
                    <Typography color={error && 'error'} {...titleProps}>
                        {title}
                        {required && <span> *</span>}
                    </Typography>
                )}
                {description && (
                    <Typography color={error && 'error'} variant={'caption'}>
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
            {(error || state?.error) && (
                <Typography
                    color="error"
                    variant="caption"
                    component={'span'}
                    style={{
                        display: 'inline-block',
                    }}
                >
                    {error || state.error}
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
                    color={error && 'error'}
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

export default RichEditor;
