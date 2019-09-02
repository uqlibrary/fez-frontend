import React from 'react';
import PropTypes from 'prop-types';
import { AttachedFiles } from './AttachedFiles';

export const AttachedFilesField = ({ input, ...props }) => {
    const handleDelete = () => input.onChange();

    return <AttachedFiles onDelete={handleDelete} dataStreams={props.meta.initial.toJS()} {...props} />;
};

AttachedFilesField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
};
