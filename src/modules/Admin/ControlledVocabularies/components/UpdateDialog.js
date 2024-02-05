import React from 'react';
import PropTypes from 'prop-types';

import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { filterComponentProps } from './utils';
import { ACTION } from '../ControlledVocabularyContext';

const rootId = 'update_dialog';

export const UpdateDialogue = ({
    action,
    locale,
    isOpen,
    title,
    id,
    hideActionButton = false,
    hideCancelButton = false,
    onAction,
    onCancelAction,
    onClose,
    noMinContentWidth,
    fields,
    columns,
    row,
    props,
    isBusy = false,
}) => {
    const componentId = `${rootId}-${id}`;

    const [dataColumns, setDataColumns] = React.useState({});
    const [dataFields, setDataFields] = React.useState({});
    const [editableFields, setEditableFields] = React.useState([]);
    const [data, setData] = React.useState({});
    const [isValid, setIsValid] = React.useState(false);
    const theme = useTheme();
    const isMobileView = useMediaQuery(theme.breakpoints.only('xs')) || false;

    React.useEffect(() => {
        /* istanbul ignore else */
        if (isOpen) {
            setDataColumns(columns);
            setDataFields(fields);
            setData(row);
            setEditableFields(
                Object.keys(fields).filter(
                    field =>
                        !!(fields[field]?.fieldParams?.renderInUpdate ?? true) &&
                        (!!(fields[field]?.fieldParams?.canEdit ?? true) ||
                            !!(fields[field]?.fieldParams?.canAdd ?? true)),
                ),
            );
        }
    }, [isOpen, fields, row, columns]);

    React.useEffect(() => {
        setIsValid(
            editableFields.every(field => {
                return !dataFields[field]?.validate?.(data[field], data, action) ?? /* istanbul ignore next */ true;
            }),
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const _onAction = () => {
        onClose?.();
        onAction?.(data);
    };

    const _onCancelAction = () => {
        onClose?.();
        onCancelAction?.();
    };

    const _onClickAction = e => {
        e.stopPropagation();
    };

    const handleChange = event => {
        const isCheckbox = event.target.type === 'checkbox';
        // eslint-disable-next-line no-nested-ternary
        const value = !isCheckbox ? event.target.value : event.target.checked;
        setData(prevState => ({
            ...prevState,
            [event.target.name]: value,
        }));
    };

    const containerStyles =
        action === ACTION.ADD && !!row.cvr_parent_cvo_id
            ? {}
            : {
                  backgroundColor: '#eee',
                  padding: '20px',
                  boxShadow: 'inset 0px 2px 4px 0px rgba(0,0,0,0.2)',
              };

    return (
        <>
            {isOpen && (
                <Box
                    sx={{
                        marginBlockEnd: 2,
                        ...containerStyles,
                    }}
                >
                    <StandardCard title={title} standardCardId={`${componentId}`} subCard>
                        <Box sx={{ padding: 2 }}>
                            <Box
                                id={`${componentId}-content`}
                                data-testid={`${componentId}-content`}
                                sx={{ minWidth: !noMinContentWidth ? 300 : 'auto' }}
                            >
                                <Grid container padding={0} spacing={2}>
                                    {isOpen &&
                                        !!data &&
                                        !!dataFields &&
                                        Object.keys(dataFields).map(field => (
                                            <React.Fragment key={field}>
                                                {((action === 'edit' &&
                                                    !!(dataFields[field]?.fieldParams?.renderInUpdate ?? true)) ||
                                                    (action === 'add' &&
                                                        !!(dataFields[field]?.fieldParams?.renderInAdd ?? true))) && (
                                                    <Grid item xs={12}>
                                                        {((action === 'edit' &&
                                                            !!!(dataFields[field]?.fieldParams?.canEdit ?? true)) ||
                                                            (action === 'add' &&
                                                                !!!(
                                                                    dataFields[field]?.fieldParams?.canAdd ?? true
                                                                ))) && (
                                                            <>
                                                                <Typography variant="body2">
                                                                    {dataColumns[field].label}
                                                                </Typography>
                                                                <Typography variant="body1">
                                                                    {!!dataFields[field]?.computedValue
                                                                        ? dataFields[field].computedValue(
                                                                              props[
                                                                                  dataFields[field].computedValueProp
                                                                              ],
                                                                          )
                                                                        : dataFields[field]?.valueFormatter?.(
                                                                              data?.[field],
                                                                          ) ?? data?.[field]}
                                                                </Typography>
                                                            </>
                                                        )}
                                                        {((action === 'edit' &&
                                                            !!(dataFields[field]?.fieldParams?.canEdit ?? true)) ||
                                                            (action === 'add' &&
                                                                !!(
                                                                    dataFields[field]?.fieldParams?.canAdd ?? true
                                                                ))) && (
                                                            <>
                                                                {dataFields[field]?.component(
                                                                    filterComponentProps({
                                                                        id: `${field}-input`,
                                                                        name: field,
                                                                        label: dataColumns[field].label,
                                                                        value:
                                                                            dataFields[field]?.valueFormatter?.(
                                                                                data?.[field],
                                                                            ) ??
                                                                            data?.[field] ??
                                                                            '',
                                                                        error:
                                                                            dataFields[field]?.validate?.(
                                                                                data?.[field],
                                                                                data,
                                                                            ) ?? false,
                                                                        checked: !!data?.[field],
                                                                        onChange: handleChange,
                                                                        onClick: _onClickAction,
                                                                        InputLabelProps: {
                                                                            shrink: true,
                                                                            htmlFor: `${field}-input`,
                                                                            id: `${field}-label`,
                                                                            ['data-testid']: `${field}-label`,
                                                                        },
                                                                        inputProps: {
                                                                            ['data-testid']: `${field}-input`,
                                                                        },
                                                                        fullWidth: true,
                                                                        type:
                                                                            dataFields[field]?.fieldParams?.type ??
                                                                            undefined,
                                                                        disabled: isBusy,
                                                                    }),
                                                                    data,
                                                                    row,
                                                                )}
                                                            </>
                                                        )}
                                                    </Grid>
                                                )}
                                            </React.Fragment>
                                        ))}
                                </Grid>
                            </Box>
                            {(!hideCancelButton || !hideActionButton) && (
                                <Grid
                                    container
                                    id={`${rootId}-actions`}
                                    data-testid={`${rootId}-actions`}
                                    sx={{ marginTop: 2 }}
                                >
                                    <Grid item xs={12} justifyContent="flex-end" display={'flex'}>
                                        {!hideCancelButton && (
                                            <Button
                                                variant={'outlined'}
                                                onClick={_onCancelAction}
                                                id={`${rootId}-cancel-button`}
                                                data-testid={`${rootId}-cancel-button`}
                                                fullWidth={isMobileView}
                                                disabled={isBusy}
                                                sx={{ marginInlineEnd: 2 }}
                                            >
                                                {locale.cancelButtonLabel}
                                            </Button>
                                        )}
                                        {!hideActionButton && (
                                            <Button
                                                variant="contained"
                                                autoFocus
                                                color={'primary'}
                                                onClick={_onAction}
                                                id={`${rootId}-action-button`}
                                                data-testid={`${rootId}-action-button`}
                                                fullWidth={isMobileView}
                                                disabled={isBusy || !isValid}
                                            >
                                                {isBusy ? (
                                                    <CircularProgress
                                                        color="inherit"
                                                        size={25}
                                                        id={`${rootId}-progress`}
                                                        data-testid={`${rootId}-progress`}
                                                    />
                                                ) : (
                                                    locale.confirmButtonLabel
                                                )}
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                            )}
                        </Box>
                    </StandardCard>
                </Box>
            )}
        </>
    );
};

UpdateDialogue.propTypes = {
    action: PropTypes.oneOf(['', 'add', 'edit']).isRequired,
    locale: PropTypes.object.isRequired,
    fields: PropTypes.object.isRequired,
    columns: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    title: PropTypes.string,
    row: PropTypes.object,
    isOpen: PropTypes.bool,
    noMinContentWidth: PropTypes.bool,
    hideActionButton: PropTypes.bool,
    hideCancelButton: PropTypes.bool,
    onAction: PropTypes.func,
    onCancelAction: PropTypes.func,
    onClose: PropTypes.func,
    props: PropTypes.object,
    isBusy: PropTypes.bool,
};

export default React.memo(UpdateDialogue);
