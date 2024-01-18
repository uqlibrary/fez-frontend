import React, { useRef } from 'react';

import { Section } from '../common/Section';
import { useJournalContext } from 'context';
import { adminInterfaceConfig } from 'config/journalAdmin';

export const UqDataSection = () => {
    const { jnlDisplayType } = useJournalContext();
    const cards = useRef(adminInterfaceConfig[jnlDisplayType].uqData());

    return <Section cards={cards.current} />;
};

export default React.memo(UqDataSection);
