import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useFormContext } from 'react-hook-form';

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

export const handleOnChange = (dataStreams, onChange) => {
    onChange(dataStreams);
};

export const AttachedFilesField = ({ input, onRenameAttachedFile, ...props }) => {
    const { getValues } = useFormContext();
    const formValues = getValues('filesSection');
    const { onDeleteAttachedFile } = useFormValuesContext();
    const prevDatastream = React.useRef();

    const getState = () =>
        !!formValues.fez_datastream_info
            ? formValues.fez_datastream_info
            : (props.meta && props.meta.initial && props.meta.initial.toJS && props.meta.initial.toJS()) || [];

    const [dataStreams, setDataStreams] = useState(getState);
    const newDataStreams = getState();
    const newDataStreamsString = JSON.stringify(newDataStreams);
    if (newDataStreamsString !== prevDatastream.current) {
        console.log('dataStreams changed', dataStreams, prevDatastream.current, newDataStreams);

        prevDatastream.current = newDataStreamsString;
        setDataStreams(newDataStreams);
    }

    console.log(formValues, formValues.fez_datastream_info, dataStreams);
    const { onChange } = input;
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDataStreamOrderChange = useCallback(
        ...datastreamOrderChangeCallbackFactory(dataStreams, setDataStreams),
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const handleDelete = useCallback(...deleteCallbackFactory(dataStreams, setDataStreams, onDeleteAttachedFile));

    useEffect(() => {
        // Called when attachment is deleted in the UI
        return handleOnChange(dataStreams, onChange);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataStreams]);

    if (!Array.isArray(formValues.fez_datastream_info)) {
        console.log('return null');
        return <></>;
    }

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
    input: PropTypes.object,
    onRenameAttachedFile: PropTypes.func.isRequired,
    meta: PropTypes.object,
};
