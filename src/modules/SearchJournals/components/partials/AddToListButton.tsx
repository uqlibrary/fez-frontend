import * as React from 'react';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { locale } from 'locale';
import { addToFavourites } from 'actions/journals';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import SplitButtonMenu, { SplitButtonItem } from 'modules/SharedComponents/Toolbox/SplitButtonMenu/SplitButtonMenu';

// TODO remove hardcoded list
const list: SplitButtonItem[] = [{ id: 'favourites', label: 'Favourites' }];

const AddToListButton: React.FC<{
    selectedJournals: Record<string, object>;
    clearSelectedJournals: (selection: object) => void;
}> = ({ selectedJournals = {}, clearSelectedJournals }) => {
    const txt = locale.components.searchJournals.journalSearchInterface;
    const dispatch = useDispatch();
    // @ts-expect-error TODO fix once converted to TS
    const adding = useSelector((state: unknown) => state.get?.('favouriteJournalsReducer').add?.loading);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectionCount = Object.keys(selectedJournals).length;
    const disabled = !selectionCount || adding;

    const closeDialog = () => {
        setIsDialogOpen(false);
        clearSelectedJournals({});
    };

    const handleMainClick = () => {
        dispatch(addToFavourites(Object.keys(selectedJournals))).then(() => {
            setIsDialogOpen(true);
            setTimeout(closeDialog, 1000);
        });
    };

    const sortedList = useMemo(() => list.sort((a, b) => a.label.localeCompare(b.label)), [list]);

    const handleAddNewList = () => {};

    return (
        <>
            <ConfirmationBox
                confirmationBoxId="add-to-favourites-confirmation-box"
                hideCancelButton
                isOpen={isDialogOpen}
                // @ts-expect-error TODO fix once converted to TS
                locale={{
                    ...txt.confirmations.addToFavourites,
                    confirmationMessage: selectionCount
                        ? txt.confirmations.addToFavourites.confirmationMessage.replace('COUNT', String(selectionCount))
                        : '',
                }}
                onClose={closeDialog}
            />

            <SplitButtonMenu
                id="add-to-list-menu"
                items={sortedList}
                selectedIndex={selectedIndex}
                onItemSelect={setSelectedIndex}
                onClick={handleMainClick}
                onSettings={handleAddNewList}
                label={item => `Add to ${item.label}`}
                loading={adding}
                disabled={disabled}
                sx={{
                    minWidth: 170,
                    maxWidth: 220,
                }}
            />
        </>
    );
};

export default React.memo(AddToListButton);
