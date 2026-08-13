import React, { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import { MenuButton, useRichTextEditorContext } from 'mui-tiptap';

const MenuButtonSpecialCharacters = ({ onOpen }) => {
    const editor = useRichTextEditorContext();
    const buttonRef = useRef(null);
    const handleClick = useCallback(() => {
        const button = buttonRef.current;

        /* istanbul ignore next */
        if (!button) {
            return;
        }

        const rect = button.getBoundingClientRect();

        onOpen({
            x: rect.right + 4,
            y: rect.bottom + 4,
        });
    }, [onOpen]);

    return (
        // Wrap MenuButton to obtain its DOM position for anchoring
        // the special characters popover.
        <span ref={buttonRef}>
            <MenuButton
                tooltipLabel="Insert special character"
                disabled={!editor?.isEditable}
                onClick={handleClick}
                IconComponent={() => (
                    <span
                        style={{
                            fontSize: 20,
                            lineHeight: 1,
                            fontFamily: 'serif',
                        }}
                    >
                        Ω
                    </span>
                )}
            />
        </span>
    );
};

MenuButtonSpecialCharacters.propTypes = {
    onOpen: PropTypes.func.isRequired,
};

export default MenuButtonSpecialCharacters;
