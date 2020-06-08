import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';
import { useRecordContext } from 'context';
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
    NTRO_SUBTYPE_RRW_MUSIC_DANCE_THEATRE,
    NTRO_SUBTYPE_RRW_AUDIO_VISUAL_RECORDING,
    NTRO_SUBTYPE_RRW_DIGITAL_CREATIVE_WORKS,
    NTRO_SUBTYPE_RRW_INTERARTS,
    NTRO_SUBTYPE_RRW_WEBSITE_EXHIBITION,
    NTRO_SUBTYPE_RRW_OTHER,
} from 'config/general';

export const NtroSection = ({ disabled = false }) => {
    const { record } = useRecordContext();

    const displayAudienceSize = !![
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

    const displayIsrc = !![
        NTRO_SUBTYPE_RRW_MUSIC_DANCE_THEATRE,
        NTRO_SUBTYPE_RRW_AUDIO_VISUAL_RECORDING,
        NTRO_SUBTYPE_RRW_DIGITAL_CREATIVE_WORKS,
        NTRO_SUBTYPE_RRW_INTERARTS,
        NTRO_SUBTYPE_RRW_WEBSITE_EXHIBITION,
        NTRO_SUBTYPE_RRW_OTHER,
    ].includes(record.rek_subtype);

    const cards = useRef(adminInterfaceConfig[record.rek_display_type].ntro(displayAudienceSize, displayIsrc));

    return <Section cards={cards.current} disabled={disabled} />;
};

NtroSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(NtroSection);
