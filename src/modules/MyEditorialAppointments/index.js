import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';
import { InlineLoader } from 'modules/SharedComponents/Toolbox/Loaders';
import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import MyEditorialAppointmentsList from './MyEditorialAppointmentsList';

import { default as locale } from 'locale/pages';
import { loadMyEditorialAppointmentsList } from 'actions';

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
                    <MyEditorialAppointmentsList list={myEditorialAppointmentsList} />
                </StandardCard>
            )}
        </StandardPage>
    );
};

export default React.memo(MyEditorialAppointments);
