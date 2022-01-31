import { hydrateMock } from '../../hydrateMock';

const collectionRecord = {
    rek_pid: 'UQ:11398',
    rek_title: 'This is a Collection Record',
    rek_display_type: 9,
    rek_display_type_lookup: 'Collection',
    rek_status: 2,
    rek_status_lookup: 'Published',
    rek_object_type: 2,
    rek_object_type_lookup: 'Collection',
    fez_record_search_key_xsd_display_option: [263],
    rek_wok_doc_type_lookup: 'Abstract of Published Item',
};
export default hydrateMock(collectionRecord);
