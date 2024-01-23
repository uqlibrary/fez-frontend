import { CURRENT_LICENCES } from 'config/general';

export function getDownloadLicence(publication) {
    const licence = ((publication && publication.fez_record_search_key_license) || {}).rek_license;
    return CURRENT_LICENCES.find(item => item.value === licence);
}
