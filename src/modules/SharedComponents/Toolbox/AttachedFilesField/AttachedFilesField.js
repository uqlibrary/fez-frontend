import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { AttachedFiles } from './AttachedFiles';
import Immutable from 'immutable';

export const AttachedFilesField = ({ input, ...props }) => {
    const [dataStreams, setDataStreams] = useState((props.meta.initial || Immutable.Map([])).toJS());
    console.log(dataStreams);
    const { onChange } = input;
    const handleDelete = useCallback(
        index => {
            const newDataStreams = [...dataStreams.slice(0, index), ...dataStreams.slice(index + 1)];
            setDataStreams(newDataStreams);
        },
        [dataStreams, setDataStreams],
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
        [setDataStreams, dataStreams],
    );

    useEffect(() => onChange(dataStreams), [onChange, dataStreams]);

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
