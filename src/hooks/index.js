/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useCallback } from 'react';
import { useRecordContext, useAccountContext, useRecordsSelectorContext } from 'context';
import { publicationTypes } from 'config';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

export const usePublicationSubtype = (displayType = null, isAdmin = false) => {
    const { record } = useRecordContext();
    return (publicationTypes({}, isAdmin)[displayType || record.rek_display_type] || {}).subtypes || [];
};

export const userIsAdmin = () => {
    const { account } = useAccountContext();
    return !!account.is_administrator;
};

export const userIsAuthor = () => {
    const { account } = useAccountContext();
    const { record } = useRecordContext();

    return (
        account &&
        record.fez_record_search_key_author_id &&
        !!record.fez_record_search_key_author_id.some(authors => {
            return parseInt(authors.rek_author_id, 10) === parseInt(account.aut_id, 10);
        })
    );
};

export const useConfirmationState = () => {
    const [isOpen, setIsOpen] = useState(false);

    const showConfirmation = useCallback(() => {
        setIsOpen(true);
    }, []);

    const hideConfirmation = useCallback(() => {
        setIsOpen(false);
    }, []);

    return [isOpen, showConfirmation, hideConfirmation];
};

export const useWidth = () => {
    const theme = useTheme();
    const keys = [...theme.breakpoints.keys].reverse();
    return (
        keys.reduce((output, key) => {
            // eslint-disable-next-line react-hooks/rules-of-hooks
            const matches = useMediaQuery(theme.breakpoints.up(key));
            return !output && matches ? key : output;
        }, null) || 'xs'
    );
};

/**
 * @todo add flag for all selected to check/uncheck checkAll checkbox
 */
export const useRecordsSelector = () => {
    const { records } = useRecordsSelectorContext();

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
        shouldRenderRecordsSelectors: !!records,
        allSelected: !!records && Object.keys(recordsSelected).length === records.length,
        recordsSelected,
        handleSelectAll,
        handleClick,
    };
};
