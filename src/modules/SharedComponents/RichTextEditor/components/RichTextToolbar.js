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
import MenuButtonLetterCase from './toolbar/LetterCase/MenuButtonLetterCase';
import MenuButtonSpecialCharacters from './toolbar/SpecialCharacters/MenuButtonSpecialCharacters';

const RichTextToolbar = ({ onOpenSpecialCharacters, singleLine = false }) => (
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
        <MenuButtonLetterCase />
        <MenuButtonRemoveFormatting />
        <MenuButtonSpecialCharacters onOpen={onOpenSpecialCharacters} />

        <MenuDivider />

        <MenuButtonUndo />
        <MenuButtonRedo />
    </MenuControlsContainer>
);

RichTextToolbar.propTypes = {
    editor: PropTypes.object,
    onOpenSpecialCharacters: PropTypes.func,
    singleLine: PropTypes.bool,
};

export default RichTextToolbar;
