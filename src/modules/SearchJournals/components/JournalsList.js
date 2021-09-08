import React from 'react';
import Grid from '@material-ui/core/Grid';
import JournalsListHeaderCol1 from './partials/JournalsListHeaderCol1';
import JournalsListHeaderCol2 from './partials/JournalsListHeaderCol2';
import JournalsListHeaderCol3 from './partials/JournalsListHeaderCol3';
import JournalsListDataCol1 from './partials/JournalsListDataCol1';
import JournalsListDataCol2 from './partials/JournalsListDataCol2';
import JournalsListDataCol3 from './partials/JournalsListDataCol3';
import { JournalFieldsMap } from './partials/JournalFieldsMap';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

const JournalsList = journals => {
    React.useEffect(() => {
        if (!Cookies.get('minimalView')) {
            Cookies.set('minimalView', false);
        }
    }, []);
    const [minimalView, setMinimalView] = React.useState(Cookies.get('minimalView') === 'true');
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
    console.log(colWidth);
    return (
        <Grid container spacing={0} id="journal-list" alignItems="stretch">
            <Grid item style={{ width: JournalFieldsMap[0].size }}>
                {/* Header */}
                <JournalsListHeaderCol1 />
                {/* Data */}
                {journals &&
                    journals.journals &&
                    journals.journals.length > 0 &&
                    journals.journals.map((item, index) => {
                        return <JournalsListDataCol1 key={index} index={index} journal={item} />;
                    })}
            </Grid>
            <Grid item xs style={{ overflowX: 'scroll', overflowY: 'hidden', marginLeft: 4 }}>
                <div style={{ width: minimalView ? '100%' : colWidth }}>
                    <Grid
                        container
                        spacing={0}
                        alignItems="flex-end"
                        style={{ borderBottom: '1px solid #CCC', height: 32, width: '100%' }}
                    >
                        {/* Header */}
                        {JournalFieldsMap.slice(1).map((item, index) => {
                            if ((!!minimalView && !!item.compactView) || !minimalView) {
                                return (
                                    <JournalsListHeaderCol2 journal={item} key={index} minimalView={!!minimalView} />
                                );
                            }
                            return null;
                        })}
                    </Grid>
                    {/* Data */}
                    <Grid container spacing={0} alignItems="center">
                        <Grid item xs={12} style={{ marginTop: 6 }}>
                            {journals &&
                                journals.journals &&
                                journals.journals.length > 0 &&
                                journals.journals.map((item, index) => {
                                    return (
                                        <JournalsListDataCol2
                                            minimalView={!!minimalView}
                                            key={index}
                                            index={index}
                                            journal={item}
                                        />
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
                    journals.journals &&
                    journals.journals.length > 0 &&
                    journals.journals.map((item, index) => {
                        return <JournalsListDataCol3 key={index} index={index} journal={item} />;
                    })}
            </Grid>
        </Grid>
    );
};

JournalsList.propTypes = {
    journals: PropTypes.array.isRequired,
};

export default React.memo(JournalsList);
