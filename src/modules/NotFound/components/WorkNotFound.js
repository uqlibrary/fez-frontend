import React from 'react';

import { StandardPage } from 'modules/SharedComponents/Toolbox/StandardPage';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import locale from 'locale/pages';
import PropTypes from 'prop-types';

const StyledGridWithTopMargin = styled(Grid)(({ theme }) => ({
    marginTop: '-12px',
    [theme.breakpoints.up('sm')]: {
        marginTop: '-24px',
    },
}));

export const WorkNotFound = ({
    title = locale.pages.workNotFound.title,
    message = locale.pages.workNotFound.message,
    loadingError,
}) => {
    return (
        <StandardPage className="workNotFound" title={title}>
            <StyledGridWithTopMargin container id="workNotFoundGridContainer" data-testid="workNotFoundGridContainer">
                <Grid item xs={12}>
                    {message}
                </Grid>
            </StyledGridWithTopMargin>
            {loadingError && loadingError.status && loadingError.message && (
                <Typography variant={'caption'} style={{ opacity: 0.5 }}>
                    {`(${loadingError.status} - ${loadingError.message})`}
                </Typography>
            )}
        </StandardPage>
    );
};

WorkNotFound.propTypes = {
    title: PropTypes.string,
    message: PropTypes.object,
    loadingError: PropTypes.object,
};

export default React.memo(WorkNotFound);
