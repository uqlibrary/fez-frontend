import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';

import { RichTextEditor as MuiRichTextEditor, LinkBubbleMenu } from 'mui-tiptap';

import RichTextToolbar from './RichTextToolbar';
import { createExtensions } from './createExtensions';

const editorStyles = singleLine => ({
    '& .MuiTiptap-RichTextField-content': {
        '& .ProseMirror': {
            height: singleLine ? '50px' : '200px',
            overflowY: 'auto',

            '& p': {
                marginBlockEnd: '1em',
            },

            '& a:not([data-type="mention"])': {
                color: '#3872a8',
                textDecoration: 'none',

                '&:hover': {
                    textDecoration: 'underline',
                },
            },
        },
    },
});

const RichTextEditor = ({
    id,
    testId,
    title,
    description,
    instructions,
    maxValue,
    className = '',
    required = false,
    singleLine = false,
    textOnlyOnPaste = true,
    value,
    onChange,
    state,
    error: hasFormError,
    errorText,
    titleProps,
}) => {
    const content = typeof value === 'string' ? value : value?.htmlText || value?.plainText || '';

    const [inputLength, setInputLength] = useState(0);

    let error = null;

    if (state?.error) {
        error = state.error;
    }

    if (!error && hasFormError) {
        error = typeof errorText === 'string' ? errorText : errorText?.message;
    }

    const handleUpdate = useCallback(
        ({ editor }) => {
            const htmlText = editor.getHTML();
            const plainText = editor.getText();

            setInputLength(plainText.length);

            onChange(plainText.length > 0 ? { htmlText, plainText } : null);
        },
        [onChange],
    );

    return (
        <div id={`${id}-container`} data-testid={`${testId}-container`} data-analyticsid={`${testId}-container`}>
            <span>
                {title && (
                    <Typography color={error ? 'error' : undefined} {...titleProps}>
                        {title}
                        {required && <span> *</span>}
                    </Typography>
                )}

                {description && (
                    <Typography color={error ? 'error' : undefined} variant="caption">
                        {description}
                    </Typography>
                )}
            </span>

            <MuiRichTextEditor
                className={className}
                content={content}
                editable
                extensions={createExtensions({
                    singleLine,
                    textOnlyOnPaste,
                })}
                renderControls={() => <RichTextToolbar singleLine={singleLine} />}
                onUpdate={handleUpdate}
                sx={{
                    ...editorStyles(singleLine),
                    ...(error && {
                        '&.MuiTiptap-FieldContainer-root': {
                            borderColor: 'error.main',
                        },
                    }),
                }}
                editorProps={{
                    attributes: {
                        ...(id ? { id } : {}),
                        ...(testId ? { 'data-testid': testId } : {}),
                    },
                }}
                RichTextFieldProps={{
                    MenuBarProps: {
                        disableSticky: true,
                    },
                }}
            >
                {() => (
                    <>
                        <LinkBubbleMenu />
                    </>
                )}
            </MuiRichTextEditor>

            {error && (
                <Typography
                    color="error"
                    variant="caption"
                    component="span"
                    style={{
                        display: 'inline-block',
                    }}
                >
                    {error}
                    {maxValue && <span>&nbsp;-&nbsp;</span>}
                </Typography>
            )}

            {maxValue && (
                <Typography
                    component="span"
                    variant="caption"
                    style={{
                        display: 'inline-block',
                    }}
                    color={error ? 'error' : undefined}
                >
                    {inputLength} characters of {maxValue}
                    {instructions || ''}
                </Typography>
            )}
        </div>
    );
};

RichTextEditor.propTypes = {
    className: PropTypes.string,
    instructions: PropTypes.any,
    maxValue: PropTypes.number,
    state: PropTypes.any,
    onChange: PropTypes.func.isRequired,
    id: PropTypes.string,
    testId: PropTypes.string,
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

export default RichTextEditor;
