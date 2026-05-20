import { DOI_DATACITE_TYPES } from '../config/general';
import { PrimitiveValues } from '../@types/general';

export const isDataCiteSupportedType = (type: PrimitiveValues) => {
    const parsed = parseInt(String(type), 10);
    console.log(parsed, DOI_DATACITE_TYPES.includes(parsed));
    return parsed && DOI_DATACITE_TYPES.includes(parsed);
};
