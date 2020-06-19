import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form/immutable';

import { FORM_NAME } from '../../constants';
import { FormValuesContext } from 'context';
import { deleteAttachedFile } from 'actions/records';

import FilesSection from './FilesSection';

export const FilesSectionContainer = ({ disabled, formValues, onDeleteAttachedFile }) => {
    return (
        <FormValuesContext.Provider value={{ formValues: formValues.toJS(), onDeleteAttachedFile }}>
            <FilesSection disabled={disabled} />
        </FormValuesContext.Provider>
    );
};

FilesSectionContainer.propTypes = {
    disabled: PropTypes.bool,
    formValues: PropTypes.object,
    onDeleteAttachedFile: PropTypes.func,
};

export const mapStateToProps = (state, ownProps) => {
    const formValues = getFormValues(FORM_NAME)(state) || Immutable.Map({});
    return {
        disabled: ownProps.disabled,
        formValues: formValues.get('filesSection') || Immutable.Map({}),
    };
};

/* istanbul ignore next */
export const mapDispatchToProps = dispatch => ({
    onDeleteAttachedFile: file => dispatch(deleteAttachedFile(file)),
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(FilesSectionContainer));
