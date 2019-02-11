# Using react context and Material UI SelectField

The standard SelectField in MUI 0.XX is not mobile device friendly. To get around this issue, we apply some props to the SelectField dependant on its device size.
React context is used to store some global flags/variables:

```javascript
  static childContextTypes = {
    isMobile: PropTypes.bool,
    selectFieldMobileOverrides: PropTypes.object
  };
```

NOTE: This context is not getting updated on resize events, since it's only relevant to mobile devices.

- `isMobile` - flag indicating if current screen size fits mobile
- `selectFieldMobileOverrides` - object with props with styles for SelectField (to reduce code duplication)

To use context in the client component:

1. Define context in the component:

```javascript
  static contextTypes = {
    selectFieldMobileOverrides: PropTypes.object
  };
```

1. Apply props to component:

```javascript
  <Field
    component={SelectField}
    name="someValue"
    {...this.context.selectFieldMobileOverrides}
    floatingLabelText="Select value">
    {menuItems}
  </Field>

  <SelectField
    name="someOtherValue"
    {...this.context.selectFieldMobileOverrides}
    floatingLabelText="Select value">
    {menuItems}
  </SelectField>
```
