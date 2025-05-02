import { loadVocabulariesList } from '../actions';
import { useDispatchOnce } from './useDispatchOnce';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';

const defaultState = {
    rawData: [],
    itemsLoaded: false,
    itemsLoading: false,
    itemsKeyValueList: [],
};

export const useControlledVocabs = (cvoId: number, transformer?: (data: Array<unknown>) => Array<unknown>) => {
    const { itemsKeyValueList, rawData: raw, ...state } =
        useSelector((state: any) => state.get('controlledVocabulariesReducer')?.[cvoId]) || defaultState;

    return {
        raw,
        items: useMemo(() => (transformer ? transformer(raw) : itemsKeyValueList), [cvoId, raw.length]),
        fetch: useDispatchOnce(state.itemsLoaded, () => loadVocabulariesList(cvoId)),
        ...state,
    };
};
