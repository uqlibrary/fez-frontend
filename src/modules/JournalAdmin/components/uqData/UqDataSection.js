import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';
import { useJournalContext } from 'context';
import { adminInterfaceConfig } from 'config/journalAdmin';

export const UqDataSection = ({ disabled = false }) => {
    const { jnlDisplayType } = useJournalContext();
    const cards = useRef(adminInterfaceConfig[jnlDisplayType].uqData());

    return <Section cards={cards.current} disabled={disabled} />;
};

UqDataSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(UqDataSection);
