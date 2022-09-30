import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AttachedFiles } from './AttachedFiles';
import { useFormValuesContext } from 'context';

export const deleteCallbackFactory = (dataStreams, setDataStreams, onDeleteAttachedFile) => {
    const callback = key => {
        const indexToDelete = dataStreams.findIndex(item => item.dsi_dsid === key);
        const fileToDelete = dataStreams[indexToDelete];
        const newDataStreams = [...dataStreams.slice(0, indexToDelete), ...dataStreams.slice(indexToDelete + 1)];
        onDeleteAttachedFile(fileToDelete);
        setDataStreams(newDataStreams);
    };
    return [callback, [dataStreams, setDataStreams, onDeleteAttachedFile]];
};

export const datastreamOrderChangeCallbackFactory = (dataStreams, setDataStreams) => {
    const callback = (file, oldPosition, newPosition) => {
        const newDataStreams = [...dataStreams];

        newDataStreams.map(
            (item, index) =>
                (item.dsi_order = item.hasOwnProperty('dsi_order') && !!item.dsi_order ? item.dsi_order : index + 1),
        );

        const sourceFileIndex = newDataStreams.findIndex(item => item.dsi_dsid === file);
        const replaceFileIndex = newDataStreams.findIndex(item => item.dsi_order === newPosition);

        newDataStreams[sourceFileIndex].dsi_order = newPosition;
        newDataStreams[replaceFileIndex].dsi_order = oldPosition;

        setDataStreams(newDataStreams);
    };
    return [callback, [dataStreams, setDataStreams]];
};

export const handleDatastreamChange = (dataStreams, setDataStreams) => (key, value, index) => {
    const newDataStreams = [...dataStreams];
    newDataStreams[index][key] = value;
    setDataStreams(newDataStreams);
};

export const handleDatastreamMultiChange = (dataStreams, setDataStreams) => (keyValuePairs, index) => {
    const newDataStreams = [...dataStreams];
    keyValuePairs.forEach(pair => (newDataStreams[index][pair.key] = pair.value));
    setDataStreams(newDataStreams);
};

export const handleOnChange = (dataStreams, onChange) => {
    onChange(dataStreams);
};

export const AttachedFilesField = ({ input, ...props }) => {
    const { formValues, onDeleteAttachedFile } = useFormValuesContext();

    const [dataStreams, setDataStreams] = useState(() => {
        return !!formValues.fez_datastream_info
            ? formValues.fez_datastream_info
            : (props.meta && props.meta.initial && props.meta.initial.toJS && props.meta.initial.toJS()) || [];
    });
    const { onChange } = input;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDataStreamOrderChange = useCallback(
        ...datastreamOrderChangeCallbackFactory(dataStreams, setDataStreams),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDelete = useCallback(...deleteCallbackFactory(dataStreams, setDataStreams, onDeleteAttachedFile));

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => handleOnChange(dataStreams, onChange), [dataStreams]);

    return (
        <AttachedFiles
            onDelete={handleDelete}
            onDateChange={handleDatastreamChange(dataStreams, setDataStreams)}
            onDescriptionChange={handleDatastreamChange(dataStreams, setDataStreams)}
            onFilenameChange={handleDatastreamChange(dataStreams, setDataStreams)}
            onFilenameSave={handleDatastreamMultiChange(dataStreams, setDataStreams)}
            onHandleFileIsValid={handleDatastreamChange(dataStreams, setDataStreams)}
            onOrderChange={handleDataStreamOrderChange}
            dataStreams={dataStreams}
            {...props}
        />
    );
};

AttachedFilesField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
};
