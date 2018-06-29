import React, {PureComponent} from 'react';
import ShareThis from 'modules/SharedComponents/ShareThis/components/ShareThis';

export default class ShareThisErrorBoundary extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch() {
        this.setState({ hasError: true });
        // dont do any error reporting - we cant act on reports that a 3rd party app has failed
    }

    render() {
        if (this.state.hasError) return (<div className="shareThis empty" />);

        return (
            <ShareThis />
        );
    }
}
