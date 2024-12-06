import React from 'react';
import Grid from '@mui/material/Grid';
import PropTypes from 'prop-types';
import { APP_URL } from 'config';
import Avatar from '@mui/material/Avatar';
import { grey } from '@mui/material/colors';
import PrintIcon from '@mui/icons-material/Print';
import EmailOutlined from '@mui/icons-material/EmailOutlined';
import { ExternalLink } from 'modules/SharedComponents/ExternalLink';

export const SocialShare = ({ publication, size = 24, spaceBetween = 4, services }) => {
    const printPage = () => window.print();
    const locale = {
        email: {
            id: 'email',
            link: {
                href: `mailto:?subject=${publication.rek_title}&body=Please review this record in UQ eSpace: ${APP_URL}view/${publication.rek_pid}`,
                title: 'Share this record via Email',
                openInNewIcon: false,
            },
            icon: EmailOutlined,
        },
        print: {
            id: 'print',
            link: {
                href: '#',
                onClick: printPage,
                target: '',
                title: 'Print this record',
                openInNewIcon: false,
            },
            icon: PrintIcon,
        },
    };
    return (
        <Grid container spacing={0} id="social-share">
            {services &&
                services.length > 0 &&
                services.map((item, index) => {
                    const Icon = locale[item].icon;
                    return (
                        <Grid item id={item.id} key={index} style={{ marginRight: spaceBetween }}>
                            <ExternalLink
                                {...locale[item].link}
                                id={locale[item].id}
                                data-testid={`social-share-${locale[item].id}-link`}
                            >
                                <Avatar sx={{ width: size, height: size, bgcolor: grey[600] }}>
                                    <Icon sx={{ width: 0.7 * size, height: 0.7 * size }} />
                                </Avatar>
                            </ExternalLink>
                        </Grid>
                    );
                })}
        </Grid>
    );
};

SocialShare.propTypes = {
    publication: PropTypes.object.isRequired,
    size: PropTypes.number,
    spaceBetween: PropTypes.number,
    services: PropTypes.array.isRequired,
    round: PropTypes.bool,
};
