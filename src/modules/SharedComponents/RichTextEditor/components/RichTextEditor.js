import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import Typography from '@mui/material/Typography';

import { RichTextEditor as MuiRichTextEditor, LinkBubbleMenu } from 'mui-tiptap';

import RichTextToolbar from './RichTextToolbar';
import { SpecialCharactersPicker } from './toolbar/SpecialCharacters';
import { createExtensions } from './createExtensions';

const editorStyles = () => ({
    '& .MuiTiptap-RichTextField-content': {
        '& .ProseMirror': {
            height: 'auto',

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
    disabled = false,
}) => {
    const content = typeof value === 'string' ? value : value?.htmlText || value?.plainText || '';

    const editorRef = useRef(null);
    const [inputLength, setInputLength] = useState(0);
    const [specialCharacterPicker, setSpecialCharacterPicker] = useState(null);

    const isEditorUsable = editor => !!editor && !editor.isDestroyed && !!editor.editorView?.dom?.isConnected;

    /*
     * Sync editor content when it is populated or updated from an async API response.
     * `emitUpdate: false` prevents triggering the editor change handler and avoids
     * unnecessary update loops back to the form state.
     */
    useEffect(() => {
        const editor = editorRef.current;

        if (!isEditorUsable(editor)) {
            return;
        }

        if (editor.getHTML() !== content) {
            editor.commands.setContent(content, { emitUpdate: false });
        }
    }, [content]);

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

    /*
     * Memoise extensions to keep the same extension instances across renders.
     * Recreating extensions can cause the Tiptap editor to be unnecessarily
     * reinitialised, which may result in stale/destroyed editor instances.
     */
    const extensions = useMemo(
        () =>
            createExtensions({
                singleLine,
                textOnlyOnPaste,
            }),
        [singleLine, textOnlyOnPaste],
    );

    /*
     * Memoise renderControls to avoid recreating the toolbar renderer on every render.
     * The editor instance can exist before the ProseMirror view is mounted. Toolbar
     * buttons rely on editor commands (e.g. editor.can()), so only render controls
     * once the editor view is available and avoid rendering after destruction.
     */
    const renderControls = useCallback(
        editor => {
            if (!isEditorUsable(editor)) {
                return null;
            }

            return <RichTextToolbar singleLine={singleLine} onOpenSpecialCharacters={setSpecialCharacterPicker} />;
        },
        [singleLine],
    );

    return (
        <div id={`${id}-container`} data-testid={`${id}-container`} data-analyticsid={`${id}-container`}>
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
                editable={!disabled}
                extensions={extensions}
                renderControls={renderControls}
                onUpdate={handleUpdate}
                sx={{
                    ...editorStyles(),
                    ...(error && {
                        '&.MuiTiptap-FieldContainer-root': {
                            borderColor: 'error.main',
                        },
                    }),
                }}
                editorProps={{
                    attributes: {
                        ...(id ? { id, 'data-testid': id } : {}),
                    },
                }}
                RichTextFieldProps={{
                    MenuBarProps: {
                        disableSticky: true,
                    },
                }}
            >
                {editor => {
                    editorRef.current = editor;

                    return (
                        <>
                            <LinkBubbleMenu />
                            {/*
                             * NOTE:
                             * The SpecialCharactersPicker is intentionally rendered here instead of inside
                             * the toolbar. Rendering it from the toolbar caused the editor field container
                             * (MuiTiptap-FieldContainer-root) to paint its border above the picker due to
                             * stacking-context/z-index behaviour in mui-tiptap. Keeping the picker as a
                             * sibling of the editor content avoids the border overlapping the popup while
                             * still allowing the toolbar button to control its position.
                             */}
                            <SpecialCharactersPicker
                                open={Boolean(specialCharacterPicker)}
                                position={specialCharacterPicker}
                                onClose={() => setSpecialCharacterPicker(null)}
                            />
                        </>
                    );
                }}
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
    required: PropTypes.bool,
    singleLine: PropTypes.bool,
    textOnlyOnPaste: PropTypes.bool,
    description: PropTypes.string,
    error: PropTypes.bool,
    errorText: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    title: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    titleProps: PropTypes.object,
    disabled: PropTypes.bool,
};

export default RichTextEditor;
