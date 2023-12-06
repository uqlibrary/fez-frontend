import React, { useRef } from 'react';

import { Section } from '../common/Section';
import { useJournalContext } from 'context';
import { adminInterfaceConfig } from 'config/journalAdmin';

export const DoajSection = () => {
    const { jnlDisplayType } = useJournalContext();
    const cards = useRef(adminInterfaceConfig[jnlDisplayType].doaj());

    return <Section cards={cards.current} />;
};

export default React.memo(DoajSection);
