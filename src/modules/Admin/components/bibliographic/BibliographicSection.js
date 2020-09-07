import React from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';

import { useRecordContext } from 'context';
import { adminInterfaceConfig } from 'config/admin';
import { bibliographicParams } from 'modules/Admin/helpers';

export const BibliographicSection = ({ disabled = false }) => {
    const { record } = useRecordContext();

    /*
     *  Disbale below line in favour of #171299373
     */
    // const displayType =
    //     record.rek_display_type === PUBLICATION_TYPE_CREATIVE_WORK &&
    //     !!record.rek_subtype &&
    //     record.rek_subtype === NTRO_SUBTYPE_CW_DESIGN_ARCHITECTURAL_WORK
    //         ? PUBLICATION_TYPE_DESIGN
    //         : record.rek_display_type;

    const cards = adminInterfaceConfig[record.rek_display_type].bibliographic(bibliographicParams(record));

    return <Section cards={cards} disabled={disabled} />;
};

BibliographicSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(BibliographicSection);
