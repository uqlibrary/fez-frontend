import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import MyEditorialAppointmentsList from './MyEditorialAppointmentsList';

import { default as locale } from 'locale/pages';
import {
    addMyEditorialAppointments,
    deleteMyEditorialAppointmentsListItem,
    loadMyEditorialAppointmentsList,
    updateMyEditorialAppointmentsListItem,
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

    if (myEditorialAppointmentsListLoading) {
        return (
            <StandardPage>
                <InlineLoader message={locale.pages.editorialAppointments.loadingMessage} />
            </StandardPage>
        );
    }

    return (
        <StandardPage title={locale.pages.editorialAppointments.title}>
            {!!myEditorialAppointmentsListError && <Alert {...myEditorialAppointmentsListError} type="error" />}
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
        </StandardPage>
    );
};

export default React.memo(MyEditorialAppointments);
