import * as React from 'react';
import { FezJournalUserList } from 'types/models/FezJournalUserList';
import MenuItem from '@mui/material/MenuItem';
import { SelectProps } from '@mui/material';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';

type ListSelectProps = SelectProps & {
    lists?: FezJournalUserList[];
    loading?: boolean;
};

const ListSelect: React.FC<ListSelectProps> = ({ lists, loading, ...props }) => {
    if (!lists?.length) return null;

    return (
        <FormControl variant="standard" fullWidth>
            <Select
                {...props}
                value={props.value || ''}
                variant="standard"
                labelId="sort-by-label"
                disabled={loading}
                data-testid="publication-list-sorting-sort-by"
                MenuProps={{
                    PaperProps: {
                        sx: {
                            maxHeight: '50vh',
                        },
                    },
                }}
            >
                {lists.map((item: FezJournalUserList) => (
                    <MenuItem key={item.fjl_id} value={item.fjl_id}>
                        {item.fjl_label}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
};

export default React.memo(ListSelect);
