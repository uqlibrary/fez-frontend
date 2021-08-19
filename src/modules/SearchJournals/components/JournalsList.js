import React from 'react';
import Grid from '@material-ui/core/Grid';
import JournalsListHeaderCol1 from './partials/JournalsListHeaderCol1';
import JournalsListHeaderCol2 from './partials/JournalsListHeaderCol2';
import JournalsListHeaderCol3 from './partials/JournalsListHeaderCol3';
import JournalsListDataCol1 from './partials/JournalsListDataCol1';
import { JournalFieldsMap } from './partials/JournalFieldsMap';

const JournalsList = journals => {
    let colWidth = 0;
    for (let i = 0; i < JournalFieldsMap.length - 1; i++) {
        colWidth += JournalFieldsMap[i + 1].size;
    }
    return (
        <Grid container spacing={0} id="journal-list-header" alignItems="flex-start">
            <Grid item xs={3}>
                <JournalsListHeaderCol1 />
                {journals &&
                    journals.journals &&
                    journals.journals.length > 0 &&
                    journals.journals.map((item, index) => {
                        return <JournalsListDataCol1 key={index} journal={item} />;
                    })}
            </Grid>
            <Grid item xs style={{ overflowX: 'scroll', overflowY: 'hidden' }}>
                <div style={{ width: colWidth }}>
                    <Grid container spacing={1} id="journal-list-header-2" alignItems="center">
                        {JournalFieldsMap.slice(1).map((item, index) => {
                            return <JournalsListHeaderCol2 journal={item} key={index} />;
                        })}
                    </Grid>
                </div>
            </Grid>
            <Grid item xs={2}>
                <JournalsListHeaderCol3 />
            </Grid>
        </Grid>
    );
};

export default React.memo(JournalsList);
