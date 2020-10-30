import { useState } from 'react';
import { userIsAdmin } from './userIsAdmin';
import { useRecordsSelectorContext } from 'context';

export const useRecordsSelector = () => {
    const { records } = useRecordsSelectorContext();
    const isAdmin = userIsAdmin();

    const [recordsSelected, setRecordsSelected] = useState({});

    const handleSelectAll = () => {
        if (Object.keys(recordsSelected).length < records.length) {
            setRecordsSelected(prevRecordsSelected =>
                records.reduce(
                    (recordsSelected, record) => ({
                        ...recordsSelected,
                        [record.rek_pid]: record,
                    }),
                    prevRecordsSelected,
                ),
            );
        } else {
            setRecordsSelected({});
        }
    };

    const handleClick = (record, isSelected) => {
        setRecordsSelected(prevRecordsSelected => {
            if (isSelected) {
                return {
                    ...prevRecordsSelected,
                    [record.rek_pid]: record,
                };
            } else {
                // eslint-disable-next-line no-unused-vars
                const { [record.rek_pid]: recordToDeselect, ...rest } = prevRecordsSelected;
                return rest;
            }
        });
    };

    return {
        shouldRenderRecordsSelectors: !!records && isAdmin,
        allSelected: !!records && Object.keys(recordsSelected).length === records.length,
        recordsSelected,
        handleSelectAll,
        handleClick,
    };
};
