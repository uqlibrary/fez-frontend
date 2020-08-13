import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';
import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';
import { NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK } from 'config/general';

export const AuthorsSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const cards = useRef(
        adminInterfaceConfig[record.rek_display_type].authors(
            record.rek_subtype === NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
        ),
    );

    console.log(cards);
    return <Section cards={cards.current} disabled={disabled} />;
};

AuthorsSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(AuthorsSection);
