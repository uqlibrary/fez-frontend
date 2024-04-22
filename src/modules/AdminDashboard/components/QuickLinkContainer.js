import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import * as actions from 'actions';

import { arrayMove } from '../utils';

import SectionTitle from './SectionTitle';
import QuickLink, { menuActions } from './QuickLink';
import QuickLinkAdmin from './QuickLinkAdmin';

export const animationTemplate = (i, duration, delay) =>
    `animateFadeIn ${duration}ms ease-out ${delay * (i + 1)}ms forwards`;

export const VIEWMODES = {
    VIEW: 0,
    ADD: 1,
    EDIT: 2,
};

export const emptyActionState = { action: VIEWMODES.VIEW, item: { title: '', target: '' } };
export const actionReducer = (_, action) => {
    switch (action.type) {
        case VIEWMODES.ADD:
            return {
                action: action.type,
                item: action.item,
            };
        case VIEWMODES.EDIT:
            return {
                action: action.type,
                item: action.item,
            };
        default:
            return { ...emptyActionState };
    }
};

const QuickLinkContainer = ({ locale }) => {
    const dispatch = useDispatch();
    const [data, setData] = React.useState([]);
    // eslint-disable-next-line no-unused-vars
    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });

    const {
        adminDashboardQuickLinksData,
        adminDashboardQuickLinksLoading,
        adminDashboardQuickLinksSuccess,
        adminDashboardQuickLinksAdding,
    } = useSelector(state => state.get('adminDashboardQuickLinksReducer'));

    useEffect(() => {
        console.log('in effect');
        if ((adminDashboardQuickLinksData?.length ?? 0) === 0) {
            console.log('load');
            dispatch(actions.loadAdminDashboardQuickLinks());
        } else {
            console.log('set');
            setData(adminDashboardQuickLinksData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminDashboardQuickLinksData]);

    const onMenuItemClick = index => action => {
        switch (action) {
            case menuActions.edit:
                actionDispatch({
                    type: VIEWMODES.EDIT,
                    item: data.find((_, dataIndex) => dataIndex === index),
                });
                break;
            case menuActions.delete:
                actionDispatch({
                    type: VIEWMODES.EDIT,
                    item: data.find((_, dataIndex) => dataIndex === index),
                });
                break;
            case menuActions.top:
                setData(arrayMove(data, index, 0));
                break;
            case menuActions.up:
                setData(arrayMove(data, index, index - 1));
                break;
            case menuActions.bottom:
                setData(arrayMove(data, index, data.length));
                break;
            case menuActions.down:
                setData(arrayMove(data, index, index + 1));
                break;
            default:
                console.log('action not handled', action);
        }
    };

    const closeAdminPanel = () => {
        actionDispatch({
            type: 'CLEAR',
        });
    };

    const handleAdminSubmitClick = React.useCallback(data => {
        const wrappedRequest = structuredClone(data);
        actions
            .adminAddDashboardQuickLink(wrappedRequest)
            .then(() => {
                setData(prev => prev.unshift({ id: Date.now(), amount: 0, order: 0, ...wrappedRequest }));
                closeAdminPanel();
                //     openConfirmationAlert(locale.config.alerts.success(), 'success');
                //     actions.loadInspectionDevices();
            })
            .catch(error => {
                console.error(error);
                // openConfirmationAlert(locale.config.alerts.failed(pageLocale.snackbar.addFail), 'error');
            })
            .finally(() => {
                // setDialogueBusy(false);
            });

        console.log(data);
    }, []);

    const handleAdminCancelClick = () => {
        closeAdminPanel();
    };
    const onAdminAddClick = () => {
        actionDispatch({
            ...emptyActionState,
            type: VIEWMODES.ADD,
        });
    };

    return (
        <Box
            paddingInlineStart={2}
            borderLeft={'1px solid rgba(224, 224, 224, 1)'}
            sx={{ height: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <SectionTitle sx={{ display: 'flex', alignItems: 'center' }}>
                {locale.title}
                {actionState.action === VIEWMODES.VIEW && (
                    <Button
                        id={'add-quick-link'}
                        data-testid={'add-quick-link'}
                        variant="text"
                        sx={{ textTransform: 'none', flex: 1, justifyContent: 'end' }}
                        onClick={onAdminAddClick}
                    >
                        {locale.addLinkText}
                    </Button>
                )}
            </SectionTitle>

            {!!adminDashboardQuickLinksLoading &&
                [0, 0, 0, 0, 0, 0, 0, 0].map((_, index) => (
                    <Skeleton
                        key={index}
                        animation="wave"
                        height={50}
                        width={'100%'}
                        id={'admin-dashboard-quicklinks-skeleton'}
                        data-testid={'admin-dashboard-quicklinks-skeleton'}
                    />
                ))}

            {actionState.action === VIEWMODES.VIEW && (
                <>
                    {(!!!data || (data?.length ?? 0) === 0) && adminDashboardQuickLinksSuccess && (
                        <Typography
                            fontSize={'0.8rem'}
                            fontWeight={300}
                            textAlign={'center'}
                            mt={1}
                            flex={1}
                            alignContent={'center'}
                        >
                            {locale.loading.nodata}
                        </Typography>
                    )}

                    {!!data && adminDashboardQuickLinksSuccess && (
                        <Stack spacing={2} marginBlockStart={2}>
                            {data.map((link, index) => (
                                <QuickLink
                                    key={link.id}
                                    index={index}
                                    itemCount={data.length}
                                    link={link}
                                    onMenuItemClick={onMenuItemClick(index)}
                                    sx={{ opacity: 0, animation: animationTemplate(index, 200, 100) }}
                                />
                            ))}
                        </Stack>
                    )}
                </>
            )}
            {actionState.action === VIEWMODES.ADD && (
                <Box paddingBlockStart={2} sx={{ opacity: 0, animation: animationTemplate(1, 200, 100) }}>
                    Add new quick link
                    <QuickLinkAdmin
                        item={actionState.item}
                        onSubmitClick={handleAdminSubmitClick}
                        onCancelClick={handleAdminCancelClick}
                    />
                </Box>
            )}
            {actionState.action === VIEWMODES.EDIT && (
                <Box paddingBlockStart={2} sx={{ opacity: 0, animation: animationTemplate(1, 200, 100) }}>
                    Edit{' '}
                    <Typography fontWeight={500} variant="span">
                        {actionState.item.title}
                    </Typography>
                    <QuickLinkAdmin
                        item={actionState.item}
                        onSubmitClick={handleAdminSubmitClick}
                        onCancelClick={handleAdminCancelClick}
                        busy={adminDashboardQuickLinksAdding}
                    />
                </Box>
            )}
        </Box>
    );
};

QuickLinkContainer.propTypes = {
    locale: PropTypes.object.isRequired,
};

export default React.memo(QuickLinkContainer);
