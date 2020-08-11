/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable, { MTableBodyRow, MTableEditRow } from 'material-table';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { ExternalLink } from 'modules/SharedComponents/ExternalLink';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';
import { tableIcons } from './FavouriteSearchListIcons';

import locale from 'locale/global';
import { APP_URL, PATH_PREFIX } from 'config';
import componentsLocale from 'locale/components';

export const getColumns = () => {
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
                    {favouriteSearchList.columns.realLink.cellText}
                </ExternalLink>
            ),
        },
        {
            title: favouriteSearchList.columns.description.title,
            field: 'fvs_description',
            render: rowData => (
                <Typography data-testid="fvs-description" id="fvs-description">
                    {rowData.fvs_description}
                </Typography>
            ),
            editComponent: props => (
                <TextField
                    {...props}
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
                    href={rowData.fvs_alias}
                    aria-label={locale.global.linkWillOpenInNewWindow.replace('[destination]', rowData.fvs_description)}
                >
                    {rowData.fvs_alias}
                </ExternalLink>
            ),
        },
        {
            title: favouriteSearchList.columns.alias.title,
            field: 'fvs_alias',
            render: rowData => (
                <Typography data-testid="fvs-alias" id="fvs-alias">
                    {rowData.fvs_alias}
                </Typography>
            ),
            editComponent: props => (
                <TextField
                    {...props}
                    value={props.value}
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
    columns.current = getColumns();

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
