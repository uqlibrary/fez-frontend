import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

import { AttachedFiles } from './AttachedFiles';

export const deleteCallbackFactory = (dataStreams, onDeleteAttachedFile, onChange) => {
    const callback = key => {
        const indexToDelete = dataStreams.findIndex(item => item.dsi_dsid === key);
        const fileToDelete = dataStreams[indexToDelete];
        const newDataStreams = [...dataStreams.slice(0, indexToDelete), ...dataStreams.slice(indexToDelete + 1)];
        onDeleteAttachedFile(fileToDelete);
        onChange?.(newDataStreams);
    };

    return [callback, [dataStreams, onDeleteAttachedFile, onChange]];
};

export const datastreamOrderChangeCallbackFactory = (dataStreams, setDataStreams) => {
    const callback = (fileId, oldPosition, newPosition) => {
        const newDataStreams = [...dataStreams];

        newDataStreams.map(
            (item, index) =>
                (item.dsi_order = item.hasOwnProperty('dsi_order') && !!item.dsi_order ? item.dsi_order : index + 1),
        );

        const sourceFileIndex = newDataStreams.findIndex(item => item.dsi_id === fileId);
        const replaceFileIndex = newDataStreams.findIndex(item => item.dsi_order === newPosition);

        newDataStreams[sourceFileIndex].dsi_order = newPosition;
        newDataStreams[replaceFileIndex].dsi_order = oldPosition;

        setDataStreams(newDataStreams);
    };
    return [callback, [dataStreams, setDataStreams]];
};

export const handleDatastreamChange = (dataStreams, setDataStreams, onRenameAttachedFile) => (
    key,
    value,
    index,
    previousFilename,
) => {
    const newDataStreams = [...dataStreams];
    newDataStreams[index][key] = value;
    !!previousFilename && onRenameAttachedFile(previousFilename, value);
    setDataStreams(newDataStreams);
};

export const handleDatastreamMultiChange = (dataStreams, setDataStreams, onRenameAttachedFile) => (
    keyValuePairs,
    previousFilename,
    index,
) => {
    const newDataStreams = [...dataStreams];
    keyValuePairs.forEach(pair => (newDataStreams[index][pair.key] = pair.value));
    const fileToRename = dataStreams[index];
    onRenameAttachedFile(previousFilename ?? fileToRename.dsi_dsid_new, fileToRename.dsi_dsid);
    setDataStreams(newDataStreams);
};

export const AttachedFilesField = ({ onRenameAttachedFile, onDeleteAttachedFile, ...props }) => {
    const { getValues } = useFormContext();
    const formValues = getValues('filesSection');
    const prevPropsDatastream = React.useRef('[]');

    const getState = () =>
        !!formValues.fez_datastream_info
            ? formValues.fez_datastream_info
            : props?.defaultValue || /* istanbul ignore next */ [];

    const [dataStreams, setDataStreams] = useState(getState);
    const newPropsDataStreams = getState();
    const newPropsDataStreamsString = JSON.stringify(newPropsDataStreams);

    /* istanbul ignore else */
    if (newPropsDataStreamsString !== prevPropsDatastream.current) {
        prevPropsDatastream.current = newPropsDataStreamsString;
        setDataStreams(newPropsDataStreams);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDataStreamOrderChange = useCallback(
        ...datastreamOrderChangeCallbackFactory(dataStreams, setDataStreams),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDelete = useCallback(...deleteCallbackFactory(dataStreams, onDeleteAttachedFile, props.onChange));

    return (
        <AttachedFiles
            onDelete={handleDelete}
            onDateChange={handleDatastreamChange(dataStreams, setDataStreams)}
            onDescriptionChange={handleDatastreamChange(dataStreams, setDataStreams)}
            onFilenameChange={handleDatastreamChange(dataStreams, setDataStreams, onRenameAttachedFile)}
            onFilenameSave={handleDatastreamMultiChange(dataStreams, setDataStreams, onRenameAttachedFile)}
            onHandleFileIsValid={handleDatastreamChange(dataStreams, setDataStreams)}
            onOrderChange={handleDataStreamOrderChange}
            dataStreams={dataStreams}
            {...props}
        />
    );
};

AttachedFilesField.propTypes = {
    defaultValue: PropTypes.any,
    onChange: PropTypes.func,
    onRenameAttachedFile: PropTypes.func.isRequired,
    onDeleteAttachedFile: PropTypes.func.isRequired,
};
