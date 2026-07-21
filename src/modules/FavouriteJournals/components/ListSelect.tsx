import * as React from 'react';
import { useSelector } from 'react-redux';
import { loadLists } from 'actions';
import { AnyAction } from 'redux';
import { useDispatchOnce } from 'hooks/useDispatchOnce';
import { FezJournalUserList } from 'types/models/FezJournalUserList';
import MenuItem from '@mui/material/MenuItem';
import { JOURNAL_FAVOURITE_LIST_LABEL } from 'config/general';
import { SelectProps } from '@mui/material';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

const getFavouriteId = (lists: FezJournalUserList[]) =>
    lists.find(list => list.fjl_label.toUpperCase() === JOURNAL_FAVOURITE_LIST_LABEL.toUpperCase())?.fjl_id;

const ListSelect: React.FC<SelectProps> = props => {
    const { loading, data: response } = useSelector((state: AnyAction) => state.get?.('journalUserListsReducer'));
    useDispatchOnce(loading || !!response?.data, () => loadLists())();

    if (!response?.data.length) return null;

    const value = props.value || getFavouriteId(response?.data);
    return (
        <FormControl variant="standard" fullWidth>
            <Select
                {...props}
                value={value}
                variant="standard"
                labelId="sort-by-label"
                data-testid="publication-list-sorting-sort-by"
                MenuProps={{
                    PaperProps: {
                        sx: {
                            maxHeight: '50vh',
                        },
                    },
                }}
            >
                {response?.data?.map((item: FezJournalUserList) => (
                    <MenuItem key={item.fjl_id} value={item.fjl_id}>
                        {item.fjl_label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default React.memo(ListSelect);
