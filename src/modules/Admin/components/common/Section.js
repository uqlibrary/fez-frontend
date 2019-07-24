import React from 'react';
import PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import { StandardCard } from 'modules/SharedComponents/Toolbox/StandardCard';
import { FieldGridItem } from './FieldGridItem';
import { useTabbedContext } from 'context';

export const Section = ({ disabled, cards }) => {
    const { tabbed } = useTabbedContext();
    return (
        <Grid container spacing={8}>
            {cards.current.map((card) => (
                <Grid item xs={12} key={card.title}>
                    <StandardCard title={`${card.title}`} accentHeader={!tabbed}>
                        <Grid container spacing={8}>
                            {card.groups.reduce(
                                (fields, group) => [
                                    ...fields,
                                    group.map((field) => (
                                        <FieldGridItem key={field} field={field} disabled={disabled} group={group} />
                                    )),
                                ],
                                []
                            )}
                        </Grid>
                    </StandardCard>
                </Grid>
            ))}
        </Grid>
    );
};

Section.propTypes = {
    cards: PropTypes.array,
    disabled: PropTypes.bool,
};
