import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form/immutable';

import { FORM_NAME } from '../../constants';
import { FormValuesContext } from 'context';
import IdentifiersSection from './IdentifiersSection';

export const IdentifiersSectionContainer = ({ disabled, formValues }) => {
    return (
        <FormValuesContext.Provider value={{ formValues: formValues.toJS() }}>
            <IdentifiersSection disabled={disabled} />
        </FormValuesContext.Provider>
    );
};

IdentifiersSectionContainer.propTypes = {
    disabled: PropTypes.bool,
    formValues: PropTypes.object,
};

export const mapStateToProps = (state, ownProps) => {
    const formValues = getFormValues(FORM_NAME)(state) || Immutable.Map({});
    return {
        disabled: ownProps.disabled,
        formValues: formValues.get('identifiersSection') || Immutable.Map({}),
    };
};

export default connect(mapStateToProps)(React.memo(IdentifiersSectionContainer));
