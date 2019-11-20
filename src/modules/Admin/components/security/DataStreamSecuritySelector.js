import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

import DataStreamSecurityItem from './DataStreamSecurityItem';
import { useFormValuesContext } from 'context';

export const styles = () => ({
    dataStreamFileBlock: {
        backgroundColor: 'rgba(0,0,0,0.05)',
        padding: 12,
    },
    dataStreamFileName: {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
});

export const DataStreamSecuritySelector = ({
    classes,
    collections,
    disabled,
    meta: { initial: dataStreams },
    text,
    ...props
}) => {
    const { formValues } = useFormValuesContext();

    const [initialDataStreams] = useState(() => dataStreams.toJS());
    const [dataStreamSecurity, setDataStreamSecurity] = useState(() =>
        !!formValues.dataStreams ? formValues.dataStreams : dataStreams.toJS(),
    );
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
                    alignContent="flex-end"
                    alignItems="flex-start"
                    className={classes.dataStreamFileBlock}
                    container
                    spacing={32}
                >
                    {dataStreamSecurity.map((dataStream, index) => (
                        <DataStreamSecurityItem
                            classes={classes}
                            dataStream={dataStream}
                            disabled={disabled}
                            index={index}
                            inheritedSecurity={mostSecureParentDatastreamSecurity}
                            initialDataStream={initialDataStreams[index]}
                            key={dataStream.dsi_dsid}
                            onSecurityChange={handleDataStreamSecurityChange}
                            policyDropdownLabel={text.overridePolicyPrompt}
                        />
                    ))}
                </Grid>
            </div>
        </React.Fragment>
    );
};

DataStreamSecuritySelector.propTypes = {
    classes: PropTypes.object,
    collections: PropTypes.array,
    disabled: PropTypes.bool,
    input: PropTypes.object,
    meta: PropTypes.shape({
        initial: PropTypes.shape({
            toJS: PropTypes.func.isRequired,
        }).isRequired,
    }).isRequired,
    text: PropTypes.object,
};

export function isSame(prevProps, nextProps) {
    return prevProps.disabled === nextProps.disabled;
}

export default React.memo(withStyles(styles)(DataStreamSecuritySelector), isSame);
