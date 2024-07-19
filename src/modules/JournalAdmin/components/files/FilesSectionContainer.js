import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';

import { useFormContext } from 'react-hook-form';
import { FormValuesContext } from 'context';
import { deleteAttachedFile, renameAttachedFile } from 'actions/records';

import FilesSection from './FilesSection';

export const FilesSectionContainer = props => {
    console.log(props);
    const { disabled } = props;
    const dispatch = useDispatch();
    const methods = useFormContext();
    const formValues = methods.getValues('filesSection');
    const openAccessStatusId = parseInt(
        ((methods.getValues('adminSection') || {})?.fez_record_search_key_oa_status || {}).rek_oa_status,
        10,
    );
    const onDeleteAttachedFileFn = file => dispatch(deleteAttachedFile(file));
    const onRenameAttachedFileFn = (prev, next) => dispatch(renameAttachedFile(prev, next));

    return (
        <FormValuesContext.Provider
            value={{
                formValues,
                onDeleteAttachedFile: onDeleteAttachedFileFn,
                onRenameAttachedFile: onRenameAttachedFileFn,
                openAccessStatusId,
            }}
        >
            <FilesSection disabled={disabled} />
        </FormValuesContext.Provider>
    );
};

FilesSectionContainer.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(FilesSectionContainer);
