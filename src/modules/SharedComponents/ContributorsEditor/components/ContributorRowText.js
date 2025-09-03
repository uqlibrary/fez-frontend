import React from 'react';
import PropTypes from 'prop-types';
import { userIsAdmin } from 'hooks';
import locale from 'locale/global';
import { numberToWords } from 'config';
import { AFFILIATION_TYPE_NOT_UQ, ORG_TYPES_LOOKUP } from 'config/general';
import Grid from '@mui/material/GridLegacy';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

const getListItemTypography = (primaryText, secondaryText, primaryTypographyClass, secondaryTypographyClass) => (
    <ListItemText
        disableTypography
        primary={
            primaryText && (
                <Typography noWrap variant="body2" sx={{ ...primaryTypographyClass }}>
                    {primaryText}
                </Typography>
            )
        }
        secondary={
            secondaryText && (
                <Typography noWrap variant="caption" display={'block'} sx={{ ...secondaryTypographyClass }}>
                    {secondaryText}
                </Typography>
            )
        }
        secondaryTypographyProps={{ variant: 'caption' }}
    />
);

export const ContributorRowText = ({
    canEdit,
    classes,
    contributor,
    contributorRowId,
    index,
    selectedClass,
    showRoleInput,
    suffix,
    width,
}) => {
    const isAdmin = userIsAdmin();
    const md = showRoleInput && isAdmin && canEdit ? 4 : 5;
    const idColWidth = showRoleInput && isAdmin && canEdit ? 4 : 5;
    const contributorOrder = `${numberToWords(index + 1)} ${suffix}`;
    // eg First listed author

    const isAuthorLinked = author => {
        return author.aut_id > 0;
    };

    const haveFullAuthorDetails = author => {
        return (
            !!author.aut_display_name &&
            (!!author.aut_org_username || !!author.aut_student_username || !!author.aut_ref_num)
        );
    };

    if (!contributor.aut_title || contributor.aut_title.length < 2) {
        contributor.aut_title = ''; // if missing or has silly value - blank
    }

    const primaryTypographyClass = { ...(width === 'xs' ? classes.identifierName : classes.primary), ...selectedClass };
    const secondaryTypographyClass = { ...(width === 'xs' ? classes.identifierSubtitle : {}), ...selectedClass };

    return (
        <>
            <Grid
                item
                xs={10}
                md={3}
                id={`${contributorRowId}-name-as-published`}
                data-testid={`${contributorRowId}-name-as-published`}
            >
                {getListItemTypography(
                    contributor.nameAsPublished,
                    contributorOrder,
                    { ...classes.primary, ...selectedClass },
                    selectedClass,
                )}
            </Grid>
            {isAuthorLinked(contributor) && haveFullAuthorDetails(contributor) && (
                <Grid
                    item
                    xs={10}
                    md={showRoleInput ? 4 : idColWidth}
                    id={`${contributorRowId}-uq-details`}
                    data-testid={`${contributorRowId}-uq-details`}
                >
                    {getListItemTypography(
                        `${contributor.aut_title} ${contributor.aut_display_name}`,
                        `${
                            (contributor.affiliation === AFFILIATION_TYPE_NOT_UQ && contributor.orgaff) ||
                            locale.global.orgTitle
                        } (${
                            contributor.aut_org_username || contributor.aut_student_username || contributor.aut_ref_num
                        } - ${contributor.aut_id})`,
                        primaryTypographyClass,
                        secondaryTypographyClass,
                    )}
                </Grid>
            )}
            {!isAuthorLinked(contributor) && !!contributor.affiliation && (
                <Grid
                    item
                    xs={12}
                    md={idColWidth}
                    id={`${contributorRowId}-affiliation`}
                    data-testid={`${contributorRowId}-affiliation`}
                >
                    {getListItemTypography(
                        `${contributor.orgaff}`,
                        `${
                            (!!contributor.orgtype &&
                                !!ORG_TYPES_LOOKUP[contributor.orgtype] &&
                                `Organisation type: ${ORG_TYPES_LOOKUP[contributor.orgtype]}`) ||
                            ''
                        }`,
                        primaryTypographyClass,
                        secondaryTypographyClass,
                    )}
                </Grid>
            )}
            {showRoleInput && (
                <Grid item xs={12} md={md} id={`${contributorRowId}-role`} data-testid={`${contributorRowId}-role`}>
                    {getListItemTypography(
                        contributor.creatorRole,
                        '',
                        primaryTypographyClass,
                        secondaryTypographyClass,
                    )}
                </Grid>
            )}
        </>
    );
};

ContributorRowText.propTypes = {
    canEdit: PropTypes.bool,
    contributor: PropTypes.object,
    contributorRowId: PropTypes.string.isRequired,
    classes: PropTypes.object,
    index: PropTypes.number,
    suffix: PropTypes.string,
    selectedClass: PropTypes.object,
    showRoleInput: PropTypes.bool,
    width: PropTypes.string,
};
