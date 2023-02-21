import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form/immutable';

import { FORM_NAME } from '../../constants';
import { FormValuesContext } from 'context';
import { deleteAttachedFile, renameAttachedFile } from 'actions/records';

import FilesSection from './FilesSection';

export const FilesSectionContainer = ({
    disabled,
    formValues,
    onDeleteAttachedFile,
    onRenameAttachedFile,
    openAccessStatusId,
}) => {
    return (
        <FormValuesContext.Provider
            value={{ formValues: formValues.toJS(), onDeleteAttachedFile, onRenameAttachedFile, openAccessStatusId }}
        >
            <FilesSection disabled={disabled} />
        </FormValuesContext.Provider>
    );
};

FilesSectionContainer.propTypes = {
    disabled: PropTypes.bool,
    formValues: PropTypes.object,
    onDeleteAttachedFile: PropTypes.func,
    onRenameAttachedFile: PropTypes.func,
    openAccessStatusId: PropTypes.number,
};

export const mapStateToProps = (state, ownProps) => {
    const formValues = getFormValues(FORM_NAME)(state) || Immutable.Map({});
    const openAccessStatusId = parseInt(
        ((formValues.get('adminSection') || Immutable.Map({})).toJS().fez_record_search_key_oa_status || {})
            .rek_oa_status,
        10,
    );
    return {
        disabled: ownProps.disabled,
        formValues: formValues.get('filesSection') || Immutable.Map({}),
        openAccessStatusId,
    };
};

/* istanbul ignore next */
export const mapDispatchToProps = dispatch => ({
    onDeleteAttachedFile: file => dispatch(deleteAttachedFile(file)),
    onRenameAttachedFile: (prev, next) => dispatch(renameAttachedFile(prev, next)),
});

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(FilesSectionContainer));
