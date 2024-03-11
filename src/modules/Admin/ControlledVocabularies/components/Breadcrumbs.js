import React from 'react';
import PropTypes from 'prop-types';

import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import Link from '@mui/material/Link';

const Breadcrumbs = ({ id, data, onBreadcrumbClick, disableLastPath = true }) => {
    return (
        <MuiBreadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextIcon fontSize="small" />}
            id={id}
            data-testid={id}
        >
            {data.map((item, index) => (
                <Link
                    key={`nav-${item.id}`}
                    id={`nav-${item.id}`}
                    data-testid={`nav-${item.id}`}
                    component="button"
                    onClick={event => onBreadcrumbClick({ event, id: item.id })}
                    disabled={disableLastPath && index === data.length - 1}
                    {...(disableLastPath && index === data.length - 1
                        ? {
                              sx: {
                                  textDecoration: 'none',
                                  color: 'default.light',
                                  cursor: 'default',
                              },
                          }
                        : {})}
                >
                    {item.title}
                </Link>
            ))}
        </MuiBreadcrumbs>
    );
};
Breadcrumbs.propTypes = {
    id: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired,
    onBreadcrumbClick: PropTypes.func.isRequired,
    disableLastPath: PropTypes.bool,
};
export default React.memo(Breadcrumbs);
