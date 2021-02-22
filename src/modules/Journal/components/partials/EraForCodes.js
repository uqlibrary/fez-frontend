import React from 'react';
import PropTypes from 'prop-types';

const EraForCodes = ({ forCodes }) => {
    return forCodes.map((era, index) => (
        <div key={`journal-era-category${index}`} data-testid={`journal-era-category${index}`}>
            {`${era.jnl_era_source_year}: ${(Array.isArray(era.fez_journal_era_for_code) &&
                era.fez_journal_era_for_code.map(forCode => forCode.jnl_era_for_code_lookup).join(', ')) ||
                ''}`}
        </div>
    ));
};

EraForCodes.propTypes = {
    forCodes: PropTypes.arrayOf(PropTypes.object),
};

export default EraForCodes;
