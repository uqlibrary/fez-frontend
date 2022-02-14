import React from 'react';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import MUIDataTable from 'mui-datatables';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@material-ui/core/Typography';
import AdminActions from './AdminActions';
import { communitySearchList } from 'mock/data';
const theme = createTheme();

const communityList = communitySearchList.data.filter(object => object.rek_display_type === 11);

const columns = [
    {
        name: 'rek_pid',
        label: 'ID',
        options: {
            filter: false,
            sort: false,
            display: 'excluded',
        },
    },
    {
        name: 'rek_title',
        label: 'Title',
        options: {
            filter: true,
            sort: true,
            customBodyRender: (value, tableMeta) => {
                return !!tableMeta.rowData[2] ? (
                    <div>
                        <Typography variant="body2">
                            <a href="#">{value}</a>
                        </Typography>
                        <Typography variant="caption">{tableMeta.rowData[2]}</Typography>
                    </div>
                ) : (
                    <Typography variant="body2">
                        <a href={`/view/${tableMeta.rowData[0]}`}>{value}</a>
                    </Typography>
                );
            },
        },
    },

    {
        name: 'rek_description',
        label: 'Description',
        options: {
            display: 'excluded',
            filter: false,
        },
    },

    {
        name: 'rek_created_date',
        label: 'Created Date',
        options: {
            filter: false,
            sort: true,
        },
    },
    {
        name: 'rek_updated_date',
        label: 'Updated Date',
        options: {
            filter: false,
            sort: true,
            // customBodyRender: value => {
            //     return <AdminActions record={rowArrayData.rowData[0]} />;
            // },
        },
    },
    {
        name: 'actions',
        label: 'Actions',
        options: {
            filter: false,
            sort: false,
            customBodyRender: (value, rowArrayData) => {
                return <AdminActions record={rowArrayData.rowData[0]} />;
            },
        },
    },
    {
        name: 'citationCount',
        label: 'Citation Count',
        options: {
            display: 'excluded',
            filter: true,
            sort: false,
        },
    },
];

// const data = [
//     { name: 'Joe James', company: 'Test Corp', city: 'Yonkers', state: 'NY' },
//     { name: 'John Walsh', company: 'Test Corp', city: 'Hartford', state: 'CT' },
//     { name: 'Bob Herm', company: 'Test Corp', city: 'Tampa', state: 'FL' },
//     { name: 'James Houston', company: 'Test Corp', city: 'Dallas', state: 'TX' },
// ];

// const rows = [
//     {
//         id: 1,
//         title: 'Aboriginal and Torres Strait Islander Studies Unit',
//         createdDate: '1/1/2002',
//         updatedDate: '1/2/2015',
//         citationCount: 5,
//         scopusCitationCount: 1,
//         altmetricScore: 10,
//     },
//     {
//         id: 2,
//         title: 'Advanced Computational Modelling Centre',
//         createdDate: '1/1/2002',
//         updatedDate: '1/2/2015',
//         citationCount: 2,
//         scopusCitationCount: 5,
//         altmetricScore: 14,
//     },
//     {
//         id: 3,
//         title: 'AustLit - The Resource for Australian Literature',
//         createdDate: '1/1/2002',
//         updatedDate: '1/2/2015',
//         citationCount: 5,
//         scopusCitationCount: 8,
//         altmetricScore: 40,
//     },
//     {
//         id: 4,
//         title: 'Australian Centre for Complementary Medicine, Education and Research',
//         subTitle: 'testing sub title',
//         createdDate: '1/1/2002',
//         updatedDate: '1/2/2015',
//         citationCount: 6,
//         scopusCitationCount: 5,
//         altmetricScore: 18,
//     },
//     {
//         id: 5,
//         title: 'Australian Institute for Bioengineering and Nanotechnology',
//         createdDate: '1/1/2002',
//         updatedDate: '1/2/2015',
//         citationCount: 7,
//         scopusCitationCount: 5,
//         altmetricScore: 19,
//     },
//     {
//         id: 6,
//         title: 'Conferences',
//         createdDate: '1/1/2002',
//         updatedDate: '1/2/2015',
//         citationCount: 8,
//         scopusCitationCount: 5,
//         altmetricScore: 6,
//     },
//     {
//         id: 7,
//         title: 'Digilib: Architecture Image Library',
//         createdDate: '1/1/2002',
//         updatedDate: '1/2/2015',
//         citationCount: 9,
//         scopusCitationCount: 5,
//         altmetricScore: 16,
//     },
//     {
//         id: 8,
//         title: 'ERA',
//         createdDate: '1/1/2002',
//         updatedDate: '1/2/2015',
//         citationCount: 5,
//         scopusCitationCount: 1,
//         altmetricScore: 4,
//     },
//     {
//         id: 9,
//         title: 'ERA Non-Traditional Works - Portfolios',
//         createdDate: '1/1/2002',
//         updatedDate: '1/2/2015',
//         citationCount: 3,
//         scopusCitationCount: 2,
//         altmetricScore: 22,
//     },
//     {
//         id: 10,
//         title: 'ERA Other Items',
//         createdDate: '1/1/2002',
//         updatedDate: '1/2/2015',
//         citationCount: 5,
//         scopusCitationCount: 3,
//         altmetricScore: 4,
//     },
//     {
//         id: 11,
//         title: 'Faculty of Business, Economics and Law',
//         createdDate: '1/1/2002',
//         updatedDate: '1/2/2015',
//         citationCount: 6,
//         scopusCitationCount: 4,
//         altmetricScore: 5,
//     },
//     {
//         id: 12,
//         title: 'Faculty of Engineering, Architecture and Information Technology',
//         createdDate: '1/1/2002',
//         updatedDate: '1/2/2015',
//         citationCount: 7,
//         scopusCitationCount: 6,
//         altmetricScore: 8,
//     },
//     {
//         id: 13,
//         title: 'Faculty of Health and Behavioural Sciences',
//         createdDate: '1/1/2002',
//         updatedDate: '1/2/2015',
//         citationCount: 9,
//         scopusCitationCount: 8,
//         altmetricScore: 10,
//     },
//     {
//         id: 14,
//         title: 'Faculty of Humanities and Social Sciences',
//         createdDate: '1/1/2002',
//         updatedDate: '1/2/2015',
//         citationCount: 15,
//         scopusCitationCount: 11,
//         altmetricScore: 12,
//     },
//     {
//         id: 15,
//         title: 'Faculty of Medicine',
//         createdDate: '1/1/2002',
//         updatedDate: '1/2/2015',
//         citationCount: 35,
//         scopusCitationCount: 5,
//         altmetricScore: 11,
//     },
// ];
const options = {
    filterType: 'checkbox',
    rowsPerPageOptions: [10, 20, 50, 100],
    serverSide: false,
    onTableChange: (action, tableState) => {
        console.log(action, tableState);
    },
};
export const CommunityList = () => {
    const txt = {
        title: 'List of Communities',
        headings: 'none',
    };
    return (
        <StandardPage title={txt.title}>
            <ThemeProvider theme={theme}>
                <MUIDataTable
                    title={txt.title}
                    data={communityList}
                    columns={columns}
                    options={options}
                    rowsPerPageOptions={[10, 20, 50, 100]}
                />
            </ThemeProvider>
        </StandardPage>
    );
};

export default React.memo(CommunityList);
