import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AttachedFiles } from './AttachedFiles';
import { useFormValuesContext } from 'context';

export const AttachedFilesField = ({ input, ...props }) => {
    const { formValues, onDeleteAttachedFile } = useFormValuesContext();

    const [dataStreams, setDataStreams] = useState(
        !!formValues.fez_datastream_info
            ? formValues.fez_datastream_info
            : (props.meta && props.meta.initial && props.meta.initial.toJS && props.meta.initial.toJS()) || [],
    );
    const { onChange } = input;

    const handleDelete = useCallback(
        index => {
            const fileToDelete = dataStreams[index];
            const newDataStreams = [...dataStreams.slice(0, index), ...dataStreams.slice(index + 1)];
            onDeleteAttachedFile(fileToDelete);
            setDataStreams(newDataStreams);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataStreams],
    );

    const handleDataStreamChange = useCallback(
        (key, value, index) => {
            const newDataStreams = [
                ...dataStreams.slice(0, index),
                { ...dataStreams[index], [key]: value },
                ...dataStreams.slice(index + 1),
            ];
            setDataStreams(newDataStreams);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataStreams],
    );

    const handleMultiDataStreamChange = useCallback(
        (keyValuePairs, index) => {
            let newDataStreams = [...dataStreams];
            keyValuePairs.forEach(
                pair =>
                    (newDataStreams = [
                        ...newDataStreams.slice(0, index),
                        { ...newDataStreams[index], [pair.key]: pair.value },
                        ...newDataStreams.slice(index + 1),
                    ]),
            );
            setDataStreams(newDataStreams);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dataStreams],
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => onChange(dataStreams), [dataStreams]);

    return (
        <AttachedFiles
            onDelete={handleDelete}
            onDateChange={handleDataStreamChange}
            onDescriptionChange={handleDataStreamChange}
            onFilenameChange={handleDataStreamChange}
            onFilenameSave={handleMultiDataStreamChange}
            onHandleFileIsValid={handleDataStreamChange}
            dataStreams={dataStreams}
            {...props}
        />
    );
};

AttachedFilesField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
};
