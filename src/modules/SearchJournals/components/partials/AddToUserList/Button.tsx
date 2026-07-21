import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { locale } from 'locale';
import { addListItems, createList, loadLists } from 'actions/journalUserLists';
import { ConfirmationBox } from 'modules/SharedComponents/Toolbox/ConfirmDialogBox';
import ListSplitButtonMenu, {
    ListSplitButtonItem,
} from 'modules/SharedComponents/Toolbox/ListSplitButtonMenu/ListSplitButtonMenu';
import { FezJournalUserList } from 'types/models/FezJournalUserList';
import AddNewDialog, { FormValues } from './AddNewDialog';
import { AnyAction } from 'redux';

const parseResponse = (response: { data: FezJournalUserList[] }): ListSplitButtonItem[] =>
    response?.data?.map?.(item => ({ id: item.fjl_id, label: item.fjl_label })) || /* istanbul ignore next */ [];

const Button: React.FC<{
    selectedJournals: Record<string, object>;
    clearSelectedJournals: (selection: object) => void;
    onAdd: () => void;
}> = ({ selectedJournals, clearSelectedJournals, onAdd }) => {
    const txt = locale.components.searchJournals.journalSearchInterface;
    const dispatch = useDispatch();
    const adding = useSelector((state: AnyAction) => state.get?.('favouriteJournalsReducer').add?.loading);
    const { loading: loadingList, data: response } = useSelector((state: AnyAction) =>
        state.get?.('journalUserListsReducer'),
    );
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const isListLoaded = useRef(false);
    const [list, setList] = useState(Array<ListSplitButtonItem>);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const addDialogPaperRef = React.useRef<HTMLDivElement>(null);
    const selectedList = list[selectedIndex];
    const selectionCount = Object.keys(selectedJournals || /* istanbul ignore next */ {}).length;
    const loading = adding || loadingList;
    const disabled = !selectionCount || adding || loadingList;

    // load list on render
    useEffect(() => {
        if (isListLoaded.current) return;
        dispatch(loadLists());
        isListLoaded.current = true;
    }, [isListLoaded.current]);

    // parse loaded list
    useEffect(() => {
        setList(parseResponse(response));
    }, [JSON.stringify(response?.data)]);

    const closeDialog = () => {
        setIsDialogOpen(false);
        clearSelectedJournals({});
    };

    const handleMainClick = () => {
        dispatch(
            addListItems({
                id: selectedList?.id,
                ids: Object.keys(selectedJournals || /* istanbul ignore next */ {}),
            }),
        ).then(() => {
            setIsDialogOpen(true);
            setTimeout(closeDialog, 1000);
        });
    };

    const openAddListDialog = () => {
        setIsAddDialogOpen(true);
        setIsMenuOpen(true);
    };

    const closeAddListDialog = () => {
        setIsAddDialogOpen(false);
        // list stays open after cancelling so the user lands back where they were
        setIsMenuOpen(true);
    };

    const handleListCreated = (newItem: ListSplitButtonItem) => {
        setList(prev => [newItem, ...prev]);
        setSelectedIndex(0);
        setIsAddDialogOpen(false);
        setIsMenuOpen(true);
        onAdd?.();
    };

    const onCreate = async ({ label, isPublic }: FormValues) => {
        const response: { data: FezJournalUserList } = await dispatch(
            createList({
                fjl_label: label.trim(),
                fjl_is_public: isPublic,
            }),
        );

        handleListCreated({
            id: response.data.fjl_id,
            label: response.data.fjl_label,
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
                    ...txt.confirmations.addToList,
                    confirmationMessage: selectionCount
                        ? txt.confirmations.addToList.confirmationMessage.replace('COUNT', String(selectionCount))
                        : '',
                }}
                onClose={closeDialog}
            />

            <AddNewDialog
                open={isAddDialogOpen}
                onClose={closeAddListDialog}
                onCreate={onCreate}
                paperRef={addDialogPaperRef}
            />

            <ListSplitButtonMenu
                id="add-to-list-menu"
                items={list}
                selectedIndex={selectedIndex}
                onItemSelect={setSelectedIndex}
                onClick={handleMainClick}
                onAdd={openAddListDialog}
                open={isMenuOpen}
                onOpenChange={setIsMenuOpen}
                clickAwayExcludeRef={addDialogPaperRef}
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
};

export default React.memo(Button);
