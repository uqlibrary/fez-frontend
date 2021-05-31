import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import ColumnData from './ColumnData';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import moment from 'moment';
import { upperFirst } from 'lodash';

export const UserDetailsRow = ({ rowData }) => {
    return (
        <Grid container spacing={2}>
            <Grid item xs={2}>
                <ColumnData data={rowData.usr_id} columnDataId={`usr-id-${rowData.tableData.id}`} />
            </Grid>
            <Grid item xs={2}>
                <ColumnData
                    data={rowData.usr_full_name}
                    columnDataId={`usr-full-name-${rowData.tableData.id}`}
                    copiable
                />
            </Grid>
            <Grid item xs={2}>
                <React.Fragment>
                    <ColumnData
                        data={rowData.usr_username}
                        columnDataId={`usr-username-${rowData.tableData.id}`}
                        copiable
                    />
                    {!!rowData.usr_last_login_date && (
                        <Tooltip title="Last login date">
                            <Typography variant="caption">
                                {moment(rowData.usr_last_login_date).format('YYYY-MM-DD HH:mm:ss')}
                            </Typography>
                        </Tooltip>
                    )}
                </React.Fragment>
            </Grid>
            <Grid item xs={3}>
                <ColumnData data={rowData.usr_email} columnDataId={`usr-email-${rowData.tableData.id}`} />
            </Grid>
            <Grid item xs={1}>
                <ColumnData data={upperFirst(rowData.usr_status)} columnDataId={`usr-status-${rowData.tableData.id}`} />
            </Grid>
            <Grid item xs={1}>
                <ColumnData
                    data={rowData.usr_administrator ? 'Yes' : 'No'}
                    columnDataId={`usr-administrator-${rowData.tableData.id}`}
                />
            </Grid>
            <Grid item xs={1}>
                <ColumnData
                    data={rowData.usr_super_administrator ? 'Yes' : 'No'}
                    columnDataId={`usr-super-administrator-${rowData.tableData.id}`}
                />
            </Grid>
        </Grid>
    );
};

UserDetailsRow.propTypes = {
    rowData: PropTypes.object,
};

export default React.memo(UserDetailsRow);
