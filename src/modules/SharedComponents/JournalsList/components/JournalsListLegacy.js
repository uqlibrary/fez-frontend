import React from 'react';
import { styled } from '@mui/material/styles';

import Grid from '@mui/material/Unstable_Grid2';
import JournalsListHeaderCol1 from './partials/JournalsListHeaderCol1';
import JournalsListHeaderCol2Full from './partials/JournalsListHeaderCol2Full';
import JournalsListHeaderCol2Min from './partials/JournalsListHeaderCol2Min';
import JournalsListDataCol1 from './partials/JournalsListDataCol1';
import JournalsListDataCol2Full from './partials/JournalsListDataCol2Full';
import JournalsListDataCol2Min from './partials/JournalsListDataCol2Min';
import { JournalFieldsMap } from './partials/JournalFieldsMap';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import JournalsListDataCol3 from './partials/JournalsListDataCol3';
import JournalsListHeaderCol3 from './partials/JournalsListHeaderCol3';

const StyledGridWrapper = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.down('md')]: {
        display: 'grid',
        gridTemplateColumns: '80% auto 50px',
        flexWrap: 'nowrap',
        overflowX: 'scroll',
    },
    [theme.breakpoints.down('sm')]: {
        gridTemplateColumns: 'auto auto 50px',
    },
}));

const StyledGridTitleColumn = styled(Grid)(({ theme }) => ({
    width: JournalFieldsMap[0].size.xs,
    [theme.breakpoints.up('sm')]: {
        width: JournalFieldsMap[0].size.sm,
    },
    [theme.breakpoints.up('md')]: {
        width: JournalFieldsMap[0].size.md,
    },
    [theme.breakpoints.up('lg')]: {
        width: JournalFieldsMap[0].size.lg,
    },
    [theme.breakpoints.up('xl')]: {
        width: JournalFieldsMap[0].size.xl,
    },
}));

const StyledGridMoreColumnsWidth = styled(Grid, {
    shouldForwardProp: prop => prop !== 'minimalView',
})(({ theme, minimalView }) => ({
    marginLeft: 4,
    [theme.breakpoints.down('md')]: {
        width: '100%',
        overflow: 'unset',
    },
    [theme.breakpoints.up('md')]: {
        overflow: minimalView ? 'unset' : 'auto hidden',
    },
    flexGrow: minimalView ? 'inherit' : 1,
    minWidth: 'auto',
}));

const StyledGridHeaderRow = styled(Grid)(({ theme }) => ({
    borderBottom: '1px solid #CCC',
    width: '100%',
    overflowY: 'hidden',
    height: 40,
    [theme.breakpoints.up('md')]: {
        height: 32,
    },
}));

const JournalsListLegacy = ({
    journals,
    onSelectionChange,
    onToggleSelectAll,
    selected = {},
    isSelectable,
    isAllSelected,
}) => {
    React.useEffect(() => {
        if (!Cookies.get('minimalView')) {
            Cookies.set('minimalView', true);
        }
    }, []);

    const [minimalView, setMinimalView] = React.useState(Cookies.get('minimalView') !== 'false');
    const toggleView = () => {
        Cookies.set('minimalView', !minimalView);
        setMinimalView(!minimalView);
    };
    let colWidth = 0;
    if (!minimalView) {
        for (let i = 0; i < JournalFieldsMap.length - 1; i++) {
            colWidth += JournalFieldsMap[i + 1].size;
        }
    } else {
        for (let i = 0; i < JournalFieldsMap.filter(item => item.compactView).length - 1; i++) {
            colWidth += JournalFieldsMap.filter(item => item.compactView)[i + 1].size;
        }
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
            <StyledGridTitleColumn item>
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
            </StyledGridTitleColumn>
            <StyledGridMoreColumnsWidth item xs minimalView={minimalView}>
                <div style={{ width: colWidth, paddingBottom: !minimalView ? 4 : 0 }}>
                    <StyledGridHeaderRow container spacing={0} padding={0} alignItems="flex-end">
                        {/* Header */}
                        {!minimalView
                            ? JournalFieldsMap.slice(1).map((item, index) => {
                                  return <JournalsListHeaderCol2Full journal={item} index={index} key={index} />;
                              })
                            : JournalFieldsMap.slice(1)
                                  .filter(item => !!item.compactView)
                                  .map((item, index) => {
                                      return <JournalsListHeaderCol2Min journal={item} index={index} key={index} />;
                                  })}
                    </StyledGridHeaderRow>
                    {/* Data */}
                    <Grid container spacing={0} padding={0} alignItems="center">
                        <Grid item xs={12} style={{ marginTop: 6 }}>
                            {journals &&
                                journals.length > 0 &&
                                journals.map((item, index) => {
                                    return !minimalView ? (
                                        <JournalsListDataCol2Full key={index} index={index} journal={item} />
                                    ) : (
                                        <JournalsListDataCol2Min key={index} index={index} journal={item} />
                                    );
                                })}
                        </Grid>
                    </Grid>
                </div>
            </StyledGridMoreColumnsWidth>
            <Grid item xs={'auto'}>
                {/* Header */}
                <JournalsListHeaderCol3 toggleView={toggleView} minimalView={!!minimalView} />
                {/* Data */}
                {journals &&
                    journals.length > 0 &&
                    journals.map((item, index) => {
                        return <JournalsListDataCol3 key={index} journal={item} minimalView={minimalView} />;
                    })}
            </Grid>
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
