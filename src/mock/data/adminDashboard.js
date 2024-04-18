export const adminDashboardToday = {
    data: {
        systemalerts: {
            total: 150,
            today: 25,
            assigned: 15,
            unassigned: 135,
        },
        works: {
            processed: 82,
            unprocessed: 15,
        },
        oa: {
            current: 256,
            total: 1256,
        },
    },
};

export const adminDashboardQuickLinks = {
    data: [
        { id: 1, amount: 10, order: 0, title: '2021+ Imported Records with an Author ID and Research Subtypes Only', target: 'https://espace.library.uq.edu.au/records/search?searchQueryParams%5ball%5d=%28author_id:%5b1+TO+%2a%5d%29+AND+%28date:%5b2021%5c-01%5c-01T00%5c:00%5c:00Z+TO+2024%5c-12%5c-31T00%5c:00%5c:00Z+%5d%29+AND+%28subtype:%28%22Article%22%29+OR+subtype:%28%22Critical%22%29+OR+subtype:%28%22Fully%22%29+OR+subtype:%28%22Research+Book%22%29+OR+subtype:%28%22Research+Book+Chapter%22%29%29+AND+%28%28isi_loc:%5b%2a+TO+%2a%5d%29+OR+%28scopus_id:%5b%2a+TO+%2a%5d%29%29+AND+%28%28ismemberof:+UQ:639325%29+OR+%28ismemberof:+UQ:308300%29+OR+%28ismemberof:+UQ:180159%29+OR+%28ismemberof:+UQ:688533%29+OR+%28ismemberof:+UQ:727866%29%29&page=1&pageSize=20&sortBy=score&sortDirection=Desc' },
        { id: 2, amount: 30, order: 1, title: '2022+ Imported Records with no Author ID with subtype exclusions', target: 'https://espace.library.uq.edu.au/records/search?searchQueryParams%5ball%5d=%28%21author_id:%5b1+TO+%2a%5d%29+AND+%28date:%5b2022%5c-01%5c-01T00%5c:00%5c:00Z+TO+2024%5c-12%5c-31T00%5c:00%5c:00Z%5d%29+AND+%28%21subtype:%28%22letter%22%29+OR+%21subtype:%28%22published+abstract%22%29+OR+%21subtype:%28%22review+of+book%22%29+OR+%21subtype:%28%22introduction%22%29+OR+%21subtype:%28%22poster%22%29%29+%28%28ismemberof:+UQ:639325%29+OR+%28ismemberof:+UQ:308300%29+OR+%28ismemberof:+UQ:180159%29+OR+%28ismemberof:+UQ:688533%29+OR+%28ismemberof:+UQ:727866%29%29&page=1&pageSize=20&sortBy=score&sortDirection=Desc' },
        { id: 3, amount: 60, order: 2, title: '2020 - 2023 Imported Records with an Author ID and Research Subtypes Only', target: 'https://espace.library.uq.edu.au/records/search?searchQueryParams%5ball%5d=%28author_id:%5b1+TO+%2a%5d%29+AND+%28date:%5b2020%5c-01%5c-01T00%5c:00%5c:00Z+TO+2023%5c-12%5c-31T00%5c:00%5c:00Z+%5d%29+AND+%28subtype:%28%22Article%22%29+OR+subtype:%28%22Critical%22%29+OR+subtype:%28%22Fully%22%29+OR+subtype:%28%22Research+Book%22%29+OR+subtype:%28%22Research+Book+Chapter%22%29%29+AND+%28%28isi_loc:%5b%2a+TO+%2a%5d%29+OR+%28scopus_id:%5b%2a+TO+%2a%5d%29%29+AND+%28%28ismemberof:+UQ:639325%29+OR+%28ismemberof:+UQ:308300%29+OR+%28ismemberof:+UQ:180159%29+OR+%28ismemberof:+UQ:688533%29+OR+%28ismemberof:+UQ:727866%29%29&page=1&pageSize=20&sortBy=score&sortDirection=Desc' },
        { id: 4, amount: 90, order: 3, title: '2021 - 2023 Imported Records with no Author ID with subtype exclusions', target: 'https://espace.library.uq.edu.au/records/search?searchQueryParams%5ball%5d=%28%21author_id:%5b1+TO+%2a%5d%29+AND+%28date:%5b2021%5c-01%5c-01T00%5c:00%5c:00Z+TO+2023%5c-12%5c-31T00%5c:00%5c:00Z%5d%29+AND+%28%21subtype:%28%22letter%22%29+OR+%21subtype:%28%22published+abstract%22%29+OR+%21subtype:%28%22review+of+book%22%29+OR+%21subtype:%28%22introduction%22%29+OR+%21subtype:%28%22poster%22%29%29+%28%28ismemberof:+UQ:639325%29+OR+%28ismemberof:+UQ:308300%29+OR+%28ismemberof:+UQ:180159%29+OR+%28ismemberof:+UQ:688533%29+OR+%28ismemberof:+UQ:727866%29%29+AND+%28%21institutional_status:%22Non-UQ%22%29&page=1&pageSize=20&sortBy=score&sortDirection=Desc' },
        { id: 5, amount: 110, order: 4, title: 'Not yet publicly available (with merged metadata)', target: 'https://espace.library.uq.edu.au/records/search?searchQueryParams%5ball%5d=%28isMemberOf:+UQ:676357%29+AND+%28%28doi:%5b%2a+TO+%2a%5d%29+OR+%28isi_loc:%5b%2a+TO+%2a%5d%29+OR+%28scopus_id:%5b%2a+TO+%2a%5d%29%29&page=1&pageSize=20&sortBy=score&sortDirection=Desc' },
        { id: 6, amount: 2345, order: 5, title: 'eSpace Followup', target: 'https://espace.library.uq.edu.au/records/search?page=1&pageSize=20&sortBy=score&sortDirection=Desc&searchQueryParams%5ball%5d%5bvalue%5d=ismemberof:+UQ:237927&searchQueryParams%5ball%5d%5blabel%5d=&searchMode=advanced' },
    ],
};