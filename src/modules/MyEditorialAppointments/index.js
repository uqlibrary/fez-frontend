import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@mui/material/GridLegacy';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import MyEditorialAppointmentsList from './MyEditorialAppointmentsList';

import { default as componentLocale } from 'locale/components';
import { default as locale } from 'locale/pages';
import {
    addMyEditorialAppointments,
    clearMyEditorialAppointmentsAddStatus,
    deleteMyEditorialAppointmentsListItem,
    dismissAppAlert,
    loadMyEditorialAppointmentsList,
    showAppAlert,
    updateMyEditorialAppointmentsListItem,
} from 'actions';

export const MyEditorialAppointments = () => {
    const dispatch = useDispatch();

    const {
        myEditorialAppointmentsAddError,
        myEditorialAppointmentsAddSuccess,
        myEditorialAppointmentsList,
        myEditorialAppointmentsListError,
        myEditorialAppointmentsListLoading,
    } = useSelector(state => state.get('myEditorialAppointmentsReducer'));

    const handleRowAdd = newData => {
        return dispatch(addMyEditorialAppointments(newData));
    };

    const handleRowUpdate = (newData, oldData) => {
        return dispatch(updateMyEditorialAppointmentsListItem(newData, oldData));
    };

    const handleRowDelete = oldData => {
        return dispatch(deleteMyEditorialAppointmentsListItem(oldData));
    };

    const clearAddStatus = () => {
        dispatch(dismissAppAlert());
        dispatch(clearMyEditorialAppointmentsAddStatus());
    };

    React.useEffect(() => {
        if (!myEditorialAppointmentsList) {
            dispatch(loadMyEditorialAppointmentsList());
        }

        return clearAddStatus;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (myEditorialAppointmentsAddSuccess) {
            dispatch(
                showAppAlert({
                    ...componentLocale.components.myEditorialAppointmentsList.successAlert,
                    dismissAction: clearAddStatus,
                }),
            );
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [myEditorialAppointmentsAddSuccess]);

    if (myEditorialAppointmentsListLoading) {
        return (
            <StandardPage>
                <InlineLoader message={locale.pages.editorialAppointments.loadingMessage} />
            </StandardPage>
        );
    }

    return (
        <StandardPage title={locale.pages.editorialAppointments.title}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    {<Alert {...componentLocale.components.myEditorialAppointmentsList.infoTextAlert} />}
                </Grid>
                {!!myEditorialAppointmentsListError && (
                    <Grid item xs={12}>
                        <Alert
                            {...myEditorialAppointmentsListError}
                            type="error"
                            alertId="alert-error-my-editorial-appointments-list"
                        />
                    </Grid>
                )}
                {!!myEditorialAppointmentsAddError && (
                    <Grid item xs={12}>
                        <Alert
                            {...myEditorialAppointmentsAddError}
                            type="error"
                            alertId="alert-error-my-editorial-appointments-add"
                        />
                    </Grid>
                )}
                <Grid item xs={12}>
                    {!!myEditorialAppointmentsList && (
                        <StandardCard hideTitle>
                            <MyEditorialAppointmentsList
                                handleRowAdd={handleRowAdd}
                                handleRowUpdate={handleRowUpdate}
                                handleRowDelete={handleRowDelete}
                                list={myEditorialAppointmentsList}
                            />
                        </StandardCard>
                    )}
                </Grid>
            </Grid>
        </StandardPage>
    );
};

export default React.memo(MyEditorialAppointments);
