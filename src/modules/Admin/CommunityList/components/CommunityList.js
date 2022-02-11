import React from 'react';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { DataGrid } from '@mui/x-data-grid';
import Typography from '@material-ui/core/Typography';

import { CommunityListButtons } from './CommunityListButtons';
const rows = [
    {
        id: 1,
        title: 'Aboriginal and Torres Strait Islander Studies Unit',
        createdDate: '1/1/2002',
        updatedDate: '1/2/2015',
        thompsonCitationCount: 5,
        scopusCitationCount: 1,
        altmetricScore: 10,
    },
    {
        id: 2,
        title: 'Advanced Computational Modelling Centre',
        createdDate: '1/1/2002',
        updatedDate: '1/2/2015',
        thompsonCitationCount: 2,
        scopusCitationCount: 5,
        altmetricScore: 14,
    },
    {
        id: 3,
        title: 'AustLit - The Resource for Australian Literature',
        createdDate: '1/1/2002',
        updatedDate: '1/2/2015',
        thompsonCitationCount: 5,
        scopusCitationCount: 8,
        altmetricScore: 40,
    },
    {
        id: 4,
        title: 'Australian Centre for Complementary Medicine, Education and Research',
        subTitle: 'testing sub title',
        createdDate: '1/1/2002',
        updatedDate: '1/2/2015',
        thompsonCitationCount: 6,
        scopusCitationCount: 5,
        altmetricScore: 18,
    },
    {
        id: 5,
        title: 'Australian Institute for Bioengineering and Nanotechnology',
        createdDate: '1/1/2002',
        updatedDate: '1/2/2015',
        thompsonCitationCount: 7,
        scopusCitationCount: 5,
        altmetricScore: 19,
    },
    {
        id: 6,
        title: 'Conferences',
        createdDate: '1/1/2002',
        updatedDate: '1/2/2015',
        thompsonCitationCount: 8,
        scopusCitationCount: 5,
        altmetricScore: 6,
    },
    {
        id: 7,
        title: 'Digilib: Architecture Image Library',
        createdDate: '1/1/2002',
        updatedDate: '1/2/2015',
        thompsonCitationCount: 9,
        scopusCitationCount: 5,
        altmetricScore: 16,
    },
    {
        id: 8,
        title: 'ERA',
        createdDate: '1/1/2002',
        updatedDate: '1/2/2015',
        thompsonCitationCount: 5,
        scopusCitationCount: 1,
        altmetricScore: 4,
    },
    {
        id: 9,
        title: 'ERA Non-Traditional Works - Portfolios',
        createdDate: '1/1/2002',
        updatedDate: '1/2/2015',
        thompsonCitationCount: 3,
        scopusCitationCount: 2,
        altmetricScore: 22,
    },
    {
        id: 10,
        title: 'ERA Other Items',
        createdDate: '1/1/2002',
        updatedDate: '1/2/2015',
        thompsonCitationCount: 5,
        scopusCitationCount: 3,
        altmetricScore: 4,
    },
    {
        id: 11,
        title: 'Faculty of Business, Economics and Law',
        createdDate: '1/1/2002',
        updatedDate: '1/2/2015',
        thompsonCitationCount: 6,
        scopusCitationCount: 4,
        altmetricScore: 5,
    },
    {
        id: 12,
        title: 'Faculty of Engineering, Architecture and Information Technology',
        createdDate: '1/1/2002',
        updatedDate: '1/2/2015',
        thompsonCitationCount: 7,
        scopusCitationCount: 6,
        altmetricScore: 8,
    },
    {
        id: 13,
        title: 'Faculty of Health and Behavioural Sciences',
        createdDate: '1/1/2002',
        updatedDate: '1/2/2015',
        thompsonCitationCount: 9,
        scopusCitationCount: 8,
        altmetricScore: 10,
    },
    {
        id: 14,
        title: 'Faculty of Humanities and Social Sciences',
        createdDate: '1/1/2002',
        updatedDate: '1/2/2015',
        thompsonCitationCount: 15,
        scopusCitationCount: 11,
        altmetricScore: 12,
    },
    {
        id: 15,
        title: 'Faculty of Medicine',
        createdDate: '1/1/2002',
        updatedDate: '1/2/2015',
        thompsonCitationCount: 35,
        scopusCitationCount: 5,
        altmetricScore: 11,
    },
];
export const CommunityList = () => {
    const [pageSize, setPageSize] = React.useState(5);
    const columns = [
        { field: 'id', headerName: 'ID', width: 0 },
        {
            field: 'title',
            headerName: 'Title',
            width: 480,

            renderCell: cellValues => {
                return !!cellValues.row.subTitle ? (
                    <div>
                        <Typography variant="body2">{cellValues.row.title}</Typography>{' '}
                        <Typography variant="caption">{cellValues.row.subTitle}</Typography>
                    </div>
                ) : (
                    <Typography variant="body2">{cellValues.row.title}</Typography>
                );
            },
        },
        {
            field: 'createdDate',
            headerName: 'Created',
            type: 'date',
            width: 110,
        },
        {
            field: 'updatedDate',
            headerName: 'Updated',
            type: 'date',
            width: 110,
        },
        {
            field: 'thompsonCitationCount',
            headerName: 'Thompson',
            type: 'text',
            width: 100,
        },
        {
            field: 'scopusCitationCount',
            headerName: 'Scopus',
            type: 'text',
            width: 80,
        },
        {
            field: 'altmetricScore',
            headerName: 'Altmetric',
            type: 'text',
            width: 100,
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 290,
            sortable: false,
            filterable: false,
            hideable: false,
            renderCell: () => {
                return <CommunityListButtons />;
            },

            // return (
            //     <Button
            //         variant="contained"
            //         color="primary"
            //         onClick={event => {
            //             handleClick(event, cellValues);
            //         }}
            //     >
            //         Edit
            //     </Button>
            // );
        },
    ];
    const txt = {
        title: 'List of Communities',
        headings: 'none',
    };

    return (
        <StandardPage title={txt.title}>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    initialState={{
                        columns: {
                            columnVisibilityModel: {
                                id: false,
                                createdDate: false,
                                updatedDate: false,
                            },
                        },
                    }}
                    rows={rows}
                    columns={columns}
                    pageSize={pageSize}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                    onPageSizeChange={newSize => setPageSize(newSize)}
                    checkboxSelection
                    disableSelectionOnClick
                />
            </div>
        </StandardPage>
    );
};

export default React.memo(CommunityList);
