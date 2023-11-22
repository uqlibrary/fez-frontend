/* istanbul ignore file */
import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@mui/material/Grid';
import { AdminCard } from 'modules/JournalAdmin/components/AdminCard';
import { FieldGridItem } from './FieldGridItem';

export const GroupsWithoutCard = React.memo(({ groups, disabled }) =>
    groups.reduce(
        (fields, group) => [
            ...fields,
            group.map(field => <FieldGridItem key={field} field={field} disabled={disabled} group={group} />),
        ],
        [],
    ),
);

GroupsWithoutCard.propTypes = {
    groups: PropTypes.array,
    disabled: PropTypes.bool,
};

export const GroupsWithinCard = React.memo(({ title, groups, disabled }) => (
    <Grid item xs={12} key={title}>
        <AdminCard title={`${title}`} accentHeader>
            <Grid container spacing={1}>
                <GroupsWithoutCard groups={groups} disabled={disabled} />
            </Grid>
        </AdminCard>
    </Grid>
));

GroupsWithinCard.propTypes = {
    title: PropTypes.string,
    groups: PropTypes.array,
    disabled: PropTypes.bool,
};

export const Section = ({ disabled, cards }) => (
    <Grid container spacing={1}>
        {cards.map((card, index) =>
            !!card.title ? (
                <GroupsWithinCard key={card.title} title={card.title} groups={card.groups} disabled={disabled} />
            ) : (
                <GroupsWithoutCard key={index} groups={card.groups} disabled={disabled} />
            ),
        )}
    </Grid>
);

Section.propTypes = {
    cards: PropTypes.array,
    disabled: PropTypes.bool,
};

export default Section;
