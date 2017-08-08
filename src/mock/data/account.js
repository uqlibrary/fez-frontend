/* eslint-disable */
export const accounts = {
    // staff, no espace data
    uqstaff : {
        "id": "uqstaff",
        "class": ["libstaff", "IS_CURRENT"],
        "type": 18,
        "homeLib": "St Lucia",
        "firstName": "J",
        "lastName": "Staff",
        "name": "J STAFF",
        "mail": "j.staff@example.uq.edu.au",
        "barcode": "111111111111111",
        "groups": ["DC=uq,DC=edu,DC=au"],
        "classes": [],
        "expiryDate": "31-12-19",
        "hasSession": true,
        "tokenBased": false,
        "canMasquerade": true,
        "blocked": false
    },
    // student
    s1111111: {
        "id": "s1111111",
        "class": ["IS_UQ_STUDENT_PLACEMENT", "IS_CURRENT"],
        "type": 1,
        "homeLib": "St Lucia",
        "firstName": "J",
        "lastName": "Undegraduate",
        "name": "J Undegraduate",
        "mail": "undegraduate@student.uq.edu.au",
        "barcode": "111111111111111",
        "groups": null,
        "classes": [
            {
            "ACAD_CAREER": "UGRD",
            "DESCR": "Real Estate Development Plg",
            "SUBJECT": "REDE",
            "CATALOG_NBR": "3200",
            "CAMPUS": "STLUC",
            "INSTRUCTION_MODE": "IN",
            "ACAD_GROUP": "SCI",
            "STRM": "6720"
        },
            {
            "ACAD_CAREER": "UGRD",
            "DESCR": "Reg F\/works for Envl Mmgt &",
            "SUBJECT": "ENVM",
            "CATALOG_NBR": "3103",
            "CAMPUS": "STLUC",
            "INSTRUCTION_MODE": "IN",
            "ACAD_GROUP": "SCI",
            "STRM": "6720"}
            ],
        "expiryDate": "31-03-18",
        "hasSession": true,
        "tokenBased": false,
        "canMasquerade": false,
        "blocked": false
    },
    // rhd student
    s2222222: {
        "id": "s1111111",
        "class": ["hass"],
        "type": 2,
        "homeLib": "St Lucia",
        "firstName": "J",
        "lastName": "RHD Student",
        "name": "J RHD Student",
        "mail": "rhd@student.uq.edu.au",
        "barcode": "111111111111111",
        "groups": null,
        "classes": [],
        "expiryDate": "14-12-19",
        "hasSession": true,
        "tokenBased": false,
        "canMasquerade": false,
        "blocked": false
    },
    // researchers
    uqresearcher: {
        'id': 'uqresearcher',
        'class': 'uqd',
        'type': 3,
        'homeLib': 'PACE',
        'firstName': 'J',
        'lastName': 'Researcher',
        'name': 'J Researcher',
        'mail': 'j.researcher@example.uq.edu.au',
        'barcode': '111111111111111',
        'groups': ['DC=uq,DC=edu,DC=au'],
        'classes': [],
        'expiryDate': '31-12-19',
        'hasSession': true,
        'tokenBased': false,
        'canMasquerade': false,
        'blocked': false,
        'position': 'Affil Professorial Research Fellow',
        'org_unit': 'Faculty of Medicine',
        'orcid_id': '0000-0000-0000-00001'
    },
    // expired session
    uqexpired: {
        'hasSession': false
    }
    // upos
    // admins
};
