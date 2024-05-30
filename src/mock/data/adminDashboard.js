export const adminDashboardConfig = {
    admin_users: [
        {id: 123, name: 'Michael Feeney'},
        {id: 23, name: 'Another Staff'},
        {id: 444, name: 'Elizabeth Alvey'},
        {id: 2333, name: 'Lee Sibbald'},
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
    { qlk_id: 4, qlk_amount: 90, qlk_order: 3, qlk_title: '2021 - 2023 Imported Records with no Author ID with subtype exclusions', qlk_link: 'https://espace.library.uq.edu.au/records/search?searchQueryParams%5ball%5d=%28%21author_id:%5b1+TO+%2a%5d%29+AND+%28date:%5b2021%5c-01%5c-01T00%5c:00%5c:00Z+TO+2023%5c-12%5c-31T00%5c:00%5c:00Z%5d%29+AND+%28%21subtype:%28%22letter%22%29+OR+%21subtype:%28%22published+abstract%22%29+OR+%21subtype:%28%22review+of+book%22%29+OR+%21subtype:%28%22introduction%22%29+OR+%21subtype:%28%22poster%22%29%29+%28%28ismemberof:+UQ:639325%29+OR+%28ismemberof:+UQ:308300%29+OR+%28ismemberof:+UQ:180159%29+OR+%28ismemberof:+UQ:688533%29+OR+%28ismemberof:+UQ:727866%29%29+AND+%28%21institutional_status:%22Non-UQ%22%29&page=1&pageSize=20&sortBy=score&sortDirection=Desc' },
    { qlk_id: 5, qlk_amount: 110, qlk_order: 4, qlk_title: 'Not yet publicly available (with merged metadata)', qlk_link: 'https://espace.library.uq.edu.au/records/search?searchQueryParams%5ball%5d=%28isMemberOf:+UQ:676357%29+AND+%28%28doi:%5b%2a+TO+%2a%5d%29+OR+%28isi_loc:%5b%2a+TO+%2a%5d%29+OR+%28scopus_id:%5b%2a+TO+%2a%5d%29%29&page=1&pageSize=20&sortBy=score&sortDirection=Desc' },
    { qlk_id: 6, qlk_amount: 2345, qlk_order: 5, qlk_title: 'eSpace Followup', qlk_link: 'https://espace.library.uq.edu.au/records/search?page=1&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5ball%5d%5bvalue%5d=ismemberof:+UQ:237927&searchQueryParams%5ball%5d%5blabel%5d=&searchMode=advanced' },
];

export const adminDashboardSystemAlerts = [
    {sat_id:1, sat_title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas', sat_content: 'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.', sat_link: 'https://espace.library.uq.edu.au/view/UQ:efd126', sat_created_date: '3/4/2024 15:55:00', sat_assigned_date: null, sat_resolved_date: undefined, sat_assigned_to: undefined, sat_resolved_by: undefined },
    {sat_id:12, sat_title: 'Issues on record - UQ:34555c6', sat_content: 'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.', sat_link: 'https://espace.library.uq.edu.au/view/UQ:efd126', sat_created_date: '3/4/2024 15:55:00', sat_assigned_date: null, sat_resolved_date: undefined, sat_assigned_to: 123, sat_resolved_by: undefined },
    {sat_id:13, sat_title: 'My Works - Claimed Work - UQ:1494946 - uqmdeben', sat_content: 'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.', sat_link: 'https://espace.library.uq.edu.au/view/UQ:efd126', sat_created_date: '3/4/2024 15:55:00', sat_assigned_date: null, sat_resolved_date: undefined, sat_assigned_to: 23, sat_resolved_by: undefined },
    {sat_id:14, sat_title: '(UQ eSpace) Keywords with full stops at the end', sat_content: 'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.', sat_link: 'https://espace.library.uq.edu.au/view/UQ:efd126', sat_created_date: '3/4/2024 15:55:00', sat_assigned_date: null, sat_resolved_date: undefined, sat_assigned_to: undefined, sat_resolved_by: undefined },
    {sat_id:51, sat_title: 'My Works - Disowned Work - UQ:4128e45 - uqsmcor3', sat_content: 'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.', sat_link: 'https://espace.library.uq.edu.au/view/UQ:efd126', sat_created_date: '3/4/2024 15:55:00', sat_assigned_date: null, sat_resolved_date: undefined, sat_assigned_to: 444, sat_resolved_by: undefined },
    {sat_id:16, sat_title: 'My Works - Claimed Work - UQ:e9a2910 - uqnpacha', sat_content: 'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.', sat_link: 'https://espace.library.uq.edu.au/view/UQ:efd126', sat_created_date: '3/4/2024 15:55:00', sat_assigned_date: null, sat_resolved_date: undefined, sat_assigned_to: undefined, sat_resolved_by: undefined },
    {sat_id:71, sat_title: 'My Works - Disowned Work - UQ:02daQbe - uqrelli6', sat_content: 'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.', sat_link: 'https://espace.library.uq.edu.au/view/UQ:efd126', sat_created_date: '3/4/2024 15:55:00', sat_assigned_date: null, sat_resolved_date: undefined, sat_assigned_to: undefined, sat_resolved_by: undefined },
    {sat_id:188, sat_title: 'My Works - Claimed Work - UQ:4489ca8 - uqwtomas', sat_content: 'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.', sat_link: 'https://espace.library.uq.edu.au/view/UQ:efd126', sat_created_date: '3/4/2024 15:55:00', sat_assigned_date: null, sat_resolved_date: undefined, sat_assigned_to: 2333, sat_resolved_by: undefined },
];

export const adminDashboardReportWorksData = [
    {
        id: 1,
        pid: 'UQ:abc123',
        date_created: '9/4/2024 10:44',
        work_type: 'Journal Article - Article (original research)',
        user: 'uqmfeene',
        topic: 'Updated record by O’Keefe, Christopher J, (User ID: 64567)',
    },
    {
        id: 2,
        pid: 'UQ:abc123',
        date_created: '9/4/2024 10:44',
        work_type: 'Journal Article - Article (original research)',
        user: 'uqmfeene',
        topic: 'Updated record by O’Keefe, Christopher J, (User ID: 64567)',
    },
    {
        id: 3,
        pid: 'UQ:abc123',
        date_created: '9/4/2024 10:44',
        work_type: 'Journal Article - Article (original research)',
        user: 'uqmfeene',
        topic: 'Updated record by O’Keefe, Christopher J, (User ID: 64567)',
    },
    {
        id: 4,
        pid: 'UQ:abc123',
        date_created: '9/4/2024 10:44',
        work_type: 'Journal Article - Article (original research)',
        user: 'uqmfeene',
        topic: 'Updated record by O’Keefe, Christopher J, (User ID: 64567)',
    },
    {
        id: 5,
        pid: 'UQ:abc123',
        date_created: '9/4/2024 10:44',
        work_type: 'Journal Article - Article (original research)',
        user: 'uqmfeene',
        topic: 'Updated record by O’Keefe, Christopher J, (User ID: 64567)',
    },
    {
        id: 6,
        pid: 'UQ:abc123',
        date_created: '9/4/2024 10:44',
        work_type: 'Journal Article - Article (original research)',
        user: 'uqmfeene',
        topic: 'Updated record by O’Keefe, Christopher J, (User ID: 64567)',
    },
];

export const adminDashboardReportSystemAlertsData = [
{
    id: 1,
    date_created: '9/4/2024 10:44',
    assigned_to: 'Michael Feeney',
    assigned_date: '9/4/2024 10:44',
    resolved_by: 'Elizabeth Alvey',
    resolved_date: '9/4/2024 10:44',
    title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
    content:
        'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
    link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
},
{
    id: 2,
    date_created: '9/4/2024 10:44',
    assigned_to: 'Michael Feeney',
    assigned_date: '9/4/2024 10:44',
    resolved_by: 'Elizabeth Alvey',
    resolved_date: '9/4/2024 10:44',
    title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
    content:
        'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
    link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
},
{
    id: 3,
    date_created: '9/4/2024 10:44',
    assigned_to: 'Michael Feeney',
    assigned_date: '9/4/2024 10:44',
    resolved_by: 'Elizabeth Alvey',
    resolved_date: '9/4/2024 10:44',
    title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
    content:
        'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
    link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
},
{
    id: 4,
    date_created: '9/4/2024 10:44',
    assigned_to: 'Michael Feeney',
    assigned_date: '9/4/2024 10:44',
    resolved_by: 'Elizabeth Alvey',
    resolved_date: '9/4/2024 10:44',
    title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
    content:
        'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
    link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
},
{
    id: 5,
    date_created: '9/4/2024 10:44',
    assigned_to: 'Michael Feeney',
    assigned_date: '9/4/2024 10:44',
    resolved_by: 'Elizabeth Alvey',
    resolved_date: '9/4/2024 10:44',
    title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
    content:
        'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
    link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
},
{
    id: 6,
    date_created: '9/4/2024 10:44',
    assigned_to: 'Michael Feeney',
    assigned_date: '9/4/2024 10:44',
    resolved_by: 'Elizabeth Alvey',
    resolved_date: '9/4/2024 10:44',
    title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
    content:
        'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
    link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
},
{
    id: 7,
    date_created: '9/4/2024 10:44',
    assigned_to: 'Michael Feeney',
    assigned_date: '9/4/2024 10:44',
    resolved_by: 'Elizabeth Alvey',
    resolved_date: '9/4/2024 10:44',
    title: 'My Works - Claimed Work - UQ:8efd126 - uqwtomas',
    content:
        'User “Tomaszewski, Wojciech (Wojtek) (uqwtomas)” has indicated that they are the author “Tomaszewski, Wojciech (Wojtek) (87054)” on this work.',
    link: 'https://espace.library.uq.edu.au/view/UQ:efd126',
}];