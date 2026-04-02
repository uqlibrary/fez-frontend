import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { adminDashboardSystemAlerts } from 'actions/adminDashboard';

const ReportRowActions = ({ row, gridApi }) => {
    const dispatch = useDispatch();

    // to make the component testable
    const [loading, setLoading] = React.useState(false);
    const [success, setSuccess] = React.useState(false);

    const updateRow = updates => {
        gridApi.updateRows([
            {
                sat_id: row.sat_id,
                ...updates,
            },
        ]);
    };

    const handleUnresolve = async () => {
        try {
            // show loading immediately
            setLoading(true);

            await dispatch(adminDashboardSystemAlerts(row.sat_id, { sat_resolved_by: null, sat_resolved_date: null }));

            // update row after success
            updateRow({
                resolved_by_full_name: null,
                sat_resolved_date: null,
            });
            setLoading(false);
            setSuccess(true);
        } catch (error) {
            setLoading(false);
        }
    };

    const getButtonText = () => {
        if (success) return 'Unresolved';
        if (loading) return 'Updating...';
        return 'Unresolve';
    };

    if (!row.resolved_by_full_name && !success) return null;

    return (
        <Button
            variant="outlined"
            size="small"
            disabled={loading || success}
            data-testid={`action-button-${row.sat_id}`}
            onClick={handleUnresolve}
        >
            {getButtonText()}
        </Button>
    );
};

ReportRowActions.propTypes = {
    row: PropTypes.object.isRequired,
    gridApi: PropTypes.object.isRequired,
};

export default React.memo(ReportRowActions);
