/* eslint-disable no-unused-vars */
import React from 'react';
import { styled } from '@mui/material/styles';

import Grid from '@mui/material/Grid';
import JournalsListHeaderCol1 from './partials/JournalsListHeaderCol1';
import JournalsListHeaderCol2Full from './partials/JournalsListHeaderCol2Full';
import JournalsListDataCol1 from './partials/JournalsListDataCol1';
import JournalsListDataCol2Full from './partials/JournalsListDataCol2Full';
import JournalFieldsMap from './partials/JournalFieldsMap';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

const StyledGridWrapper = styled(Grid)(({ theme }) => ({
    display: 'grid',
    gridTemplateColumns: '75% auto 50px',
    flexWrap: 'nowrap',
    overflowX: 'scroll',
    [theme.breakpoints.up('md')]: {
        gridTemplateColumns: '50% auto 50px',
    },
}));

const StyledGridMoreColumnsWidth = styled(Grid, {
    shouldForwardProp: prop => prop !== 'minimalView',
})(({}) => ({
    marginLeft: 4,

    width: '100%',
    overflow: 'unset',

    flexGrow: 1,
}));

const StyledGridHeaderRow = styled(Grid)(({ theme }) => ({
    borderBottom: '1px solid #CCC',
    width: '100%',
    overflowY: 'hidden',
}));

const JournalsListLegacy = ({
    journals,
    onSelectionChange,
    onToggleSelectAll,
    selected = {},
    isSelectable,
    isAllSelected,
}) => {
    let colWidth = 0;
    for (let i = 0; i < JournalFieldsMap.length - 1; i++) {
        colWidth += JournalFieldsMap[i + 1].size;
    }

    return (
        <StyledGridWrapper
            container
            spacing={0}
            padding={0}
            id="journal-list"
            data-testid="journal-list"
            alignItems="stretch"
        >
            <Grid>
                {/* Header */}
                <JournalsListHeaderCol1
                    isSelectable={isSelectable}
                    checked={isAllSelected}
                    onChange={onToggleSelectAll}
                />
                {/* Data */}
                {journals &&
                    journals.length > 0 &&
                    journals.map((item, index) => {
                        return (
                            <JournalsListDataCol1
                                key={index}
                                index={index}
                                journal={item}
                                onChange={onSelectionChange}
                                checked={selected[item.jnl_jid]}
                                isSelectable={isSelectable}
                            />
                        );
                    })}
            </Grid>
            <StyledGridMoreColumnsWidth xs>
                <div style={{ width: colWidth, paddingBottom: 4 }}>
                    <StyledGridHeaderRow container spacing={0} padding={0} alignItems="flex-end">
                        {/* Header */}
                        {JournalFieldsMap.slice(1).map((item, index) => {
                            return <JournalsListHeaderCol2Full journal={item} index={index} key={index} />;
                        })}
                    </StyledGridHeaderRow>
                    {/* Data */}
                    <Grid container spacing={0} padding={0} alignItems="center">
                        <Grid style={{ marginTop: 6 }} size={12}>
                            {journals &&
                                journals.length > 0 &&
                                journals.map((item, index) => {
                                    return <JournalsListDataCol2Full key={index} index={index} journal={item} />;
                                })}
                        </Grid>
                    </Grid>
                </div>
            </StyledGridMoreColumnsWidth>
        </StyledGridWrapper>
    );
};

JournalsListLegacy.propTypes = {
    journals: PropTypes.array.isRequired,
    onSelectionChange: PropTypes.func,
    onToggleSelectAll: PropTypes.func,
    selected: PropTypes.object,
    isSelectable: PropTypes.bool,
    isAllSelected: PropTypes.bool,
};

export default React.memo(JournalsListLegacy);
