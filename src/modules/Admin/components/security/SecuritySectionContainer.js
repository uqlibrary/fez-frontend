// import React from 'react';
// import PropTypes from 'prop-types';
// import Immutable from 'immutable';
// import { connect } from 'react-redux';
// import { getFormValues } from 'redux-form/immutable';

// import { FORM_NAME } from '../../constants';
// import { FormValuesContext } from 'context';
// import SecurityCard from './SecurityCard';

// const SecuritySectionContainer = ({ disabled, formValues, isSuperAdmin }) => {
//     return (
//         <FormValuesContext.Provider value={{ formValues: formValues.toJS() }}>
//             <SecurityCard {...{ disabled, isSuperAdmin }} />
//         </FormValuesContext.Provider>
//     );
// };

// SecuritySectionContainer.propTypes = {
//     disabled: PropTypes.bool,
//     isSuperAdmin: PropTypes.bool,
//     formValues: PropTypes.object,
// };

// const mapStateToProps = (state, ownProps) => {
//     const formValues = getFormValues(FORM_NAME)(state) || Immutable.Map({});
//     return {
//         disabled: ownProps.disabled,
//         isSuperAdmin: Boolean(
//             ((state.get('accountReducer') || /* istanbul
// ignore next */ {}).authorDetails || {}).is_super_administrator,
//         ),
//         formValues: formValues.get('securitySection') || Immutable.Map({}),
//     };
// };
// // here, migrate this whole thing. probs needs a pt as one or two comps use RF
// export default connect(mapStateToProps)(React.memo(SecuritySectionContainer));
