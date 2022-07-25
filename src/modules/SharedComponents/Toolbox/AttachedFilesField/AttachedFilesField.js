import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AttachedFiles } from './AttachedFiles';
import { useFormValuesContext } from 'context';

export const deleteCallbackFactory = (dataStreams, setDataStreams, onDeleteAttachedFile) => {
    const callback = index => {
        const fileToDelete = dataStreams[index];
        const newDataStreams = [...dataStreams.slice(0, index), ...dataStreams.slice(index + 1)];
        onDeleteAttachedFile(fileToDelete);
        setDataStreams(newDataStreams);
    };
    return [callback, [dataStreams, setDataStreams, onDeleteAttachedFile]];
};

export const datastreamChangeCallbackFactory = (dataStreams, setDataStreams) => {
    const callback = (key, value, index) => {
        const newDataStreams = [
            ...dataStreams.slice(0, index),
            { ...dataStreams[index], [key]: value },
            ...dataStreams.slice(index + 1),
        ];
        console.log('datastreamChangeCallbackFactory newDataStreams', newDataStreams);
        setDataStreams(newDataStreams);
    };
    return [callback, [dataStreams, setDataStreams]];
};

export const onChangeCallbackFactory = (dataStreams, onChange) => {
    const callback = () => onChange(dataStreams);
    return [callback, [dataStreams, onChange]];
};

export const AttachedFilesField = ({ input, ...props }) => {
    const { formValues, onDeleteAttachedFile } = useFormValuesContext();

    const [dataStreams, setDataStreams] = useState(
        !!formValues.fez_datastream_info
            ? formValues.fez_datastream_info
            : (props.meta && props.meta.initial && props.meta.initial.toJS && props.meta.initial.toJS()) || [],
    );
    const { onChange } = input;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDelete = useCallback(...deleteCallbackFactory(dataStreams, setDataStreams, onDeleteAttachedFile));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDataStreamChange = useCallback(...datastreamChangeCallbackFactory(dataStreams, setDataStreams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(...onChangeCallbackFactory(dataStreams, onChange));

    return (
        <AttachedFiles
            onDelete={handleDelete}
            onDateChange={handleDataStreamChange}
            onDescriptionChange={handleDataStreamChange}
            onFilenameChange={handleDataStreamChange}
            dataStreams={dataStreams}
            {...props}
        />
    );
};

AttachedFilesField.propTypes = {
    input: PropTypes.object,
    fileName: PropTypes.string,
    meta: PropTypes.object,
};
