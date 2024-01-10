import React from 'react';
import PropTypes from 'prop-types';
import AdminActions from './AdminActions';
import * as actions from 'actions';

import CollectionsListEmbedded from './CollectionsListEmbedded';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useSelector, useDispatch } from 'react-redux';
import Grid from '@mui/material/Grid';

export const CommunityDataRow = ({ conf, row, adminUser, labels, autoCollapse }) => {
    const dispatch = useDispatch();

    const collectionsOpen = useSelector(state => state.get('viewCollectionsReducer').collectionsOpened);

    const open = collectionsOpen.indexOf(row.rek_pid) > -1;

    const handleSetOpen = openState => {
        if (autoCollapse) {
            dispatch(actions.clearCCCollectionsList());
        }
        dispatch(actions.setCollectionsArray({ pid: row.rek_pid, open: openState }));
    };

    return (
        <Grid
            container
            key={row.rek_pid}
            data-testid={`row-${row.rek_pid}`}
            sx={{ boxSizing: 'border-box', boxShadow: '0 -1px 0 #eaeaea', padding: '15px 0px 0px' }}
        >
            <React.Fragment key={row.rek_pid}>
                <Grid container sx={{ paddingBottom: '10px' }}>
                    <Grid item xs={1} sm={1} md={1}>
                        <Box sx={1}>
                            <IconButton
                                sx={{ paddingTop: '5px' }}
                                aria-label="expand row"
                                size="small"
                                onClick={() => handleSetOpen(!open)}
                                id={`expand-row-${row.cvo_id}`}
                                data-analyticsid={`expand-row-${row.cvo_id}`}
                                data-testid={`expand-row-${row.cvo_id}`}
                            >
                                {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                            </IconButton>
                        </Box>
                    </Grid>
                    <Grid item xs={1} sm={1} md={1}>
                        <Box sx={1}>{row.cvo_id}</Box>
                    </Grid>
                    <Grid item xs={1} sm={1} md={4}>
                        <Box sx={1}>{row.cvo_title}</Box>
                    </Grid>
                    <Grid item xs={1} sm={1} md={1}>
                        <Box sx={1}>{row.cvo_order}</Box>
                    </Grid>
                    <Grid item xs={1} sm={1} md={1}>
                        <Box sx={1}>{/* row.cvo_image_filename*/}</Box>
                    </Grid>
                    <Grid item xs={1} sm={1} md={1}>
                        <Box sx={1}>{row.cvo_external_id}</Box>
                    </Grid>
                    <Grid item xs={1} sm={1} md={1}>
                        <Box sx={1}>{/* row.cvo_path*/}</Box>
                    </Grid>
                    <Grid item md={2} xs={2} sm={2}>
                        <AdminActions
                            record={row.rek_pid}
                            id={`admin-actions-${row.rek_pid}`}
                            data-testid={`admin-actions-${row.rek_pid}`}
                        />
                    </Grid>
                </Grid>
                {!!open && (
                    <Grid container>
                        <Grid item xs={12}>
                            <CollectionsListEmbedded
                                title={row.rek_title}
                                key={row.rek_pid}
                                pid={row.rek_pid}
                                labels={labels}
                                conf={conf}
                                adminUser={adminUser}
                                open={open}
                            />
                        </Grid>
                    </Grid>
                )}
            </React.Fragment>
        </Grid>
    );
};
CommunityDataRow.propTypes = {
    conf: PropTypes.object,
    row: PropTypes.object,
    adminUser: PropTypes.bool,
    labels: PropTypes.object,
    autoCollapse: PropTypes.bool,
};
export default CommunityDataRow;
