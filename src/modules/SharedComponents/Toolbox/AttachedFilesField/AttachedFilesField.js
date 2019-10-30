import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AttachedFiles } from './AttachedFiles';

export const deleteCallbackFactory = (dataStreams, setDataStreams) => {
    const callback = index => {
        const newDataStreams = [...dataStreams.slice(0, index), ...dataStreams.slice(index + 1)];
        setDataStreams(newDataStreams);
    };
    return [callback, [dataStreams, setDataStreams]];
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

export const onChangeCallbackFactory = (dataStreams, onChange) => {
    const callback = () => onChange(dataStreams);
    return [callback, [dataStreams, onChange]];
};

export const AttachedFilesField = ({ input, ...props }) => {
    const [dataStreams, setDataStreams] = useState(
        (props.meta && props.meta.initial && props.meta.initial.toJS && props.meta.initial.toJS()) || [],
    );
    const { onChange } = input;

    const handleDelete = useCallback(...deleteCallbackFactory(dataStreams, setDataStreams));
    const handleDataStreamChange = useCallback(...datastreamChangeCallbackFactory(dataStreams, setDataStreams));
    useEffect(...onChangeCallbackFactory(dataStreams, onChange));

    return (
        <AttachedFiles
            onDelete={handleDelete}
            onDateChange={handleDataStreamChange}
            onDescriptionChange={handleDataStreamChange}
            dataStreams={dataStreams}
            {...props}
        />
    );
};

AttachedFilesField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
};
