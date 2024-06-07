import React, { useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

import * as actions from 'actions';

import { animationTemplate, VIEWMODES, MENUACTIONS, VIEWADMINPANELMODES } from '../config';
import { reorderArray } from '../utils';
import { transformQuickLinkUpdateRequest, transformQuickLinkReorderRequest } from '../transformers';
import { emptyQuickLinksActionState as emptyActionState, quickLinksActionReducer as actionReducer } from '../reducers';

import SectionTitle from './SectionTitle';
import QuickLink from './QuickLink';
import QuickLinkAdmin from './QuickLinkAdmin';

const QuickLinkContainer = ({ locale, initialViewProps = { opacity: 0 } }) => {
    const dispatch = useDispatch();
    const [data, setData] = React.useState([]);
    const [actionState, actionDispatch] = useReducer(actionReducer, { ...emptyActionState });

    const {
        adminDashboardQuickLinksData,
        adminDashboardQuickLinksLoading,
        adminDashboardQuickLinksSuccess,
        adminDashboardQuickLinksUpdating,
    } = useSelector(state => state.get('adminDashboardQuickLinksReducer'));

    useEffect(() => {
        if (!adminDashboardQuickLinksSuccess && (adminDashboardQuickLinksData?.length ?? 0) === 0) {
            dispatch(actions.loadAdminDashboardQuickLinks());
        } else {
            setData(adminDashboardQuickLinksData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminDashboardQuickLinksData, adminDashboardQuickLinksSuccess]);

    const clear = () => {
        actionDispatch({
            type: 'CLEAR',
        });
    };

    const handleReordering = data => {
        const request = transformQuickLinkReorderRequest(data);

        dispatch(actions.adminDashboardQuickLink(request, 'REORDER'))
            .then(() => {
                // clear();
            })
            .catch(error => {
                console.error(error);
                dispatch(actions.loadAdminDashboardQuickLinks()); // re-load the quick links if the save failed
            });
    };

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
                const dataTop = reorderArray(data, index, 0);
                setData(dataTop);
                handleReordering(dataTop);
                break;
            case MENUACTIONS.UP:
                const dataUp = reorderArray(data, index, index - 1);
                setData(dataUp);
                handleReordering(dataUp);
                break;
            case MENUACTIONS.BOTTOM:
                const dataBottom = reorderArray(data, index, data.length);
                setData(dataBottom);
                handleReordering(dataBottom);
                break;
            case MENUACTIONS.DOWN:
                const dataDown = reorderArray(data, index, index + 1);
                setData(dataDown);
                handleReordering(dataDown);
                break;
            default:
                console.log('action not handled', action);
        }
    };

    const handleAdminSubmitClick = item => {
        const request = transformQuickLinkUpdateRequest(item);
        dispatch(actions.adminDashboardQuickLink(request, actionState.action))
            .then(() => {
                clear();
                dispatch(actions.loadAdminDashboardQuickLinks());
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleAdminCancelClick = () => {
        clear();
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
                maxHeight: '800px',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'auto',
            }}
        >
            <SectionTitle sx={{ display: 'flex', alignItems: 'center' }}>
                {locale.title}
                {!!adminDashboardQuickLinksLoading && (
                    <CircularProgress
                        color="inherit"
                        size={20}
                        sx={{ marginInlineStart: 1 }}
                        data-testid={'quick-link-progressor'}
                    />
                )}
                {actionState.action === VIEWMODES.VIEW && !adminDashboardQuickLinksLoading && (
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

            {!!!adminDashboardQuickLinksData &&
                !!adminDashboardQuickLinksLoading &&
                [0, 0, 0, 0, 0, 0, 0, 0].map((_, index) => (
                    <Skeleton
                        key={index}
                        animation="wave"
                        height={50}
                        width={'100%'}
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
                                <Box paddingInlineEnd={2} maxHeight={800} overflow={'auto'}>
                                    <Stack spacing={2} marginBlockStart={2}>
                                        {data
                                            .sort((a, b) => a < b)
                                            .map((link, index) => (
                                                <QuickLink
                                                    key={link.qlk_id}
                                                    index={index}
                                                    locale={locale.link}
                                                    itemCount={data.length}
                                                    link={link}
                                                    onMenuItemClick={onMenuItemClick(index)}
                                                    sx={{
                                                        ...initialViewProps,
                                                        animation: animationTemplate(index, 200, 100),
                                                    }}
                                                />
                                            ))}
                                    </Stack>
                                </Box>
                            )}
                        </>
                    )}

                    {VIEWADMINPANELMODES.includes(actionState.action) && (
                        <Box
                            paddingBlockStart={2}
                            sx={{ ...initialViewProps, animation: animationTemplate(1, 200, 100) }}
                        >
                            {actionState.action === VIEWMODES.ADD && locale.admin.add.title}
                            {(actionState.action === VIEWMODES.EDIT || actionState.action === VIEWMODES.DELETE) && (
                                <>
                                    {actionState.action === VIEWMODES.EDIT
                                        ? locale.admin.edit.title
                                        : locale.admin.delete.title}
                                    <Typography fontWeight={500} variant="span">
                                        {actionState.item.qlk_title}
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
    initialViewProps: PropTypes.object,
};

export default React.memo(QuickLinkContainer);
