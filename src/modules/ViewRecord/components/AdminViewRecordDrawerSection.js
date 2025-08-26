import React from 'react';
import { styled } from '@mui/material/styles';

import Divider from '@mui/material/Divider';
import AdminRecordDrawerBlock from './AdminViewRecordDrawerBlock';
import PropTypes from 'prop-types';

const StyledSectionContent = styled('div')(({ theme }) => ({
    padding: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
        padding: theme.spacing(3),
    },
}));

export const AdminRecordDrawerSection = ({ section, index, copyToClipboard, variant }) => {
    if (typeof section === 'object' && section.type === 'divider') {
        return <Divider key={`divider-${index}`} />;
    }
    if (!Array.isArray(section)) return <></>;

    return (
        <StyledSectionContent key={`section-${index}`}>
            {section.map((block, blockIndex) => (
                <AdminRecordDrawerBlock
                    block={block}
                    parentIndex={index}
                    index={blockIndex}
                    copyToClipboard={copyToClipboard}
                    key={`drawer-block-${blockIndex}`}
                    variant={variant}
                />
            ))}
        </StyledSectionContent>
    );
};

AdminRecordDrawerSection.propTypes = {
    section: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
    index: PropTypes.number.isRequired,
    copyToClipboard: PropTypes.func,
    variant: PropTypes.oneOf(['Desktop', 'Mobile']),
};

export default React.memo(AdminRecordDrawerSection);
