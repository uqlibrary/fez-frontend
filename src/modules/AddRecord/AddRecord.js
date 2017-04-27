import React from 'react';
import {Card, CardText, CardHeader} from 'material-ui/Card';
import {HelpIcon} from 'uqlibrary-react-toolbox';

export default function AddRecord() {
    return (

    <div className="layout-fill">

        <h1 className="page-title display-1">Add a journal article</h1>

        <Card className="layout-card">
            <CardHeader className="card-header">
                <div className="columns is-gapless">
                    <div className="column">
                        <h2 className="headline">Enter a DOI</h2>
                    </div>
                    <div className="column">
                            <HelpIcon
                                title="Add a record"
                                text="Some text"
                                buttonLabel="Got it!"
                            />
                    </div>
                </div>
            </CardHeader>

            <CardText className="body-1">
                <br />
                <div>
                    Placeholder for a form
                </div>
            </CardText>

        </Card>
    </div>
    );
}
