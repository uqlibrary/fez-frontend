import React from 'react';
import Grid from '@material-ui/core/Grid';
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

const JournalsList = ({
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
            colWidth += JournalFieldsMap.filter(item => item.compactView)[i + 1].compactSize;
        }
    }
    return (
        <Grid container spacing={0} id="journal-list" alignItems="stretch">
            <Grid item style={{ width: JournalFieldsMap[0].size }}>
                {/* Header */}
                <JournalsListHeaderCol1
                    isSelectable={isSelectable}
                    isAllSelected={isAllSelected}
                    onToggleSelectAll={onToggleSelectAll}
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
            <Grid item xs style={{ overflowX: 'auto', overflowY: 'hidden', marginLeft: 4 }}>
                <div style={{ width: !minimalView ? colWidth : '100%', paddingBottom: !minimalView ? 4 : 0 }}>
                    <Grid
                        container
                        spacing={0}
                        alignItems="flex-end"
                        style={{ borderBottom: '1px solid #CCC', height: 32, width: '100%', overflowY: 'hidden' }}
                    >
                        {/* Header */}
                        {!minimalView
                            ? JournalFieldsMap.slice(1).map((item, index) => {
                                  return <JournalsListHeaderCol2Full journal={item} key={index} />;
                              })
                            : JournalFieldsMap.slice(1)
                                  .filter(item => !!item.compactView)
                                  .map((item, index) => {
                                      return <JournalsListHeaderCol2Min journal={item} key={index} />;
                                  })}
                    </Grid>
                    {/* Data */}
                    <Grid container spacing={0} alignItems="center">
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
            </Grid>
            <Grid item xs={'auto'}>
                {/* Header */}
                <JournalsListHeaderCol3 toggleView={toggleView} minimalView={!!minimalView} />
                {/* Data */}
                {journals &&
                    journals.length > 0 &&
                    journals.map((item, index) => {
                        return <JournalsListDataCol3 key={index} journal={item} />;
                    })}
            </Grid>
        </Grid>
    );
};

JournalsList.propTypes = {
    journals: PropTypes.array.isRequired,
    onSelectionChange: PropTypes.func,
    onToggleSelectAll: PropTypes.func,
    selected: PropTypes.object,
    isSelectable: PropTypes.bool,
    isAllSelected: PropTypes.bool,
};

export default React.memo(JournalsList);
