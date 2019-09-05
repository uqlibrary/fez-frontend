import React, { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import locale from 'locale/global';
import { AttachedFiles } from './AttachedFiles';

export const AttachedFilesField = ({ input, ...props }) => {
    const [dataStreams, setDataStreams] = useState(props.meta.initial.toJS());
    const { onChange } = input;
    const handleDelete = useCallback(
        index => {
            const newDataStreams = [...dataStreams.slice(0, index), ...dataStreams.slice(index + 1)];
            setDataStreams(newDataStreams);
        },
        [dataStreams, setDataStreams],
    );

    const handleDateChange = useCallback(
        (value, index) => {
            const newDataStreams = [
                ...dataStreams.slice(0, index),
                { ...dataStreams[index], dsi_embargo_date: moment(value).format(locale.global.embargoDateFormat) },
                ...dataStreams.slice(index + 1),
            ];
            setDataStreams(newDataStreams);
        },
        [dataStreams, setDataStreams],
    );

    useEffect(() => onChange(dataStreams), [onChange, dataStreams]);

    return (
        <AttachedFiles onDelete={handleDelete} onDateChange={handleDateChange} dataStreams={dataStreams} {...props} />
    );
};

AttachedFilesField.propTypes = {
    input: PropTypes.object,
    meta: PropTypes.object,
};
