import React from 'react';
import {Card, CardText} from 'material-ui/Card';

export default function Research() {
    return (
        <div className="layout-fill">
            <h1 className="page-title display-1">My research</h1>
            <Card className="layout-card">
                <CardText className="body-1">
                    <br />
                    <div>
                        <p>
                            Placeholder for my research area
                        </p>
                    </div>
                </CardText>
            </Card>
        </div>
    );
}
