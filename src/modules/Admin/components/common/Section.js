import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { FieldGridItem } from './FieldGridItem';
import { useTabbedContext } from 'context';

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

export const GroupsWithinCard = React.memo(({ title, groups, disabled }) => {
    const { tabbed } = useTabbedContext();
    return (
        <Grid item xs={12} key={title}>
            <StandardCard title={`${title}`} accentHeader={!tabbed}>
                <Grid container spacing={8}>
                    <GroupsWithoutCard groups={groups} disabled={disabled} />
                </Grid>
            </StandardCard>
        </Grid>
    );
});

GroupsWithinCard.propTypes = {
    title: PropTypes.string,
    groups: PropTypes.array,
    disabled: PropTypes.bool,
};

export const Section = ({ disabled, cards }) => {
    return (
        <Grid container spacing={8}>
            {cards.current.map((card, index) =>
                !!card.title ? (
                    <GroupsWithinCard key={card.title} title={card.title} groups={card.groups} disabled={disabled} />
                ) : (
                    <GroupsWithoutCard key={index} groups={card.groups} disabled={disabled} />
                ),
            )}
        </Grid>
    );
};

Section.propTypes = {
    cards: PropTypes.object,
    disabled: PropTypes.bool,
};
