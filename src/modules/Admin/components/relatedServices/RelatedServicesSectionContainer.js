import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form/immutable';

import { FORM_NAME } from '../../constants';
import { FormValuesContext } from 'context';
import RelatedServicesSection from './RelatedServicesSection';

export const RelatedServicesSectionContainer = ({ disabled, formValues }) => {
    return (
        <FormValuesContext.Provider value={{ formValues: formValues.toJS() }}>
            <RelatedServicesSection disabled={disabled} />
        </FormValuesContext.Provider>
    );
};

RelatedServicesSectionContainer.propTypes = {
    disabled: PropTypes.bool,
    formValues: PropTypes.object,
};

export const mapStateToProps = (state, ownProps) => {
    const formValues = getFormValues(FORM_NAME)(state) || Immutable.Map({});

    return {
        disabled: ownProps.disabled,
        formValues: formValues.get('relatedServicesSection') || Immutable.Map({}),
    };
};

export default connect(mapStateToProps)(React.memo(RelatedServicesSectionContainer));
