import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import DataStreamSecurityItem from './DataStreamSecurityItem';
import { isDerivative } from 'helpers/datastreams';

const classes = {
    dataStreamFileName: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
};

export const DataStreamSecuritySelector = ({ attachedDataStreams, collections, disabled, text, ...props }) => {
    const canDisplay = dataStream => {
        return !isDerivative(dataStream);
    };

    const [initialDataStreams] = useState(() => attachedDataStreams);
    const [dataStreamSecurity, setDataStreamSecurity] = useState(() => {
        return attachedDataStreams.filter(dataStream => canDisplay(dataStream));
    });
    const [dataStreamIndexToChange, setDataStreamIndexToChange] = useState(-1);
    const [dataStreamToChange, setDataStreamToChange] = useState(null);
    const [mostSecureParentDatastreamSecurity] = useState(() =>
        collections
            .map(collection => collection.parent)
            .filter(parent => parent)
            .reduce((value, item) => {
                if (!value || item.rek_datastream_policy < value) return item.rek_datastream_policy;
                else return value;
            }, null),
    );

    const handleDataStreamSecurityChange = useCallback((index, dataStream) => {
        setDataStreamIndexToChange(index);
        setDataStreamToChange(dataStream);
    }, []);

    useEffect(() => {
        if (dataStreamIndexToChange >= 0) {
            const newDataStreamSecurity = [
                ...dataStreamSecurity.slice(0, dataStreamIndexToChange),
                { ...dataStreamToChange },
                ...dataStreamSecurity.slice(dataStreamIndexToChange + 1),
            ];
            setDataStreamSecurity(newDataStreamSecurity);
            props.onChange?.(newDataStreamSecurity);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataStreamIndexToChange, dataStreamToChange]);

    return (
        <React.Fragment>
            <Typography variant="h6">{text.overridePrompt}</Typography>
            <div style={{ marginTop: 8, padding: 16 }}>
                <Grid
                    alignContent="flex-end"
                    alignItems="flex-start"
                    sx={{ backgroundColor: 'rgba(0,0,0,0.05)', padding: '12px' }}
                    container
                    spacing={4}
                >
                    {dataStreamSecurity.length > 0 &&
                        dataStreamSecurity.map((dataStream, index) => (
                            <DataStreamSecurityItem
                                classes={classes}
                                dataStream={dataStream}
                                disabled={!!disabled}
                                index={index}
                                inheritedSecurity={mostSecureParentDatastreamSecurity}
                                initialDataStream={initialDataStreams[index]}
                                key={dataStream.dsi_id}
                                onSecurityChange={handleDataStreamSecurityChange}
                                policyDropdownLabel={text.overridePolicyPrompt}
                            />
                        ))}
                    {dataStreamSecurity.length === 0 && (
                        /* istanbul ignore next */
                        <Typography variant="body2">{text.noDataStreams}</Typography>
                    )}
                </Grid>
            </div>
        </React.Fragment>
    );
};

DataStreamSecuritySelector.propTypes = {
    collections: PropTypes.array,
    disabled: PropTypes.bool,
    attachedDataStreams: PropTypes.array,
    text: PropTypes.object,
    onChange: PropTypes.func,
};

export function isSame(prevProps, nextProps) {
    return (
        prevProps.disabled === nextProps.disabled &&
        prevProps.attachedDataStreams.length === nextProps.attachedDataStreams.length
    );
}

export default React.memo(DataStreamSecuritySelector, isSame);
