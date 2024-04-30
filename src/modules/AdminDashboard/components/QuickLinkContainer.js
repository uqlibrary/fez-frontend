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
import QuickLink, { MENUACTIONS } from './QuickLink';
import QuickLinkAdmin from './QuickLinkAdmin';

export const animationTemplate = (i, duration, delay) =>
    `animateFadeIn ${duration}ms ease-out ${delay * (i + 1)}ms forwards`;

export const VIEWMODES = {
    VIEW: 'VIEW',
    ADD: 'ADD',
    EDIT: 'EDIT',
    DELETE: 'DELETE',
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
        case VIEWMODES.DELETE:
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
        adminDashboardQuickLinksUpdating,
    } = useSelector(state => state.get('adminDashboardQuickLinksReducer'));

    useEffect(() => {
        if ((adminDashboardQuickLinksData?.length ?? 0) === 0) {
            dispatch(actions.loadAdminDashboardQuickLinks());
        } else {
            setData(adminDashboardQuickLinksData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminDashboardQuickLinksData]);

    const onMenuItemClick = index => action => {
        switch (action) {
            case MENUACTIONS.EDIT:
                actionDispatch({
                    type: VIEWMODES.EDIT,
                    item: data.find((_, dataIndex) => dataIndex === index),
                });
                break;
            case MENUACTIONS.DELETE:
                actionDispatch({
                    type: VIEWMODES.DELETE,
                    item: data.find((_, dataIndex) => dataIndex === index),
                });
                break;
            case MENUACTIONS.TOP:
                setData(arrayMove(data, index, 0));
                break;
            case MENUACTIONS.UP:
                setData(arrayMove(data, index, index - 1));
                break;
            case MENUACTIONS.BOTTOM:
                setData(arrayMove(data, index, data.length));
                break;
            case MENUACTIONS.DOWN:
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

    const handleAdminSubmitClick = item => {
        const request = structuredClone(item);

        dispatch(actions.adminDashboardQuickLink(request, actionState.action))
            .then(() => {
                closeAdminPanel();
                //     openConfirmationAlert(locale.config.alerts.success(), 'success');
                dispatch(actions.loadAdminDashboardQuickLinks());
            })
            .catch(error => {
                console.error(error);
                // openConfirmationAlert(locale.config.alerts.failed(pageLocale.snackbar.addFail), 'error');
            })
            .finally(() => {
                // setDialogueBusy(false);
            });
    };

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
            sx={{
                height: '100%',
                minHeight: '100%',
                maxHeight: '400px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
            }}
        >
            <SectionTitle sx={{ display: 'flex', alignItems: 'center' }}>
                {locale.title}
                {actionState.action === VIEWMODES.VIEW && (
                    <Button
                        id={'add-quick-link'}
                        data-testid={'add-quick-link'}
                        variant="text"
                        sx={{ textTransform: 'none', marginLeft: 'auto' }}
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

            {!adminDashboardQuickLinksLoading && (
                <>
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
                                <Box paddingInlineEnd={2} maxHeight={400} overflow={'auto'}>
                                    <Stack spacing={2} marginBlockStart={2}>
                                        {data.map((link, index) => (
                                            <QuickLink
                                                key={link.id}
                                                index={index}
                                                locale={locale.link}
                                                itemCount={data.length}
                                                link={link}
                                                onMenuItemClick={onMenuItemClick(index)}
                                                sx={{ opacity: 0, animation: animationTemplate(index, 200, 100) }}
                                            />
                                        ))}
                                    </Stack>
                                </Box>
                            )}
                        </>
                    )}

                    {actionState.action !== VIEWMODES.VIEW && (
                        <Box paddingBlockStart={2} sx={{ opacity: 0, animation: animationTemplate(1, 200, 100) }}>
                            {actionState.action === VIEWMODES.ADD && locale.admin.add.title}
                            {(actionState.action === VIEWMODES.EDIT || actionState.action === VIEWMODES.DELETE) && (
                                <>
                                    {actionState.action === VIEWMODES.EDIT
                                        ? locale.admin.edit.title
                                        : locale.admin.delete.title}
                                    <Typography fontWeight={500} variant="span">
                                        {actionState.item.title}
                                    </Typography>
                                </>
                            )}
                            <QuickLinkAdmin
                                locale={locale.admin}
                                item={actionState.item}
                                action={actionState.action}
                                onSubmitClick={handleAdminSubmitClick}
                                onCancelClick={handleAdminCancelClick}
                                busy={adminDashboardQuickLinksUpdating}
                            />
                        </Box>
                    )}
                </>
            )}
        </Box>
    );
};

QuickLinkContainer.propTypes = {
    locale: PropTypes.object.isRequired,
};

export default React.memo(QuickLinkContainer);
