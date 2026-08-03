import { FezRecord, OneToManyRelation } from '../@types/models/FezRecord';

export const getOneToManyRelationItemByOrder = (
    record: FezRecord,
    key: string,
    order: number,
): undefined | OneToManyRelation => {
    if (order < 1) return undefined;

    const cleanKey = key?.trim?.().replace?.('rek_', '');
    if (!cleanKey) return undefined;

    return (record?.[`fez_record_search_key_${cleanKey}`] as OneToManyRelation[])?.find?.(
        item => item[`rek_${cleanKey}_order`] === order,
    );
};
