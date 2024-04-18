import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import * as actions from 'actions';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

import SectionTitle from './SectionTitle';
import QuickLink from './QuickLink';

const QuickLinkContainer = ({ locale }) => {
    const dispatch = useDispatch();
    const {
        adminDashboardQuickLinksData,
        adminDashboardQuickLinksLoading,
        adminDashboardQuickLinksSuccess,
    } = useSelector(state => state.get('adminDashboardQuickLinksReducer'));

    useEffect(() => {
        dispatch(actions.loadAdminDashboardQuickLinks());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onLinkClick = id => {
        console.log(id, 'click');
    };

    return (
        <Box
            paddingInlineStart={2}
            borderLeft={'1px solid rgba(224, 224, 224, 1)'}
            sx={{ height: '100%', minHeight: '100%', display: 'flex', flexDirection: 'column' }}
        >
            <SectionTitle>
                {locale.title}
                <ExternalLink id={'add-quick-link'} data-testid={'add-quick-link'} href={'#'} openInNewIcon={false}>
                    <Typography
                        fontSize={'0.875rem'}
                        paddingInlineStart={1}
                        paddingInlineEnd={2}
                        textTransform={'none'}
                        variant="span"
                        display={'inline-block'}
                        fontWeight={200}
                    >
                        {locale.addLinkText}
                    </Typography>
                </ExternalLink>
            </SectionTitle>

            {!!adminDashboardQuickLinksLoading &&
                [0, 0, 0, 0, 0, 0, 0, 0].map(() => (
                    <Skeleton
                        animation="wave"
                        height={50}
                        width={'100%'}
                        id={'admin-dashboard-quicklinks-skeleton'}
                        data-testid={'admin-dashboard-quicklinks-skeleton'}
                    />
                ))}
            {(!!!adminDashboardQuickLinksData || (adminDashboardQuickLinksData?.length ?? 0) === 0) &&
                adminDashboardQuickLinksSuccess && (
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
            {!!adminDashboardQuickLinksData && adminDashboardQuickLinksSuccess && (
                <Stack spacing={2} marginBlockStart={2}>
                    {adminDashboardQuickLinksData.map(link => (
                        <QuickLink key={link.id} link={link} onLinkClick={onLinkClick} />
                    ))}
                </Stack>
            )}
        </Box>
    );
};

QuickLinkContainer.propTypes = {
    locale: PropTypes.object.isRequired,
};

export default React.memo(QuickLinkContainer);
