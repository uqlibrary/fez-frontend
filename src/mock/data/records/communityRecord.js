import { hydrateMock } from '../../hydrateMock';

const communityRecord = {
    "rek_pid": "UQ:3883",
    "rek_title": "The University of Queensland Library",
    "rek_description": null,
    "rek_display_type": 11,
    "rek_status": 2,
    "rek_date": null,
    "rek_object_type": 1,
    "rek_security_inherited": 0,
    "rek_security_policy": 5,
    "rek_display_type_lookup": "Community",
    "rek_object_type_lookup": "Community",
    "rek_status_lookup": "Published",
};
export default hydrateMock(communityRecord).data;
