import React from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';

import { useRecordContext, useFormValuesContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';
import {
    NTRO_SUBTYPE_LP_MUSIC,
    NTRO_SUBTYPE_LP_DANCE,
    NTRO_SUBTYPE_LP_PLAYS_DRAMAS_THEATRE,
    NTRO_SUBTYPE_LP_INTERARTS,
    NTRO_SUBTYPE_LP_OTHER,
    NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT,
    NTRO_SUBTYPE_CPEE_FESTIVAL,
    NTRO_SUBTYPE_CPEE_WEB_BASED_EXHIBITION,
    NTRO_SUBTYPE_CPEE_OTHER,
} from 'config/general';

export const BibliographicSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const { formValues } = useFormValuesContext();
    const isLote =
        formValues.languages &&
        (formValues.languages.length > 1 || (formValues.languages.length === 1 && formValues.languages[0] !== 'eng'));

    /*
     *  Disbale below line in favour of #171299373
     */
    // const displayType =
    //     record.rek_display_type === PUBLICATION_TYPE_CREATIVE_WORK &&
    //     !!record.rek_subtype &&
    //     record.rek_subtype === NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK
    //         ? PUBLICATION_TYPE_DESIGN
    //         : record.rek_display_type;

    const displayEndDate = [
        NTRO_SUBTYPE_LP_MUSIC,
        NTRO_SUBTYPE_LP_DANCE,
        NTRO_SUBTYPE_LP_PLAYS_DRAMAS_THEATRE,
        NTRO_SUBTYPE_LP_INTERARTS,
        NTRO_SUBTYPE_LP_OTHER,
        NTRO_SUBTYPE_CPEE_EXHIBITION_EVENT,
        NTRO_SUBTYPE_CPEE_FESTIVAL,
        NTRO_SUBTYPE_CPEE_WEB_BASED_EXHIBITION,
        NTRO_SUBTYPE_CPEE_OTHER,
    ].includes(record.rek_subtype);
    const cards = adminInterfaceConfig[record.rek_display_type].bibliographic(isLote, displayEndDate);

    return <Section cards={cards} disabled={disabled} />;
};

BibliographicSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(BibliographicSection);
