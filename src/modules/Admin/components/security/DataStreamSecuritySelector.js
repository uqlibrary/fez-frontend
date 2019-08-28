import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import DataStreamSecurityItem from './DataStreamSecurityItem';

export const styles = () => ({
    dataStreamFileBlock: {
        backgroundColor: 'rgba(0,0,0,0.05)',
    },
    dataStreamFileName: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
});

export const DataStreamSecuritySelector = ({
    text,
    disabled,
    collections,
    classes,
    meta: { initial: dataStreams },
    ...props
}) => {
    const [initialDataStreams] = useState(() => dataStreams.toJS());
    const [dataStreamSecurity, setDataStreamSecurity] = useState(() => dataStreams.toJS());
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
            props.input.onChange(newDataStreamSecurity);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dataStreamIndexToChange, dataStreamToChange]);

    return (
        <React.Fragment>
            <Typography variant="h6">{text.overridePrompt}</Typography>
            <div style={{ marginTop: 8, padding: 16 }}>
                <Grid
                    container
                    spacing={32}
                    alignContent="flex-end"
                    alignItems="flex-end"
                    className={classes.dataStreamFileBlock}
                >
                    {dataStreamSecurity.map((dataStream, index) => (
                        <DataStreamSecurityItem
                            key={dataStream.dsi_dsid}
                            disabled={disabled}
                            initialDataStream={initialDataStreams[index]}
                            dataStream={dataStream}
                            policyDropdownLabel={text.overridePolicyPrompt}
                            inheritedSecurity={mostSecureParentDatastreamSecurity}
                            onSecurityChange={handleDataStreamSecurityChange}
                            classes={classes}
                            index={index}
                        />
                    ))}
                </Grid>
            </div>
        </React.Fragment>
    );
};

DataStreamSecuritySelector.propTypes = {
    disabled: PropTypes.bool,
    text: PropTypes.object,
    collections: PropTypes.array,
    classes: PropTypes.object,
    input: PropTypes.object,
    meta: PropTypes.shape({
        initial: PropTypes.shape({
            toJS: PropTypes.func.isRequired,
        }).isRequired,
    }).isRequired,
};

export function isSame(prevProps, nextProps) {
    return prevProps.disabled === nextProps.disabled;
}

export default React.memo(withStyles(styles)(DataStreamSecuritySelector), isSame);
