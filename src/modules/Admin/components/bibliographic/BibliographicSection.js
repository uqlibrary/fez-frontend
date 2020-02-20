import React from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';

import { useRecordContext, useFormValuesContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';
import {
    PUBLICATION_TYPE_CREATIVE_WORK,
    PUBLICATION_TYPE_DESIGN,
    NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK,
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
    const cards = adminInterfaceConfig[record.rek_display_type].bibliographic(isLote);

    return <Section cards={cards} disabled={disabled} />;
};

BibliographicSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(BibliographicSection);
