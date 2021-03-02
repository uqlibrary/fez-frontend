import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form/immutable';

import { FORM_NAME } from '../../constants';
import { FormValuesContext } from 'context';
import AuthorsSection from './AuthorsSection';
import { NTRO_SUBTYPES } from 'config/general';

export const AuthorsSectionContainer = ({ disabled, formValues, isNtro = false }) => {
    return (
        <FormValuesContext.Provider value={{ formValues: { ...formValues.toJS(), isNtro } }}>
            <AuthorsSection key={`disabled-${disabled}-isNtro-${isNtro}`} disabled={disabled} isNtro={isNtro} />
        </FormValuesContext.Provider>
    );
};

AuthorsSectionContainer.propTypes = {
    disabled: PropTypes.bool,
    formValues: PropTypes.object,
    isNtro: PropTypes.bool,
};

/* istanbul ignore next */
export const mapStateToProps = (state, ownProps) => {
    const formValues = getFormValues(FORM_NAME)(state) || Immutable.Map({});
    return {
        disabled: ownProps.disabled,
        formValues: formValues.get('authorsSection') || Immutable.Map({}),
        isNtro: NTRO_SUBTYPES.includes(formValues.get('adminSection').get('rek_subtype')),
    };
};

export default connect(mapStateToProps)(React.memo(AuthorsSectionContainer));
