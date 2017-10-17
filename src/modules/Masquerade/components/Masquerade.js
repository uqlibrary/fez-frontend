import React, {Component} from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import {StandardPage, StandardCard} from 'uqlibrary-react-toolbox';
import {locale} from 'config';

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

        this.setState = {
            loading: true
        };

        const url = `https://auth.library.uq.edu.au/masquerade?user=${this.state.userName}&return=${window.btoa(window.location.href)}`;
        window.location.href = url;
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
                        onKeyPress={this._masqueradeAs} />
                </StandardCard>
                <div className="columns action-buttons">
                    <div className="column is-hidden-mobile"/>
                    <div className="column is-narrow-desktop">
                        <RaisedButton
                            fullWidth
                            secondary
                            label={txt.labels.submit}
                            disabled={this.state.loading}
                            onTouchTap={this._masqueradeAs}/>
                    </div>
                </div>
            </StandardPage>
        );
    }
}
