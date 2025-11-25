import * as React from 'react';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import NewLabelRounded from '@mui/icons-material/NewLabelTwoTone';
import { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { SelectedSearchCriteriaItem } from './SelectedSearchCriteriaItem';
import { ForCodeAutocompleteField } from './ForCodeAutocompleteField';
import { useSelector } from 'react-redux';
import { AppState } from 'reducer';

const BorderedChip = styled(SelectedSearchCriteriaItem)(() => ({
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
    const inputRef = useRef<HTMLInputElement | null>(null);
    // unless it gets moved to its parent, we want to keep this hard dependency in here to avoid unnecessary rendering
    // of other comps
    const { journalsListLoading } = useSelector((state: AppState) => state?.get('searchJournalsReducer'));

    // set focus to dropdown upon displaying it
    useEffect(() => inputRef.current?.focus(), [isOpen]);

    if (!isOpen) {
        // TODO move it to location
        const title = 'Add a subject to refine result';
        const button = (
            <IconButton
                color="info"
                onClick={() => setIsOpen(true)}
                data-testid="add-to-subject-selection-button"
                disabled={journalsListLoading}
                aria-label={title}
            >
                <NewLabelRounded />
            </IconButton>
        );

        return (
            <Tooltip title={title} describeChild>
                {journalsListLoading ? <span>{button}</span> : button}
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
            type={'Subject'}
            onDelete={close}
            sx={{
                '& .MuiChip-label > .MuiAutocomplete-root': { minWidth: 220 },
            }}
        >
            <ForCodeAutocompleteField
                onChange={handleOnAdd}
                onKeyDown={(e: React.KeyboardEvent) => {
                    if (e.key !== 'Escape') return;
                    e.stopPropagation();
                    close();
                }}
                ref={inputRef}
            />
        </BorderedChip>
    );
};

export default React.memo(AddToSelectedSubjects);
