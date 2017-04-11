import React from 'react';
import {Card, CardText} from 'material-ui/Card';

export default function Browse() {
    return (
        <div className="layout-fill">
            <h1 className="page-title display-1">Browse eSpace</h1>
            <Card className="layout-card">
                <CardText className="body-1">
                    <br />
                    <div>
                        <p>
                            Placeholder for Browse espace page...
                        </p>
                        <p>
                            <a href="https://auth.library.uq.edu.au/login">Temporary login link...</a>
                        </p>
                    </div>
                </CardText>
            </Card>
        </div>
    );
}
