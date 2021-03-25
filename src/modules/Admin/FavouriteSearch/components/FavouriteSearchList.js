/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable, { MTableBodyRow, MTableEditRow, MTableAction } from 'material-table';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { tableIcons } from './FavouriteSearchListIcons';

import locale from 'locale/global';
import { APP_URL, PATH_PREFIX } from 'config';
import componentsLocale from 'locale/components';

export const useStyles = makeStyles(() => ({
    text: {
        fontSize: 13,
    },
}));

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
                    key={rowData.fvs_search_parameters}
                    href={`${APP_URL}${PATH_PREFIX}${rowData.fvs_search_parameters.replace('/', '')}`}
                    aria-label={locale.global.linkWillOpenInNewWindow.replace('[destination]', rowData.fvs_description)}
                >
                    <span
                        data-testid={`fvs-search-parameters-${rowData.tableData.id}-link`}
                        id={`fvs-search-parameters-${rowData.tableData.id}-link`}
                    >
                        {favouriteSearchList.columns.realLink.cellText}
                    </span>
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
                    className={classes.text}
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
                    href={`${APP_URL}${PATH_PREFIX}${rowData.fvs_alias}`}
                    aria-label={locale.global.linkWillOpenInNewWindow.replace('[destination]', rowData.fvs_description)}
                >
                    <span className={classes.text} data-testid={`fvs-alias-${rowData.tableData.id}-link`}>
                        {rowData.fvs_alias}
                    </span>
                </ExternalLink>
            ),
        },
        {
            title: favouriteSearchList.columns.alias.title,
            field: 'fvs_alias',
            render: rowData => (
                <Typography>
                    <span
                        className={classes.text}
                        data-testid={`fvs-alias-${rowData.tableData.id}`}
                        id={`fvs-alias-${rowData.tableData.id}`}
                    >
                        {rowData.fvs_alias}
                    </span>
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
    const classes = useStyles();
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
                Row: props => (
                    <MTableBodyRow
                        {...props}
                        className={classes.text}
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
                            setData(prevState => {
                                const data = [...prevState];
                                data[data.indexOf(oldData)] = newData;
                                return data;
                            });
                        })
                        .catch(() => setData(prevState => prevState));
                },
                onRowDelete: oldData => {
                    return handleRowDelete(oldData).then(() => {
                        setData(prevState => {
                            const data = [...prevState];
                            data.splice(data.indexOf(oldData), 1);
                            return data;
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
