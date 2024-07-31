export const adminDashboardConfig = {
    logged_in_user: {
        id: 2333, name: 'Lee Sibbald'
    },
    admin_users: [
        {id: 123, name: 'Michael Feeney'},
        {id: 23, name: 'Another Staff'},
        {id: 444, name: 'Elizabeth Alvey'},
        {id: 2333, name: 'Lee Sibbald'},
    ],
    legacy_reports: [
        {
            sel_id: 1,
            sel_title: 'Wok ID dups',
            sel_description:
                'List of records with matching ISI Loc with publication after 2007 where neither are in the dups collection',
        },
        {
            sel_id: 2,
            sel_title: 'Scopus ID Dups',
            sel_description:
                'List of records with matching Scopus Id with publication after 2007 where neither are in the dups collection',
        },
        {
            sel_id: 3,
            sel_title: 'DOI Dups',
            sel_description:
                'List of records with matching DOI’s with publication after 2007 where neither are in the dups collection',
        },
        {
            sel_id: 4,
            sel_title: 'UQ Incites Authors',
            sel_description:
                'Data to be uploaded to incites each quarter. Resave csv as xls before uploading.',
        },
    ],
};

export const adminDashboardToday = {
    systemalerts: {
        total: 150,
        today: 25,
        assigned: 15,
        unassigned: 135,
        mine: 8,
    },
    works: {
        processed: 82,
        unprocessed: 15,
    },
    oa: {
        current: 256,
        total: 1256,
    },
};

export const adminDashboardQuickLinks =  [
    { qlk_id: 1, qlk_amount: 10, qlk_order: 1, qlk_title: '2021+ Imported Records with an Author ID and Research Subtypes Only', qlk_link: 'https://espace.library.uq.edu.au/records/search?searchQueryParams%5ball%5d=%28author_id:%5b1+TO+%2a%5d%29+AND+%28date:%5b2021%5c-01%5c-01T00%5c:00%5c:00Z+TO+2024%5c-12%5c-31T00%5c:00%5c:00Z+%5d%29+AND+%28subtype:%28%22Article%22%29+OR+subtype:%28%22Critical%22%29+OR+subtype:%28%22Fully%22%29+OR+subtype:%28%22Research+Book%22%29+OR+subtype:%28%22Research+Book+Chapter%22%29%29+AND+%28%28isi_loc:%5b%2a+TO+%2a%5d%29+OR+%28scopus_id:%5b%2a+TO+%2a%5d%29%29+AND+%28%28ismemberof:+UQ:639325%29+OR+%28ismemberof:+UQ:308300%29+OR+%28ismemberof:+UQ:180159%29+OR+%28ismemberof:+UQ:688533%29+OR+%28ismemberof:+UQ:727866%29%29&page=1&pageSize=20&sortBy=score&sortDirection=Desc' },
    { qlk_id: 7, qlk_amount: null, qlk_order: 6, qlk_title: 'UQ Library', qlk_link: 'https://www.library.uq.edu.au' },
    { qlk_id: 2, qlk_amount: 30, qlk_order: 7, qlk_title: '2022+ Imported Records with no Author ID with subtype exclusions', qlk_link: 'https://espace.library.uq.edu.au/records/search?searchQueryParams%5ball%5d=%28%21author_id:%5b1+TO+%2a%5d%29+AND+%28date:%5b2022%5c-01%5c-01T00%5c:00%5c:00Z+TO+2024%5c-12%5c-31T00%5c:00%5c:00Z%5d%29+AND+%28%21subtype:%28%22letter%22%29+OR+%21subtype:%28%22published+abstract%22%29+OR+%21subtype:%28%22review+of+book%22%29+OR+%21subtype:%28%22introduction%22%29+OR+%21subtype:%28%22poster%22%29%29+%28%28ismemberof:+UQ:639325%29+OR+%28ismemberof:+UQ:308300%29+OR+%28ismemberof:+UQ:180159%29+OR+%28ismemberof:+UQ:688533%29+OR+%28ismemberof:+UQ:727866%29%29&page=1&pageSize=20&sortBy=score&sortDirection=Desc' },
    { qlk_id: 3, qlk_amount: 60, qlk_order: 2, qlk_title: '2020 - 2023 Imported Records with an Author ID and Research Subtypes Only', qlk_link: 'https://espace.library.uq.edu.au/records/search?searchQueryParams%5ball%5d=%28author_id:%5b1+TO+%2a%5d%29+AND+%28date:%5b2020%5c-01%5c-01T00%5c:00%5c:00Z+TO+2023%5c-12%5c-31T00%5c:00%5c:00Z+%5d%29+AND+%28subtype:%28%22Article%22%29+OR+subtype:%28%22Critical%22%29+OR+subtype:%28%22Fully%22%29+OR+subtype:%28%22Research+Book%22%29+OR+subtype:%28%22Research+Book+Chapter%22%29%29+AND+%28%28isi_loc:%5b%2a+TO+%2a%5d%29+OR+%28scopus_id:%5b%2a+TO+%2a%5d%29%29+AND+%28%28ismemberof:+UQ:639325%29+OR+%28ismemberof:+UQ:308300%29+OR+%28ismemberof:+UQ:180159%29+OR+%28ismemberof:+UQ:688533%29+OR+%28ismemberof:+UQ:727866%29%29&page=1&pageSize=20&sortBy=score&sortDirection=Desc' },
    { qlk_id: 4, qlk_amount: null, qlk_order: 3, qlk_title: '2021 - 2023 Imported Records with no Author ID with subtype exclusions', qlk_link: 'https://espace.library.uq.edu.au/records/search?searchQueryParams%5ball%5d=%28%21author_id:%5b1+TO+%2a%5d%29+AND+%28date:%5b2021%5c-01%5c-01T00%5c:00%5c:00Z+TO+2023%5c-12%5c-31T00%5c:00%5c:00Z%5d%29+AND+%28%21subtype:%28%22letter%22%29+OR+%21subtype:%28%22published+abstract%22%29+OR+%21subtype:%28%22review+of+book%22%29+OR+%21subtype:%28%22introduction%22%29+OR+%21subtype:%28%22poster%22%29%29+%28%28ismemberof:+UQ:639325%29+OR+%28ismemberof:+UQ:308300%29+OR+%28ismemberof:+UQ:180159%29+OR+%28ismemberof:+UQ:688533%29+OR+%28ismemberof:+UQ:727866%29%29+AND+%28%21institutional_status:%22Non-UQ%22%29&page=1&pageSize=20&sortBy=score&sortDirection=Desc' },
    { qlk_id: 5, qlk_amount: 110, qlk_order: 4, qlk_title: 'Not yet publicly available (with merged metadata)', qlk_link: 'https://espace.library.uq.edu.au/records/search?searchQueryParams%5ball%5d=%28isMemberOf:+UQ:676357%29+AND+%28%28doi:%5b%2a+TO+%2a%5d%29+OR+%28isi_loc:%5b%2a+TO+%2a%5d%29+OR+%28scopus_id:%5b%2a+TO+%2a%5d%29%29&page=1&pageSize=20&sortBy=score&sortDirection=Desc' },
    { qlk_id: 6, qlk_amount: 2345, qlk_order: 5, qlk_title: 'eSpace Followup', qlk_link: 'https://espace.library.uq.edu.au/records/search?page=1&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5ball%5d%5bvalue%5d=ismemberof:+UQ:237927&searchQueryParams%5ball%5d%5blabel%5d=&searchMode=advanced' },
];

export const adminDashboardSystemAlerts = [
    {sat_id:1, sat_title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas', sat_content: 'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.', sat_link: 'https://espace.library.uq.edu.au/view/UQ:efd126', sat_created_date: '3/4/2024 15:55:00', sat_assigned_date: null, sat_resolved_date: undefined, sat_assigned_to: undefined, sat_resolved_by: undefined },
    {sat_id:12, sat_title: 'Issues on record - UQ:34555c6', sat_content: 'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.', sat_link: 'https://espace.library.uq.edu.au/view/UQ:efd126', sat_created_date: '4/5/2024 15:55:00', sat_assigned_date: null, sat_resolved_date: undefined, sat_assigned_to: 123, sat_resolved_by: undefined },
    {sat_id:13, sat_title: 'My Works - Claimed Work - UQ:1494946 - uqmdeben', sat_content: 'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.', sat_link: 'https://espace.library.uq.edu.au/view/UQ:efd126', sat_created_date: '5/6/2024 15:55:00', sat_assigned_date: null, sat_resolved_date: undefined, sat_assigned_to: 23, sat_resolved_by: undefined },
];

export const adminDashboardReportWorksData = [
    {
        pre_id: 1,
        pre_pid: 'UQ:abc123',
        rek_date: '2024-04-09 10:44:00',
        pre_date: '2024-07-12 03:50:39',
        rek_genre: 'Journal Article',
        rek_subtype: 'Article (original research)',
        usr_username: 'uqmfeene',
        pre_detail: 'Updated record by O’Keefe, Christopher J, (User ID: 64567)',
    },
    {
        pre_id: 2,
        pre_pid: 'UQ:abc123',
        rek_date: '2024-04-09 10:44:00',
        pre_date: '2024-07-12 03:50:39',
        rek_genre: 'Journal Article',
        rek_subtype: 'Article (original research)',
        usr_username: 'uqmfeene',
        pre_detail: 'Updated record by O’Keefe, Christopher J, (User ID: 64567)',
    },
    {
        pre_id: 3,
        pre_pid: 'UQ:abc123',
        rek_date: '2024-04-09 10:44:00',
        pre_date: '2024-07-12 03:50:39',
        rek_genre: 'Journal Article',
        rek_subtype: 'Article (original research)',
        usr_username: 'uqmfeene',
        pre_detail: 'Updated record by O’Keefe, Christopher J, (User ID: 64567)',
    },
    {
        pre_id: 4,
        pre_pid: 'UQ:abc123',
        rek_date: '2024-04-09 10:44:00',
        pre_date: '2024-07-12 03:50:39',  
        rek_genre: 'Journal Article',
        rek_subtype: 'Article (original research)',
        usr_username: 'uqmfeene',
        pre_detail: 'Updated record by O’Keefe, Christopher J, (User ID: 64567)',
    },
    {
        pre_id: 5,
        pre_pid: 'UQ:abc123',
        rek_date: '2024-04-09 10:44:00',
        pre_date: '2024-07-12 03:50:39',        
        rek_genre: 'Journal Article',
        rek_subtype: 'Article (original research)',
        usr_username: 'uqmfeene',
        pre_detail: 'Updated record by O’Keefe, Christopher J, (User ID: 64567)',
    },
    {
        pre_id: 6,
        pre_pid: 'UQ:abc123',
        rek_date: '2024-04-09 10:44:00',
        pre_date: '2024-07-12 03:50:39',
        rek_genre: 'Journal Article',
        rek_subtype: 'Article (original research)',
        usr_username: 'uqmfeene',
        pre_detail: 'Updated record by O’Keefe, Christopher J, (User ID: 64567)',
    },
];

export const adminDashboardReportSystemAlertsData = [
    {
        sat_id: 1,
        sat_create_date: '2024-04-09 10:44:00',
        assigned_to_full_name: 'Michael Feeney',
        assigned_to_name: 'uqmfeen1',
        sat_assigned_date: '2024-04-09 10:44:00',
        resolved_by_full_name: 'Elizabeth Alvey',
        resolved_by_username: 'uqealvey',
        sat_assigned_date: '2024-04-09 10:44:00',
        sat_title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
        sat_content:
            'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
        sat_link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
    },
    {
        sat_id: 2,
        sat_create_date: '2024-04-09 10:44:00',
        assigned_to_full_name: 'Michael Feeney',
        assigned_to_name: 'uqmfeen1',
        sat_assigned_date: '2024-04-09 10:44:00',
        resolved_by_full_name: 'Elizabeth Alvey',
        resolved_by_username: 'uqealvey',
        sat_assigned_date: '2024-04-09 10:44:00',
        sat_title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
        sat_content:
            'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
        sat_link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
    },
    {
        sat_id: 3,
        sat_create_date: '2024-04-09 10:44:00',
        assigned_to_full_name: 'Michael Feeney',
        assigned_to_name: 'uqmfeen1',
        sat_assigned_date: '2024-04-09 10:44:00',
        resolved_by_full_name: 'Elizabeth Alvey',
        resolved_by_username: 'uqealvey',
        sat_assigned_date: '2024-04-09 10:44:00',
        sat_title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
        sat_content:
            'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
        sat_link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
    },
    {
        sat_id: 4,
        sat_create_date: '2024-04-09 10:44:00',
        assigned_to_full_name: 'Michael Feeney',
        assigned_to_name: 'uqmfeen1',
        sat_assigned_date: '2024-04-09 10:44:00',
        resolved_by_full_name: 'Elizabeth Alvey',
        resolved_by_username: 'uqealvey',
        sat_assigned_date: '2024-04-09 10:44:00',
        sat_title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
        sat_content:
            'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
        sat_link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
    },
    {
        sat_id: 5,
        sat_create_date: '2024-04-09 10:44:00',
        assigned_to_full_name: 'Michael Feeney',
        assigned_to_name: 'uqmfeen1',
        sat_assigned_date: '2024-04-09 10:44:00',
        resolved_by_full_name: 'Elizabeth Alvey',
        resolved_by_username: 'uqealvey',
        sat_assigned_date: '2024-04-09 10:44:00',
        sat_title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
        sat_content:
            'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
        sat_link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
    },
    {
        sat_id: 6,
        sat_create_date: '2024-04-09 10:44:00',
        assigned_to_full_name: 'Michael Feeney',
        assigned_to_name: 'uqmfeen1',
        sat_assigned_date: '2024-04-09 10:44:00',
        resolved_by_full_name: 'Elizabeth Alvey',
        resolved_by_username: 'uqealvey',
        sat_assigned_date: '2024-04-09 10:44:00',
        sat_title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
        sat_content:
            'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
        sat_link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
    },
    {
        sat_id: 7,
        sat_create_date: '2024-04-09 10:44:00',
        assigned_to_full_name: 'Michael Feeney',
        assigned_to_name: 'uqmfeen1',
        sat_assigned_date: '2024-04-09 10:44:00',
        resolved_by_full_name: 'Elizabeth Alvey',
        resolved_by_username: 'uqealvey',
        sat_assigned_date: '2024-04-09 10:44:00',
        sat_title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
        sat_content:
            'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
        sat_link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
}];