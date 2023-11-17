import React, { useRef } from 'react';
import PropTypes from 'prop-types';

import { Section } from '../common/Section';
import { adminInterfaceConfig } from 'config/journalAdmin';
import { useJournalContext } from 'context';

export const AdminSection = ({ disabled = false }) => {
    const { jnlDisplayType } = useJournalContext();
    console.log(jnlDisplayType, adminInterfaceConfig[jnlDisplayType]);
    const cards = useRef(adminInterfaceConfig[jnlDisplayType].admin());

    return <Section cards={cards.current} disabled={disabled} />;
};

AdminSection.propTypes = {
    disabled: PropTypes.bool,
};

export default React.memo(AdminSection);
