// import React from 'react';
// import PropTypes from 'prop-types';
// import Immutable from 'immutable';
// import { connect } from 'react-redux';
// import { getFormValues } from 'redux-form/immutable';

// import { FORM_NAME } from '../../constants';
// import { FormValuesContext } from 'context';
// import AdminSection from './AdminSection';

// export const AdminSectionContainer = ({ disabled, formValues }) => {
//     return (
//         <FormValuesContext.Provider value={{ formValues: formValues.toJS() }}>
//             <AdminSection disabled={disabled} />
//         </FormValuesContext.Provider>
//     );
// };

// AdminSectionContainer.propTypes = {
//     disabled: PropTypes.bool,
//     formValues: PropTypes.object,
// };

// export const mapStateToProps = (state, ownProps) => {
//     const formValues = getFormValues(FORM_NAME)(state) || Immutable.Map({});
//     return {
//         disabled: ownProps.disabled,
//         formValues: formValues.get('adminSection') || Immutable.Map({}),
//     };
// };

// export default connect(mapStateToProps)(React.memo(AdminSectionContainer));
