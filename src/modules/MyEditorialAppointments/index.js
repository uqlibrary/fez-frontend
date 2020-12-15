import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Grid from '@material-ui/core/Grid';
import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import MyEditorialAppointmentsList from './MyEditorialAppointmentsList';

import { default as componentLocale } from 'locale/components';
import { default as locale } from 'locale/pages';
import {
    addMyEditorialAppointments,
    deleteMyEditorialAppointmentsListItem,
    loadMyEditorialAppointmentsList,
    updateMyEditorialAppointmentsListItem,
    showAppAlert,
    dismissAppAlert,
} from 'actions';

export const MyEditorialAppointments = () => {
    const dispatch = useDispatch();

    const myEditorialAppointmentsListLoading = useSelector(
        state => state.get('myEditorialAppointmentsReducer').myEditorialAppointmentsListLoading,
    );
    const myEditorialAppointmentsList = useSelector(
        state => state.get('myEditorialAppointmentsReducer').myEditorialAppointmentsList,
    );
    const myEditorialAppointmentsListError = useSelector(
        state => state.get('myEditorialAppointmentsReducer').myEditorialAppointmentsListError,
    );

    const myEditorialAppointmentsAddSuccess = useSelector(
        state => state.get('myEditorialAppointmentsReducer').myEditorialAppointmentsAddSuccess,
    );

    const handleRowAdd = newData => {
        return dispatch(addMyEditorialAppointments(newData));
    };

    const handleRowUpdate = (newData, oldData) => {
        return dispatch(updateMyEditorialAppointmentsListItem(newData, oldData));
    };

    const handleRowDelete = oldData => {
        return dispatch(deleteMyEditorialAppointmentsListItem(oldData));
    };

    React.useEffect(() => {
        if (!myEditorialAppointmentsList) {
            dispatch(loadMyEditorialAppointmentsList());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    React.useEffect(() => {
        if (myEditorialAppointmentsAddSuccess) {
            dispatch(
                showAppAlert({
                    ...componentLocale.components.myEditorialAppointmentsList.successAlert,
                    dismissAction: () => dispatch(dismissAppAlert()),
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
                <Grid item xs={12}>
                    {!!myEditorialAppointmentsListError && <Alert {...myEditorialAppointmentsListError} type="error" />}
                </Grid>
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
