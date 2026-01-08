import React, { useRef } from 'react';

import { Section } from '../common/Section';
import { useJournalContext } from 'context';
import { adminInterfaceConfig } from 'config/journalAdmin';
import PropTypes from 'prop-types';

export const ReadAndPublishSection = ({ disabled = false }) => {
    const { jnlDisplayType } = useJournalContext();
    const cards = useRef(adminInterfaceConfig[jnlDisplayType].readAndPublish());

    return <Section cards={cards.current} disabled={disabled} />;
};

ReadAndPublishSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(ReadAndPublishSection);
