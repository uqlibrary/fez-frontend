import { DOI_DATACITE_TYPES } from '../config/general';
import { PrimitiveValues } from '../@types/general';
import { silentTryCatch } from './general';

export const isDataCiteSupportedType = (type: PrimitiveValues): boolean => {
    const parsed = silentTryCatch(() => parseInt(String(type), 10), 0) as number;
    return !!parsed && DOI_DATACITE_TYPES.includes(parsed);
};
