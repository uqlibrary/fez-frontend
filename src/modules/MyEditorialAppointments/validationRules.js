import moment from 'moment';
import { EDITORIAL_APPOINTMENT_MAX_YEAR, EDITORIAL_APPOINTMENT_MIN_YEAR, EDITORIAL_ROLE_OTHER } from 'config/general';
import { default as locale } from 'locale/components';

export const validationRules = [
    {
        id: 'eap_journal_name',
        validate: rowData => {
            const isValid = !!rowData.eap_journal_name && rowData.eap_journal_name !== '';
            return (
                !isValid && {
                    field: 'eap_journal_name',
                    message: locale.components.myEditorialAppointmentsList.form.locale.journalNameHint,
                }
            );
        },
    },
    {
        id: 'eap_role_cvo_id',
        validate: rowData => {
            const isValid = !!rowData.eap_role_cvo_id;
            return !isValid && { field: 'eap_role_cvo_id', message: 'Required' };
        },
    },
    {
        id: 'eap_role_name',
        validate: rowData => {
            const isValid =
                !!rowData.eap_role_cvo_id &&
                (String(rowData.eap_role_cvo_id) === EDITORIAL_ROLE_OTHER ? !!rowData.eap_role_name : true);
            return !isValid && { field: 'eap_role_name', message: 'Required' };
        },
    },
    {
        id: 'eap_start_year',
        validate: rowData => {
            const startYearMoment = moment(String(rowData.eap_start_year), 'YYYY');
            const isValid =
                startYearMoment.isValid() &&
                startYearMoment.isSameOrBefore(moment(), 'year') &&
                startYearMoment.isSameOrAfter(moment(EDITORIAL_APPOINTMENT_MIN_YEAR, 'YYYY'));
            return (
                !isValid && {
                    field: 'eap_start_year',
                    message: locale.components.myEditorialAppointmentsList.form.locale.startYearErrorMessage,
                }
            );
        },
    },
    {
        id: 'eap_end_year',
        validate: rowData => {
            const endYearMoment = moment(String(rowData.eap_end_year), 'YYYY');
            const isValid =
                endYearMoment.isValid() &&
                endYearMoment.isSameOrBefore(moment(EDITORIAL_APPOINTMENT_MAX_YEAR, 'YYYY')) &&
                endYearMoment.isSameOrAfter(moment(String(rowData.eap_start_year), 'YYYY'));
            return (
                !isValid && {
                    field: 'eap_end_year',
                    message: locale.components.myEditorialAppointmentsList.form.locale.endYearErrorMessage,
                }
            );
        },
    },
];
