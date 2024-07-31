import React from 'react';
import PropTypes from 'prop-types';
import { numberToWords } from 'config';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import RadioButtonUnchecked from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonChecked from '@mui/icons-material/RadioButtonChecked';
import Link from '@mui/icons-material/Link';

export const AuthorItem = ({
    authorItemId,
    type,
    linked,
    selected,
    disabled,
    author,
    onAuthorSelected,
    locale,
    index,
}) => {
    const selectAuthor = () => {
        onAuthorSelected && onAuthorSelected(author);
    };

    const getAuthorItemStatusIcon = (linked, selected) => {
        if (!linked && !selected) {
            return <RadioButtonUnchecked sx={{ marginRight: 1 }} color="secondary" />;
        } else if (linked) {
            return <Link sx={{ marginRight: 1 }} />;
        } else {
            return <RadioButtonChecked sx={{ marginRight: 1 }} color="primary" />;
        }
    };

    const { suffix } = locale;
    const authorOrder = `${numberToWords(index + 1)} ${suffix.replace('[type]', type)}`;
    // eg First listed author
    const icon = getAuthorItemStatusIcon(linked, selected);
    const isDisabled = disabled || linked;

    return (
        <Grid item xs={12} sm={6} md={4}>
            <Button
                onClick={!linked && !selected ? selectAuthor : undefined}
                fullWidth
                disabled={isDisabled}
                sx={{ justifyContent: 'flex-start', marginBottom: -1, marginTop: 1 }}
                startIcon={icon}
                children={
                    <Typography
                        variant="button"
                        id={`${authorItemId}-name`}
                        data-testid={`${authorItemId}-name`}
                        align="left"
                    >
                        {author[`rek_${type}`]}
                    </Typography>
                }
                id={`${authorItemId}`}
                data-analyticsid={`${authorItemId}`}
                data-testid={`${authorItemId}`}
            />
            <Typography
                variant="caption"
                sx={{ marginLeft: 5, marginBottom: 2 }}
                id={`${authorItemId}-order`}
                data-testid={`${authorItemId}-order`}
            >
                {authorOrder}
            </Typography>
        </Grid>
    );
};

AuthorItem.propTypes = {
    authorItemId: PropTypes.string,
    type: PropTypes.string,
    linked: PropTypes.bool,
    selected: PropTypes.bool,
    disabled: PropTypes.bool,
    author: PropTypes.object,
    onAuthorSelected: PropTypes.func,
    locale: PropTypes.object,
    index: PropTypes.number,
};

AuthorItem.defaultProps = {
    locale: {
        suffix: ' listed [type]',
    },
};

export default React.memo(AuthorItem);
