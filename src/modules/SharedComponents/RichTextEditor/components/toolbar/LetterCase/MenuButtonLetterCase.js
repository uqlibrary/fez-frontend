import React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { MenuButton, useRichTextEditorContext } from 'mui-tiptap';
import LetterCaseIcon from './LetterCaseIcon';

const options = [
    {
        label: 'Sentence case',
        command: 'setSentenceCase',
    },
    {
        label: 'lower case',
        command: 'setLowerCase',
    },
    {
        label: 'UPPER CASE',
        command: 'setUpperCase',
    },
    {
        label: 'Title Case',
        command: 'setTitleCase',
    },
];

const MenuButtonLetterCase = () => {
    const editor = useRichTextEditorContext();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleSelect = command => {
        editor.chain().focus()[command]().run();
        handleClose();
    };

    return (
        <>
            <MenuButton
                tooltipLabel="Change case"
                disabled={!editor?.isEditable}
                IconComponent={LetterCaseIcon}
                onClick={handleClick}
            />

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
                {options.map(({ label, command }) => (
                    <MenuItem key={command} onClick={() => handleSelect(command)}>
                        {label}
                    </MenuItem>
                ))}
            </Menu>
        </>
    );
};

export default MenuButtonLetterCase;
