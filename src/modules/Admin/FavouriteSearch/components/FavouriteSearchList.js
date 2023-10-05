/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable, { MTableBodyRow, MTableEditRow, MTableAction, MTableToolbar } from '@material-table/core';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { tableIcons } from './FavouriteSearchListIcons';

import locale from 'locale/global';
import { APP_URL, PATH_PREFIX } from 'config';
import componentsLocale from 'locale/components';

const classes = {
    text: {
        fontSize: 13,
    },
};

export const getColumns = classes => {
    const {
        components: { favouriteSearchList },
    } = componentsLocale;
    return [
        {
            title: favouriteSearchList.columns.realLink.title,
            field: 'fvs_search_parameters',
            editable: 'never',
            render: rowData => (
                <ExternalLink
                    id={`fvs-search-parameters-${rowData.tableData.id}`}
                    key={rowData.fvs_search_parameters}
                    href={`${APP_URL}${PATH_PREFIX}${rowData.fvs_search_parameters.replace('/', '')}`}
                    aria-label={locale.global.linkWillOpenInNewWindow.replace('[destination]', rowData.fvs_description)}
                >
                    {favouriteSearchList.columns.realLink.cellText}
                </ExternalLink>
            ),
        },
        {
            title: favouriteSearchList.columns.description.title,
            field: 'fvs_description',
            render: rowData => (
                <Typography
                    data-testid={`fvs-description-${rowData.tableData.id}`}
                    id={`fvs-description-${rowData.tableData.id}`}
                    sx={{ ...classes.text }}
                >
                    {rowData.fvs_description}
                </Typography>
            ),
            editComponent: props => (
                <TextField
                    {...props}
                    InputProps={{
                        style: {
                            fontSize: 13,
                        },
                    }}
                    value={props.value}
                    onChange={e => props.onChange(e.target.value)}
                    textFieldId="fvs-description"
                    errorText={props.helperText}
                />
            ),
            validate: rowData =>
                rowData.fvs_description === ''
                    ? { isValid: false, helperText: favouriteSearchList.columns.description.validationMessage.empty }
                    : true,
        },
        {
            title: favouriteSearchList.columns.aliasedLink.title,
            field: 'fvs_alias',
            editable: 'never',
            render: rowData => (
                <ExternalLink
                    key={rowData.fvs_alias}
                    id={`fvs-alias-${rowData.tableData.id}`}
                    href={`${APP_URL}${PATH_PREFIX}${rowData.fvs_alias}`}
                    aria-label={locale.global.linkWillOpenInNewWindow.replace('[destination]', rowData.fvs_description)}
                >
                    <Box component={'span'} sx={{ ...classes.text }}>
                        {rowData.fvs_alias}
                    </Box>
                </ExternalLink>
            ),
        },
        {
            title: favouriteSearchList.columns.alias.title,
            field: 'fvs_alias',
            render: rowData => (
                <Typography>
                    <Box
                        component={'span'}
                        sx={{ ...classes.text }}
                        data-testid={`fvs-alias-${rowData.tableData.id}`}
                        id={`fvs-alias-${rowData.tableData.id}`}
                    >
                        {rowData.fvs_alias}
                    </Box>
                </Typography>
            ),
            editComponent: props => (
                <TextField
                    {...props}
                    InputProps={{
                        style: {
                            fontSize: 13,
                        },
                    }}
                    value={props.value || ''}
                    onChange={e => props.onChange(e.target.value)}
                    textFieldId="fvs-alias"
                    errorText={props.helperText}
                />
            ),
            validate: rowData => {
                return rowData.fvs_alias !== '' &&
                    !new RegExp(favouriteSearchList.columns.alias.regex).test(rowData.fvs_alias)
                    ? { isValid: false, helperText: favouriteSearchList.columns.alias.validationMessage.invalid }
                    : true;
            },
        },
    ];
};

export const FavouriteSearchList = ({ handleRowDelete, handleRowUpdate, list }) => {
    const {
        components: { favouriteSearchList },
    } = componentsLocale;

    const materialTableRef = React.createRef();
    const columns = React.createRef();
    columns.current = getColumns(classes);

    const [data, setData] = React.useState(list);

    return (
        <MaterialTable
            tableRef={materialTableRef}
            columns={columns.current}
            components={{
                Container: props => <Paper {...props} style={{ padding: 16 }} />,
                Toolbar: props => <MTableToolbar {...props} style={{ minHeight: 64 }} />,
                Row: props => (
                    <MTableBodyRow
                        {...props}
                        sx={{ ...classes.text }}
                        id={`favourite-search-list-item-${props.index}`}
                        data-testid={`favourite-search-list-item-${props.index}`}
                    />
                ),
                EditRow: props => (
                    <MTableEditRow
                        {...props}
                        id={`favourite-search-list-edit-item-${props.data.tableData.id}`}
                        data-testid={`favourite-search-list-edit-item-${props.data.tableData.id}`}
                    />
                ),
                Action: props => {
                    const { icon: Icon, tooltip, ...restAction } =
                        (typeof props.action === 'function' && props.action(props.data)) || props.action;
                    return (
                        <MTableAction
                            {...props}
                            action={{
                                ...restAction,
                                tooltip,
                                icon: () => (
                                    <Icon
                                        data-testid={`favourite-search-list-item-${
                                            props.data.tableData.id
                                        }-${tooltip.toLowerCase()}`}
                                    />
                                ),
                            }}
                        />
                    );
                },
            }}
            data={data}
            icons={tableIcons}
            title={favouriteSearchList.tableTitle}
            editable={{
                onRowUpdate: (newData, oldData) => {
                    return handleRowUpdate(newData, oldData)
                        .then(() => {
                            return new Promise(resolve => {
                                setTimeout(() => {
                                    const dataUpdate = [...data];
                                    const target = dataUpdate.find(el => el.fvs_id === oldData.fvs_id);
                                    const index = dataUpdate.indexOf(target);
                                    const newValue = { ...newData };
                                    delete newValue.tableData;
                                    dataUpdate[index] = newValue;
                                    setData([...dataUpdate]);
                                    resolve();
                                }, 1000);
                            });
                        })
                        .catch(() => {
                            setData(prevState => prevState);
                        });
                },
                onRowDelete: oldData => {
                    return handleRowDelete(oldData).then(() => {
                        return new Promise(resolve => {
                            setTimeout(() => {
                                const dataDelete = [...data];
                                const target = dataDelete.find(el => el.fvs_id === oldData.fvs_id);
                                const index = dataDelete.indexOf(target);
                                dataDelete.splice(index, 1);
                                setData([...dataDelete]);
                                resolve();
                            }, 1000);
                        });
                    });
                },
            }}
            options={{
                actionsColumnIndex: -1,
                grouping: false,
                draggable: false,
                paging: false,
                search: false,
                headerStyle: {
                    padding: 16,
                },
            }}
        />
    );
};

FavouriteSearchList.propTypes = {
    handleRowDelete: PropTypes.func,
    handleRowUpdate: PropTypes.func,
    list: PropTypes.array,
};

export default React.memo(FavouriteSearchList);
