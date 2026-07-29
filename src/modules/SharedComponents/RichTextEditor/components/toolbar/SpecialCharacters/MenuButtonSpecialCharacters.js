import React, { useRef, useCallback } from 'react';
import PropTypes from 'prop-types';

import { MenuButton } from 'mui-tiptap';

const MenuButtonSpecialCharacters = ({ onOpen }) => {
    const buttonRef = useRef(null);
    const handleClick = useCallback(() => {
        const button = buttonRef.current;

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
        <>
            <span ref={buttonRef}>
                <MenuButton
                    tooltipLabel="Insert special character"
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
        </>
    );
};

MenuButtonSpecialCharacters.propTypes = {
    onOpen: PropTypes.func.isRequired,
};

export default React.memo(MenuButtonSpecialCharacters);
