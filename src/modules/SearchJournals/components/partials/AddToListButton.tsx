import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { locale } from 'locale';
import { addFavourites, loadLists } from 'actions/journalUserLists';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import SplitButtonMenu, { SplitButtonItem } from 'modules/SharedComponents/Toolbox/SplitButtonMenu/SplitButtonMenu';
import { FezJournalUserList } from 'types/models/FezJournalUserList';

const parseResponse = (response: { data: FezJournalUserList[] }): SplitButtonItem[] =>
    response?.data?.map?.(item => ({ id: item.fjl_id, label: item.fjl_label })) || [];

const AddToListButton: React.FC<{
    selectedJournals: Record<string, object>;
    clearSelectedJournals: (selection: object) => void;
    onSettings: () => void;
}> = ({ selectedJournals = /* istanbul ignore next */ {}, clearSelectedJournals, onSettings }) => {
    const txt = locale.components.searchJournals.journalSearchInterface;
    const dispatch = useDispatch();
    // @ts-expect-error TODO fix once converted to TS
    const adding = useSelector((state: unknown) => state.get?.('favouriteJournalsReducer').add?.loading);
    const { loading: loadingList, data: response } = useSelector((state: unknown) =>
        // @ts-expect-error TODO fix once converted to TS
        state.get?.('journalUserListsReducer'),
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [list, setList] = useState(Array<SplitButtonItem>);
    const selectionCount = Object.keys(selectedJournals).length;
    const loading = adding || loadingList;
    const disabled = !selectionCount || adding || loadingList;

    // load list on render
    useEffect(() => {
        dispatch(loadLists());
    }, []);

    // parse loaded list
    useEffect(() => {
        setList(parseResponse(response));
    }, [JSON.stringify(response?.data)]);

    const closeDialog = () => {
        setIsDialogOpen(false);
        clearSelectedJournals({});
    };

    const handleMainClick = () => {
        dispatch(addFavourites({ id: list[selectedIndex]?.id, ids: Object.keys(selectedJournals) })).then(() => {
            setIsDialogOpen(true);
            setTimeout(closeDialog, 1000);
        });
    };

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
                items={list}
                selectedIndex={selectedIndex}
                onItemSelect={setSelectedIndex}
                onClick={handleMainClick}
                onSettings={onSettings}
                label={item => `Add to ${item.label}`}
                loading={loading}
                disabled={disabled}
                sx={{
                    minWidth: 170,
                    maxWidth: 220,
                }}
            />
        </>
    );
};;

export default React.memo(AddToListButton);
