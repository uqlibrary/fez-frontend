import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';
import { adminInterfaceConfig } from 'config/journalAdmin';
import { useJournalContext } from 'context';
import { PUBLICATION_TYPE_DATA_COLLECTION } from 'config/general';

export const FilesSection = ({ disabled = false }) => {
    const { jnlDisplayType } = useJournalContext();
    const cards = useRef(
        adminInterfaceConfig[jnlDisplayType]?.files({
            isDataset: jnlDisplayType === PUBLICATION_TYPE_DATA_COLLECTION,
        }),
    );
    return <Section cards={cards.current} disabled={disabled} />;
};

FilesSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(FilesSection);
