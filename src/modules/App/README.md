### Using react context and Material UI SelectField

The standard SelectField in MUI v0.19.1 is not mobile device friendly for dropdown items which may render longer than the screen is wide. To get around this issue, we apply some props to the SelectField dependant on its device size.

We use Reacts context to pass down the component tree if the device we're using to view the site is essentially a small mobile phone.

Do do this, in components/App.js we initialize react context with:

    getChildContext() {
            return {isMobile: this.state.isMobile};
    }

And pass a bool through using a mediaQuery in the state:

    isMobile: window.matchMedia('(max-width: 768px)').matches
    
This is used in the render() to pass values into the context.

In the component, you read in the context using:

    static contextTypes = {
            isMobile: React.PropTypes.bool
    };
    
And now this.context.isMobile is available to test against.

NOTE: This state does not update. It is set the first time it is run, and there is no listener to check if it has resized.

With the SelectField, in order to make it render correctly on mobile we add to the props:

    <Field
        component={SelectField}
        disabled={this.props.submitting}
        name="rek_display_type"
        style={!this.context.isMobile ? {width: '100%'} : {}}
        autoWidth={!this.context.isMobile}
        fullWidth={this.context.isMobile}
        menuItemStyle={this.context.isMobile ? {whiteSpace: 'normal', lineHeight: '18px'} : {}}
        floatingLabelText={txt.publicationType.inputLabelText}
        floatingLabelFixed
        className="requiredField"
        hintText={txt.publicationType.inputLabelText}>
        {publicationTypeItems}
    </Field>
    
The same applies when using the SelectField directly (ie not in a Field wrapper).