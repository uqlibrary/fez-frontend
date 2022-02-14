import React from 'react';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import MUIDataTable from 'mui-datatables';
// import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useIsUserSuperAdmin } from 'hooks';
import Typography from '@material-ui/core/Typography';
import AdminActions from './AdminActions';
import { communitySearchList } from 'mock/data';
import moment from 'moment';
// const theme = createTheme();

const communityList = communitySearchList.data.filter(object => object.rek_display_type === 11);

const options = {
    filterType: 'checkbox',
    rowsPerPageOptions: [10, 20, 50, 100],
    serverSide: false,
    viewColumns: false,
    onTableChange: (action, tableState) => {
        console.log(action, tableState);
    },
};
export const CommunityList = () => {
    const isSuperAdmin = useIsUserSuperAdmin();
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
                customBodyRender: value => {
                    return moment(value)
                        .local()
                        .format('ddd MMM DD YYYY, hh:mm:ss A');
                },
            },
        },
        {
            name: 'rek_updated_date',
            label: 'Updated Date',
            options: {
                filter: false,
                sort: true,
                customBodyRender: value => {
                    return moment(value)
                        .local()
                        .format('ddd MMM DD YYYY, hh:mm:ss A');
                },
            },
        },
        {
            name: 'actions',
            label: 'Actions',
            options: {
                filter: false,
                sort: false,
                display: isSuperAdmin,
                customBodyRender: (value, rowArrayData) => {
                    console.log('ISSUPERADMIN', isSuperAdmin);
                    return isSuperAdmin ? <AdminActions record={rowArrayData.rowData[0]} /> : '';
                },
            },
        },
        {
            name: 'citationCount',
            label: 'Citation Count',
            options: {
                display: 'excluded',
                filter: false,
                sort: false,
            },
        },
    ];

    const txt = {
        title: 'List of Communities',
        headings: 'none',
    };
    return (
        <StandardPage title={txt.title}>
            <MUIDataTable
                title={txt.title}
                data={communityList}
                columns={columns}
                options={options}
                rowsPerPageOptions={[10, 20, 50, 100]}
            />
        </StandardPage>
    );
};

export default React.memo(CommunityList);
