import React from 'react';
import PropTypes from 'prop-types';
import {
    MenuControlsContainer,
    MenuDivider,
    MenuButtonBold,
    MenuButtonItalic,
    MenuButtonUnderline,
    MenuButtonStrikethrough,
    MenuButtonSubscript,
    MenuButtonSuperscript,
    MenuButtonEditLink,
    MenuButtonBulletedList,
    MenuButtonOrderedList,
    MenuButtonRemoveFormatting,
    MenuButtonUndo,
    MenuButtonRedo,
} from 'mui-tiptap';

const RichTextToolbar = ({ singleLine = false }) => (
    <MenuControlsContainer>
        <MenuButtonBold />
        <MenuButtonItalic />
        <MenuButtonUnderline />
        <MenuButtonStrikethrough />
        <MenuButtonSubscript />
        <MenuButtonSuperscript />

        {!singleLine && (
            <>
                <MenuDivider />
                <MenuButtonEditLink />
                <MenuButtonOrderedList />
                <MenuButtonBulletedList />
            </>
        )}

        <MenuDivider />
        <MenuButtonRemoveFormatting />

        <MenuDivider />

        <MenuButtonUndo />
        <MenuButtonRedo />
    </MenuControlsContainer>
);

RichTextToolbar.propTypes = {
    editor: PropTypes.object,
    singleLine: PropTypes.bool,
};

export default RichTextToolbar;
