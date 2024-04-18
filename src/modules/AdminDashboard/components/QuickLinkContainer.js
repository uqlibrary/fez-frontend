import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';

import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

import * as actions from 'actions';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

import { arrayMove } from '../utils';
import SectionTitle from './SectionTitle';
import QuickLink, { menuActions } from './QuickLink';

const QuickLinkContainer = ({ locale }) => {
    const dispatch = useDispatch();
    const [data, setData] = React.useState([]);
    const {
        adminDashboardQuickLinksData,
        adminDashboardQuickLinksLoading,
        adminDashboardQuickLinksSuccess,
    } = useSelector(state => state.get('adminDashboardQuickLinksReducer'));

    useEffect(() => {
        if ((adminDashboardQuickLinksData?.length ?? 0) === 0) {
            dispatch(actions.loadAdminDashboardQuickLinks());
        } else {
            setData(adminDashboardQuickLinksData);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adminDashboardQuickLinksData]);

    const onLinkClick = link => () => {
        console.log(link, 'click');
    };

    const onMenuItemClick = index => action => {
        console.log(index, action);
        let modifiedArray;

        switch (action) {
            case menuActions.top:
                modifiedArray = arrayMove(data, index, 0);
                break;
            case menuActions.up:
                modifiedArray = arrayMove(data, index, index - 1);
                break;
            case menuActions.bottom:
                modifiedArray = arrayMove(data, index, data.length);
                break;
            case menuActions.down:
                modifiedArray = arrayMove(data, index, index + 1);
                break;
            default:
                console.log('action not handled', action);
        }
        setData(modifiedArray);
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
                            onLinkClick={onLinkClick(link)}
                            onMenuItemClick={onMenuItemClick(index)}
                        />
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
