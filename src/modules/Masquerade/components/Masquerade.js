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
            userName: ''
        };
    }

    _masqueradeAs = (event) => {
        if(event && event.key && (event.key !== 'Enter' || this.state.userName.length === 0)) return;
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
                <form onKeyDown={this._handleKeyboardFormSubmit}>
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
                                onTouchTap={this._masqueradeAs}/>
                        </div>
                    </div>
                </form>
            </StandardPage>
        );
    }
}
