import { loadVocabulariesList } from '../actions';
import { useDispatchOnce } from './useDispatchOnce';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import { PrimitiveValues } from '../@types/general';

export type TransformerType = (
    data: Array<unknown>,
    keyValueList: Array<{ key: string | number; value: PrimitiveValues }>,
) => Array<unknown>;

export type KeyValueItemType = {
    key: string;
    value: string;
};

const defaultState = {
    rawData: [],
    itemsLoaded: false,
    itemsLoading: false,
    itemsKeyValueList: [],
};

export const useControlledVocabs = (cvoId: number, transformer?: TransformerType) => {
    const { itemsKeyValueList, rawData: raw, ...state } =
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        useSelector((state: any) => state.get('controlledVocabulariesReducer')?.[cvoId]) || defaultState;

    const ids = itemsKeyValueList.map((item: KeyValueItemType) => item.key);
    return {
        raw,
        items: useMemo(() => (transformer ? transformer(raw, itemsKeyValueList) : itemsKeyValueList), [cvoId, ids]),
        fetch: useDispatchOnce(state.itemsLoaded, () => loadVocabulariesList(cvoId)),
        ...state,
    };
};
