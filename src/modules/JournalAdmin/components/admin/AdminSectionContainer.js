import React from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

import { FormValuesContext } from 'context';
import AdminSection from './AdminSection';

export const AdminSectionContainer = ({ disabled }) => {
    const methods = useFormContext();
    const formValues = methods.getValues('adminSection');

    return (
        <FormValuesContext.Provider value={{ formValues }}>
            <AdminSection disabled={disabled} />
        </FormValuesContext.Provider>
    );
};

AdminSectionContainer.propTypes = {
    disabled: PropTypes.bool,
    formValues: PropTypes.object,
};
export default React.memo(AdminSectionContainer);
