import { useRecordContext } from 'context';
import { publicationTypes } from 'config';

export const usePublicationSubtype = (displayType = null) => {
    const { record } = useRecordContext();
    return publicationTypes()[displayType || record.rek_display_type].subtypes;
};
