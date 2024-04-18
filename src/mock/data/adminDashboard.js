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
        { id: 1, title: '2021+ Imported Records with an Author ID and Research Subtypes Only', amount: 10 },
        { id: 2, title: '2021+ Imported Records with no Author ID with subtype exclusions', amount: 30 },
        { id: 3, title: '2016 - 2020 Imported Records with an Author ID and Research Subtypes Only', amount: 60 },
        { id: 4, title: '2016 - 2020 Imported Records with no Author ID with subtype exclusions', amount: 90 },
        { id: 5, title: 'Not yet publicly available (with merged metadata)', amount: 110 },
        { id: 6, title: 'Not yet publicly available (classic)', amount: 2345 },
    ],
};