import * as React from 'react';
import { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { locale } from 'locale';
import { addFavourites } from 'actions/journalUserLists';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import SplitButtonMenu, { SplitButtonItem } from 'modules/SharedComponents/Toolbox/SplitButtonMenu/SplitButtonMenu';

// TODO remove hardcoded list
const list: SplitButtonItem[] = [{ id: 'favourites', label: 'Favourites' }];

const AddToListButton: React.FC<{
    selectedJournals: Record<string, object>;
    clearSelectedJournals: (selection: object) => void;
}> = ({ selectedJournals = /* istanbul ignore next */ {}, clearSelectedJournals }) => {
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
        dispatch(addFavourites(Object.keys(selectedJournals))).then(() => {
            setIsDialogOpen(true);
            setTimeout(closeDialog, 1000);
        });
    };

    /* istanbul ignore next */
    const sortedList = useMemo(() => list.sort((a, b) => a.label.localeCompare(b.label)), [list]);

    /* istanbul ignore next */
    const handleAddNewList = () => {};

    return (
        <>
            <ConfirmationBox
                confirmationBoxId="add-to-favourites-confirmation-box"
                hideCancelButton
                isOpen={isDialogOpen}
                // @ts-expect-error TODO fix once converted to TS
                locale={{
                    ...txt.confirmations.addFavourites,
                    confirmationMessage: selectionCount
                        ? txt.confirmations.addFavourites.confirmationMessage.replace('COUNT', String(selectionCount))
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
