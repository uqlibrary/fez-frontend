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

export const datastreamChangeCallbackFactory = (dataStreams, setDataStreams) => {
    const callback = (key, value, index) => {
        const newDataStreams = [
            ...dataStreams.slice(0, index),
            { ...dataStreams[index], [key]: value },
            ...dataStreams.slice(index + 1),
        ];
        setDataStreams(newDataStreams);
    };
    return [callback, [dataStreams, setDataStreams]];
};

export const shuffleFileOrder = (arr, from, to) => {
    return arr.reduce((prev, current, idx, self) => {
        if (from === to) {
            prev.push(current);
        }
        if (idx === from) {
            return prev;
        }
        if (from < to) {
            prev.push(current);
        }
        if (idx === to) {
            prev.push(self[from]);
        }
        if (from > to) {
            prev.push(current);
        }
        return prev;
    }, []);
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

export const onChangeCallbackFactory = (dataStreams, onChange) => {
    const callback = () => onChange(dataStreams);
    return [callback, [dataStreams, onChange]];
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
    const handleDataStreamChange = useCallback(...datastreamChangeCallbackFactory(dataStreams, setDataStreams));
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(...onChangeCallbackFactory(dataStreams, onChange));

    return (
        <AttachedFiles
            onDelete={handleDelete}
            onDateChange={handleDataStreamChange}
            onDescriptionChange={handleDataStreamChange}
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
