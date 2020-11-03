/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import MaterialTable, { MTableBodyRow, MTableEditRow } from 'material-table';
// import Paper from '@material-ui/core/Paper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { numberToWords } from 'config';
import Hidden from '@material-ui/core/Hidden';
import AddCircle from '@material-ui/icons/AddCircle';
import Grid from '@material-ui/core/Grid';
import Edit from '@material-ui/icons/Edit';
import People from '@material-ui/icons/People';
import Person from '@material-ui/icons/Person';
import PersonOutlined from '@material-ui/icons/PersonOutlined';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import Tooltip from '@material-ui/core/Tooltip';
import Lock from '@material-ui/icons/Lock';
import KeyboardArrowUp from '@material-ui/icons/KeyboardArrowUp';
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import Delete from '@material-ui/icons/Delete';

import { tableIcons } from './AuthorsListIcons';
import OrgAffiliationTypeSelector from 'modules/SharedComponents/ContributorsEditor/components/OrgAffiliationTypeSelector';
import NonUqOrgAffiliationFormSection from 'modules/SharedComponents/ContributorsEditor/components/NonUqOrgAffiliationFormSection';
import Typography from '@material-ui/core/Typography';
import { UqIdField, RoleField } from 'modules/SharedComponents/LookupFields';
import { TextField } from 'modules/SharedComponents/Toolbox/TextField';

import { AFFILIATION_TYPE_NOT_UQ, ORG_TYPE_ID_UNIVERSITY, ORG_TYPES_LOOKUP, AFFILIATION_TYPE_UQ } from 'config/general';
import { default as globalLocale } from 'locale/global';

export const useStyles = makeStyles(() => ({
    linked: {
        fontWeight: 500,
    },
}));

const getIcon = rowData => {
    if (parseInt(rowData.uqIdentifier, 10)) {
        return <HowToRegIcon color="primary" />;
    } else if (rowData.selected) {
        return <Person color="secondary" />;
    } else if ((rowData.disabled || rowData.disabled) && !rowData.enableSelect) {
        return rowData.lockedTooltip ? (
            <Tooltip title={rowData.lockedTooltip}>
                <Lock color="secondary" />
            </Tooltip>
        ) : (
            <Lock color="secondary" />
        );
    } else {
        return <PersonOutlined color="secondary" />;
    }
};

export const NameAsPublished = React.memo(({ icon, text, linked }) => {
    const classes = useStyles();
    return (
        <Grid container spacing={2}>
            <Hidden xsDown>
                <Grid item style={{ alignSelf: 'center' }}>
                    {icon}
                </Grid>
            </Hidden>
            <Grid item className={linked ? classes.linked : ''}>
                {text}
            </Grid>
        </Grid>
    );
});

NameAsPublished.propTypes = {
    icon: PropTypes.element,
    text: PropTypes.element,
};

export const getColumns = ({ disabled, suffix, classes, showRoleInput, locale, isNtro }) => {
    const linkedClass = rowData => (!!rowData.aut_id ? classes.linked : '');
    const {
        header: {
            locale: { nameColumn, roleColumn, identifierColumn, organisationColumn },
        },
        form: {
            locale: { creatorRoleLabel, creatorRoleHint, nameAsPublishedLabel, nameAsPublishedHint, identifierLabel },
        },
    } = locale;
    return [
        {
            title: (
                <NameAsPublished
                    icon={<People color="secondary" />}
                    text={
                        <Typography variant="caption" color="secondary">
                            {nameColumn}
                        </Typography>
                    }
                />
            ),
            field: 'nameAsPublished',
            render: rowData => (
                <NameAsPublished
                    icon={getIcon({ ...rowData, disabled })}
                    text={
                        <React.Fragment>
                            <Typography variant="body2" className={linkedClass(rowData)}>
                                {rowData.nameAsPublished}
                            </Typography>
                            <Typography variant="caption" className={linkedClass(rowData)}>{`${numberToWords(
                                rowData.tableData.id + 1,
                            )} ${suffix}`}</Typography>
                        </React.Fragment>
                    }
                    linked={!!rowData.aut_id}
                />
            ),
            editComponent: props => {
                const { rowData: contributor } = props;
                return (
                    <Grid container spacing={2}>
                        <Hidden xsDown>
                            <Grid item style={{ alignSelf: 'center' }}>
                                <PersonOutlined color="secondary" />
                            </Grid>
                        </Hidden>
                        <Grid item style={{ flexGrow: '1' }}>
                            <TextField
                                autoFocus
                                value={props.value}
                                onChange={e => props.onChange(e.target.value)}
                                textFieldId="rek-author"
                                error={(contributor.nameAsPublished || '').length === 0}
                                label={nameAsPublishedLabel}
                                placeholder={nameAsPublishedHint}
                                required
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                );
            },
        },
        {
            title: (
                <Typography variant="caption" color="secondary">
                    {identifierColumn}
                </Typography>
            ),
            field: 'uqIdentifier',
            render: rowData => (
                <Typography variant="body2" className={linkedClass(rowData)}>
                    {(!!rowData.uqUsername && `${rowData.uqUsername} - ${rowData.uqIdentifier}`) ||
                        (rowData.uqIdentifier !== '0' && rowData.uqIdentifier) ||
                        ''}
                </Typography>
            ),
            editComponent: props => {
                const { rowData: contributor } = props;
                const prefilledSearch = contributor.uqIdentifier === '0';
                const value =
                    (prefilledSearch && contributor.nameAsPublished) ||
                    (!!contributor.uqUsername && `${contributor.uqUsername} - ${contributor.uqIdentifier}`) ||
                    contributor.uqIdentifier;

                const handleChange = selectedItem => {
                    const newValue = {
                        ...selectedItem,
                        nameAsPublished:
                            contributor.nameAsPublished ||
                            (selectedItem &&
                                selectedItem.aut_lname &&
                                `${selectedItem.aut_lname}, ${selectedItem.aut_fname}`),
                        uqIdentifier: `${selectedItem.aut_id}`,
                        orgaff:
                            (contributor.affiliation !== AFFILIATION_TYPE_NOT_UQ && globalLocale.global.orgTitle) ||
                            contributor.orgaff,
                        orgtype:
                            (contributor.affiliation !== AFFILIATION_TYPE_NOT_UQ && ORG_TYPE_ID_UNIVERSITY) ||
                            contributor.orgtype,
                        uqUsername: `${selectedItem.aut_org_username ||
                            selectedItem.aut_student_username ||
                            selectedItem.aut_ref_num}`,
                    };
                    props.onRowDataChange({ ...contributor, ...newValue });
                };

                const handleClear = () => {
                    props.onRowDataChange({
                        nameAsPublished: contributor.nameAsPublished,
                        creatorRole: contributor.creatorRole,
                        orgaff: 'Missing',
                        orgtype: '',
                        uqIdentifier: '0',
                        uqUsername: '',
                        affiliation: '',
                    });
                };

                return (
                    <UqIdField
                        {...props}
                        clearOnInputClear
                        floatingLabelText={identifierLabel}
                        hintText="Type UQ author name to search"
                        uqIdFieldId={'rek-author-aut-id'}
                        key={!!contributor.uqIdentifier ? contributor.uqIdentifier : contributor.uqUsername || 'aut-id'}
                        onChange={handleChange}
                        onClear={handleClear}
                        value={value}
                        prefilledSearch={prefilledSearch}
                    />
                );
            },
            searchable: true,
        },
        ...(showRoleInput
            ? [
                  {
                      title: (
                          <Typography variant="caption" color="secondary">
                              {roleColumn}
                          </Typography>
                      ),
                      field: 'creatorRole',
                      render: rowData => (
                          <Typography variant="body2" className={linkedClass(rowData)}>
                              {rowData.creatorRole}
                          </Typography>
                      ),
                      editComponent: props => {
                          const { rowData: contributor } = props;
                          const handleChange = selectedItem => {
                              const newValue = {
                                  ...contributor,
                                  creatorRole: selectedItem,
                              };
                              props.onRowDataChange({ ...contributor, ...newValue });
                          };
                          return (
                              <RoleField
                                  {...props}
                                  fullWidth
                                  key={`role-input-${(contributor.nameAsPublished || '').trim().length === 0}`}
                                  id="creator-role-field"
                                  floatingLabelText={creatorRoleLabel}
                                  hintText={creatorRoleHint}
                                  onChange={handleChange}
                                  disabled={disabled || (contributor.nameAsPublished || '').trim().length === 0}
                                  required
                                  autoComplete="off"
                                  error={
                                      (contributor.nameAsPublished || '').trim().length === 0
                                          ? false
                                          : (contributor.creatorRole || '').trim().length === 0
                                  }
                                  value={contributor.creatorRole}
                              />
                          );
                      },
                  },
              ]
            : []),
        ...(isNtro
            ? [
                  {
                      title: (
                          <Typography variant="caption" color="secondary">
                              {organisationColumn}
                          </Typography>
                      ),
                      field: 'orgaff',
                      render: rowData => (
                          <Grid container>
                              <Grid item xs={12}>
                                  <Typography variant="body2" className={linkedClass(rowData)}>
                                      {rowData.orgaff}
                                  </Typography>
                              </Grid>
                              <Grid item xs={12}>
                                  <Typography variant="caption" className={linkedClass(rowData)}>
                                      {`${(!!rowData.orgtype &&
                                          !!ORG_TYPES_LOOKUP[rowData.orgtype] &&
                                          `Organisation type: ${ORG_TYPES_LOOKUP[rowData.orgtype]}`) ||
                                          ''}`}
                                  </Typography>
                              </Grid>
                          </Grid>
                      ),
                      editComponent: props => {
                          const { rowData: contributor } = props;

                          const handleOrgAffliationChange = event => {
                              props.onRowDataChange({ ...contributor, orgaff: event.target.value });
                          };
                          const handleOrgTypeChange = event => {
                              props.onRowDataChange({ ...contributor, orgtype: event.target.value });
                          };
                          const handleAffiliationChange = event => {
                              const affiliation = event.target.value;
                              props.onRowDataChange({
                                  ...contributor,
                                  affiliation: affiliation,
                                  orgaff:
                                      (affiliation === AFFILIATION_TYPE_UQ && globalLocale.global.orgTitle) ||
                                      contributor.orgaff,
                                  orgtype:
                                      (affiliation === AFFILIATION_TYPE_UQ && ORG_TYPE_ID_UNIVERSITY) ||
                                      contributor.orgtype,
                              });
                          };
                          return (
                              <React.Fragment>
                                  {isNtro && (
                                      <OrgAffiliationTypeSelector
                                          affiliation={contributor.affiliation}
                                          onAffiliationChange={handleAffiliationChange}
                                          error={!contributor.affiliation}
                                          disabled={disabled}
                                      />
                                  )}
                                  {contributor.affiliation === AFFILIATION_TYPE_NOT_UQ && (
                                      <NonUqOrgAffiliationFormSection
                                          {...props}
                                          orgAffiliation={contributor.orgaff || ''}
                                          orgType={contributor.orgtype || ''}
                                          onOrgAffiliationChange={handleOrgAffliationChange}
                                          onOrgTypeChange={handleOrgTypeChange}
                                          disableAffiliationEdit={disabled}
                                          disableOrgTypeEdit={disabled}
                                          orgAffiliationError={contributor.orgaff === ''}
                                          orgAffiliationTypeError={contributor.orgtype === ''}
                                      />
                                  )}
                              </React.Fragment>
                          );
                      },
                  },
              ]
            : []),
    ];
};

export const AuthorDetail = rowData => {
    return (
        <Grid container item xs={12} style={{ padding: 16 }}>
            <Grid item xs={2}>
                <Typography variant="subtitle2">{'Organisation affiliation'}</Typography>
            </Grid>
            <Grid item xs={10}>
                <Typography variant="body2">{rowData.orgaff}</Typography>
            </Grid>
            <Grid item xs={2}>
                <Typography variant="subtitle2">{'Organisation type'}</Typography>
            </Grid>
            <Grid item xs={10}>
                <Typography variant="body2">{rowData.orgtype}</Typography>
            </Grid>
        </Grid>
    );
};

export const AuthorsList = ({ contributorEditorId, disabled, isNtro, list, locale, onChange, showRoleInput }) => {
    const {
        row: {
            locale: {
                // deleteRecordConfirmation,
                moveUpHint,
                moveDownHint,
                deleteHint,
                editHint,
                // selectHint,
                // lockedTooltip,
                suffix,
            },
        },
    } = locale;
    const classes = useStyles();
    const theme = useTheme();
    const materialTableRef = React.createRef();
    const columns = React.createRef();
    columns.current = getColumns({ disabled, suffix, classes, showRoleInput, locale, isNtro });

    const [data, setData] = React.useState(list);

    const handleAuthorUpdate = (action, newData, oldData) => {
        const materialTable = materialTableRef.current;
        let newList = data;

        console.log(action, newList, newData, oldData);

        if (
            action === 'update' &&
            data.filter(
                (contributor, index) =>
                    index !== oldData.tableData.id && !!contributor.aut_id && contributor.aut_id === newData.aut_id,
            ).length > 0
        ) {
            newList = data;
        } else if (
            action === 'add' &&
            data.filter(contributor => !!contributor.aut_id && contributor.aut_id === newData.aut_id).length > 0
        ) {
            newList = data;
        } else {
            newList =
                action === 'update'
                    ? [...data.slice(0, oldData.tableData.id), newData, ...data.slice(oldData.tableData.id + 1)]
                    : [...data, newData];
        }

        onChange(newList);
        setData(newList);

        materialTable.dataManager.changePaging(newList.length > 10);

        materialTable.setState({
            ...materialTable.dataManager.getRenderState(),
            showAddRow: false,
        });
    };

    return (
        <MaterialTable
            tableRef={materialTableRef}
            columns={columns.current}
            components={{
                Container: props => (
                    <div {...props} id={`${contributorEditorId}-list`} data-testid={`${contributorEditorId}-list`} />
                ),
                Row: props => (
                    <MTableBodyRow
                        {...props}
                        id={`${contributorEditorId}-list-row-${props.index}`}
                        data-testid={`${contributorEditorId}-list-row-${props.index}`}
                    />
                ),
                EditRow: props => (
                    <MTableEditRow
                        {...props}
                        id={`${contributorEditorId}-list-edit-row-${props.index}`}
                        data-testid={`${contributorEditorId}-list-edit-row-${props.index}`}
                        onEditingApproved={handleAuthorUpdate}
                    />
                ),
            }}
            actions={[
                rowData => ({
                    icon: props => <KeyboardArrowUp {...props} />,
                    iconProps: {
                        id: `${contributorEditorId}-list-row-${rowData.tableData.id}-move-up`,
                        'data-testid': `${contributorEditorId}-list-row-${rowData.tableData.id}-move-up`,
                    },
                    tooltip: moveUpHint,
                    disabled: disabled || rowData.tableData.id === 0,
                    onClick: () => {
                        const index = rowData.tableData.id;
                        const nextContributor = data[index - 1];
                        console.log(materialTableRef.current.scrollTop);
                        const newList = [
                            ...data.slice(0, index - 1),
                            rowData,
                            nextContributor,
                            ...data.slice(index + 1),
                        ];
                        setData(newList);
                        onChange(newList);
                    },
                }),
                rowData => ({
                    icon: props => <KeyboardArrowDown {...props} />,
                    iconProps: {
                        id: `${contributorEditorId}-list-row-${rowData.tableData.id}-move-down`,
                        'data-testid': `${contributorEditorId}-list-row-${rowData.tableData.id}-move-down`,
                    },
                    tooltip: moveDownHint,
                    disabled: disabled || rowData.tableData.id === data.length - 1,
                    onClick: () => {
                        const index = rowData.tableData.id;
                        const nextContributor = data[index + 1];
                        const newList = [...data.slice(0, index), nextContributor, rowData, ...data.slice(index + 2)];
                        setData(newList);
                        onChange(newList);
                    },
                }),
                rowData => ({
                    icon: props => <Edit {...props} />,
                    iconProps: {
                        id: `${contributorEditorId}-list-row-${rowData.tableData.id}-edit`,
                        'data-testid': `${contributorEditorId}-list-row-${rowData.tableData.id}-edit`,
                    },
                    disabled: disabled,
                    tooltip: editHint,
                    onClick: (event, rowData) => {
                        const materialTable = materialTableRef.current;
                        materialTable.dataManager.changeRowEditing(rowData, 'update');
                        materialTable.setState({
                            ...materialTable.dataManager.getRenderState(),
                        });
                    },
                }),
                rowData => ({
                    icon: props => <Delete {...props} />,
                    iconProps: {
                        id: `${contributorEditorId}-list-row-${rowData.tableData.id}-delete`,
                        'data-testid': `${contributorEditorId}-list-row-${rowData.tableData.id}-delete`,
                    },
                    disabled: disabled,
                    tooltip: deleteHint,
                    onClick: () => {},
                }),
                {
                    icon: props => <AddCircle {...props} color="primary" fontSize="large" />,
                    iconProps: {
                        id: `${contributorEditorId}-add`,
                        'data-testid': `${contributorEditorId}-add`,
                    },
                    isFreeAction: true,
                    onClick: () => {
                        const materialTable = materialTableRef.current;
                        materialTable.dataManager.changeRowEditing();
                        materialTable.setState({
                            ...materialTable.dataManager.getRenderState(),
                            showAddRow: true,
                        });
                    },
                },
            ]}
            data={data}
            icons={tableIcons}
            title=""
            {...(!isNtro ? { detailPanel: AuthorDetail } : {})}
            editable={{
                onRowUpdateCancelled: () => {},
            }}
            options={{
                actionsColumnIndex: -1,
                grouping: false,
                draggable: false,
                search: false,
                addRowPosition: 'first',
                filtering: data.length > 10,
                emptyRowsWhenPaging: true,
                ...(data.length > 10 ? { maxBodyHeight: 550 } : {}),
                ...(data.length > 10 ? { paging: true } : { paging: false }),
                ...(data.length > 100 ? { pageSize: data.length > 100 ? 50 : 5 } : {}),
                pageSizeOptions: [5, 50, 100, 200, 500],
                padding: 'dense',
                rowStyle: rowData => {
                    if (!!rowData.selected) {
                        return {
                            backgroundColor: theme.palette.accent.main,
                        };
                    } else if (!!rowData.aut_id) {
                        return {
                            backgroundColor: theme.palette.secondary.light,
                            color: theme.palette.primary.main,
                        };
                    } else {
                        return {};
                    }
                },
                overflowY: list.length > 10 ? 'auto' : 'hidden',
            }}
        />
    );
};

AuthorsList.propTypes = {
    contributorEditorId: PropTypes.string,
    disabled: PropTypes.bool,
    isNtro: PropTypes.bool,
    list: PropTypes.array,
    locale: PropTypes.object,
    onChange: PropTypes.func,
    showRoleInput: PropTypes.bool,
};

export default React.memo(AuthorsList);
