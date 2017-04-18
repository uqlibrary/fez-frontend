import React from 'react';
import {Card, CardText} from 'material-ui/Card';
import {PublicationTypeForm} from '../Forms/PublicationType';

export default function AddRecord() {
    return (
        <div className="layout-fill">
            <h1 className="page-title display-1">Add a journal article</h1>
            <Card className="layout-card">
                <CardText className="body-1">
                    <br />
                    <div>
                        <p>
                            <PublicationTypeForm />
                        </p>
                    </div>
                </CardText>
            </Card>
        </div>
    );
}
