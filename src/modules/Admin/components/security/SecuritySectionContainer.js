import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form/immutable';

import { FORM_NAME } from '../../containers/Admin';
import { FormValuesContext } from 'context';
import SecurityCard from './SecurityCard';

const mapStateToProps = (state, ownProps) => {
    const formValues = getFormValues(FORM_NAME)(state) || Immutable.Map({});
    return {
        disabled: ownProps.disabled,
        formValues: formValues.get('securitySection') || Immutable.Map({})
    };
};

const SecuritySectionContainer = ({ disabled, formValues }) => {
    return (
        <FormValuesContext.Provider value={{ formValues: formValues.toJS() }}>
            <SecurityCard
                disabled={disabled}
            />
        </FormValuesContext.Provider>
    );
};

SecuritySectionContainer.propTypes = {
    disabled: PropTypes.bool,
    formValues: PropTypes.object
};


export default connect(mapStateToProps)(React.memo(SecuritySectionContainer));
