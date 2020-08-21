import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';
import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';
import {
    PUBLICATION_TYPE_BOOK,
    PUBLICATION_TYPE_CREATIVE_WORK,
    PUBLICATION_TYPE_DESIGN,
    NTRO_SUBTYPE_DESIGN_CW_ARCHITECTURAL_WORK,
    SUBTYPE_EDITED_BOOK,
} from 'config/general';

export const AuthorsSection = ({ disabled = false }) => {
    const { record } = useRecordContext();
    const displayType =
        record.rek_display_type === PUBLICATION_TYPE_CREATIVE_WORK &&
        !!record.rek_subtype &&
        record.rek_subtype === NTRO_SUBTYPE_DESIGN_CW_ARCHITECTURAL_WORK
            ? PUBLICATION_TYPE_DESIGN
            : record.rek_display_type;

    const onlyEditors = record.rek_display_type === PUBLICATION_TYPE_BOOK && record.rek_subtype === SUBTYPE_EDITED_BOOK;

    const cards = useRef(adminInterfaceConfig[displayType].authors(onlyEditors));

    return <Section cards={cards.current} disabled={disabled} />;
};

AuthorsSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(AuthorsSection);
