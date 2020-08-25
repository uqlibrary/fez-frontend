import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';
import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';
import { PUBLICATION_TYPE_BOOK, SUBTYPE_EDITED_BOOK, NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK } from 'config/general';

export const AuthorsSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const cards = useRef(
        adminInterfaceConfig[record.rek_display_type].authors({
            isDesignNtro: record.rek_subtype === NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
            onlyEditors:
                record.rek_display_type === PUBLICATION_TYPE_BOOK && record.rek_subtype === SUBTYPE_EDITED_BOOK,
        }),
    );

    return <Section cards={cards.current} disabled={disabled} />;
};

AuthorsSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(AuthorsSection);
