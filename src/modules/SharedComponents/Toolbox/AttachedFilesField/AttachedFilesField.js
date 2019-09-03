import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { AttachedFiles } from './AttachedFiles';

export const AttachedFilesField = ({ input, ...props }) => {
    const [dataStreams, setDataStreams] = useState(props.meta.initial.toJS());
    const { onChange } = input;
    const handleDelete = useCallback(
        index => {
            const newDataStreams = [...dataStreams.slice(0, index), ...dataStreams.slice(index + 1)];
            setDataStreams(newDataStreams);
            onChange(newDataStreams);
        },
        [dataStreams, setDataStreams, onChange],
    );

    return <AttachedFiles onDelete={handleDelete} dataStreams={dataStreams} {...props} />;
};

AttachedFilesField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
};
