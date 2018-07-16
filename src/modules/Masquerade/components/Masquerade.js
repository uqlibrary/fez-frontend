import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {StandardCard} from 'modules/SharedComponents/Toolbox/StandardCard';
import {StandardPage} from 'modules/SharedComponents/Toolbox/StandardPage';
import locale from 'locale/pages';

export default class Masquerade extends Component {
    static propTypes = {
    };

    constructor(props) {
        super(props);
        this.state = {
            userName: '',
            loading: false
        };
    }

    _masqueradeAs = (event) => {
        if(event && event.key && (event.key !== 'Enter' || this.state.userName.length === 0)) return;

        this.setState({
            loading: true
        });

        window.location.href = `https://auth.library.uq.edu.au/masquerade?user=${this.state.userName}&return=${window.btoa(window.location.href)}`;
    };

    _usernameChanged = (event, newValue) => {
        this.setState({
            userName: newValue
        });
    };

    render() {
        const txt = locale.pages.masquerade;

        return (
            <StandardPage title={txt.title}>
                <StandardCard title={txt.title} help={txt.help}>
                    <div>{txt.description}</div>
                    <TextField
                        fullWidth
                        id="userName"
                        floatingLabelText={txt.labels.hint}
                        hintText={txt.labels.hint}
                        value={this.state.userName}
                        onChange={this._usernameChanged}
                        onKeyPress={this._masqueradeAs}
                        className="mui-long-labels-fix"
                    />
                </StandardCard>
                <div className="columns action-buttons">
                    <div className="column is-hidden-mobile"/>
                    <div className="column is-narrow-desktop">
                        <RaisedButton
                            fullWidth
                            secondary
                            label={txt.labels.submit}
                            disabled={this.state.loading}
                            onClick={this._masqueradeAs}/>
                    </div>
                </div>
            </StandardPage>
        );
    }
}
