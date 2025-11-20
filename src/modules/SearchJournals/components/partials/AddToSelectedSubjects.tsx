import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import NewLabelRounded from '@mui/icons-material/NewLabelTwoTone';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { SelectedSearchTermTypedItem } from './SelectedSearchTermTypedItem';
import { ForCodeAutocompleteField } from './ForCodeAutocompleteField';

const BorderedChip = styled(SelectedSearchTermTypedItem)(() => ({
    borderRadius: 999,
    border: '1px solid #999',
    paddingLeft: 12,
    backgroundColor: 'rgba(0,0,0,0.06)',
    // keep chip background stable
    '&:hover, &.Mui-focusVisible': {
        backgroundColor: 'rgba(0,0,0,0.06)',
    },
    // apply to chip *only when* its label contains an autocomplete
    '& .MuiChip-label:has(.MuiAutocomplete-root)': {
        width: '100%',
        padding: 0,
        display: 'flex',
        alignItems: 'center',

        '& input': {
            marginLeft: 4,
        },
    },
    // remove underline *only* inside labels that contain autocomplete
    '& .MuiChip-label:has(.MuiAutocomplete-root) .MuiInput-underline:before, & .MuiChip-label:has(.MuiAutocomplete-root) .MuiInput-underline:after':
        {
            borderBottom: 'none !important',
        },
}));

type AddToSelectedSubjects = {
    onAdd: (keyword: { type: string; cvoId: string; text: string }) => void;
};

export const AddToSelectedSubjects: React.FC<AddToSelectedSubjects> = ({ onAdd }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (!isOpen) {
        return (
            <Tooltip title="Add a subject to refine result">
                <IconButton
                    data-testid={'add-to-subject-selection-button'}
                    color="info"
                    onClick={() => setIsOpen(true)}
                >
                    <NewLabelRounded />
                </IconButton>
            </Tooltip>
        );
    }

    const close = () => setIsOpen(false);
    const handleOnAdd = (item: Record<string, string>) => {
        onAdd({ type: 'Subject', cvoId: item.key, text: item.value });
        close();
    };

    return (
        <BorderedChip
            sx={{
                '& .MuiChip-label > .MuiAutocomplete-root': { minWidth: 220 },
            }}
            type={'Subject'}
            onDelete={close}
        >
            <ForCodeAutocompleteField
                onChange={handleOnAdd}
                onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key !== 'Escape') return;
                    e.stopPropagation();
                    close();
                }}
            />
        </BorderedChip>
    );
};

export default React.memo(AddToSelectedSubjects);
