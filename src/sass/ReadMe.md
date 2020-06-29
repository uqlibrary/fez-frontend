# SASS Styling for fez-frontend

## Table of Contents

- [Material Design](#material-design)
- [Grid](#grid)
- [Typography](#typography)

## Material Design

Fez-frontend is based on Material Design, and while we are using Material UI for React as a component library, not all components are included, or adhere to Google's philosophy or specifications. As Material design is considered a "guide" more than strict rules, we have liberty to add functionality as we see, but it must :

- Adhere as closely as possible to Materual Design specifications
- Be usable, and have a UX approach
- Be accessible, and be designed and built for WCAG2.0 AA
- Be minimal, and not make a simple process more drawn out

## Grid

We are now using [MUIv1 Grid](https://material-ui.com/layout/grid/) component for our responsive layout.

### General tips

We use 16 unit spacing for forms

```jsx
<Grid container spacing={2}>
  <Grid item xs={12}>
    Form component here
  </Grid>
  <Grid item xs={6}>
    Form component here
  </Grid>
  <Grid item xs={6}>
    Form component here
  </Grid>
</Grid>
```

This would produce a 2 row grid with a full width top row and 2 colum 2nd row split evenly in half.

To push items right

```jsx
<Grid container spacing={2}>
  <Grid item xs />
  <Grid item xs={'auto'}>
    This will display to the right and be as wide as the contents
  </Grid>
</Grid>
```

To center items,

```jsx
<Grid container spacing={2}>
  <Grid item xs />
  <Grid item xs={'auto'}>
    This will in the center of the row and be only as wide as the contents
  </Grid>
  <Grid item xs />
</Grid>
```

For any other combinations, visit the [Grid API documentation](https://material-ui.com/api/grid/).

## Typography

We now use the Material UI v1 general theme typography styles. Below are some specifications/examples.

### Site title

```jsx
<Typography variant={'h5'} component={h1}>
  Title
</Typography>
```

### Page title

```jsx
<Typography variant={'h4'} component={h2}>
  Page ttle
</Typography>
```

### Card title

```jsx
<Typography variant={'h5'} component={h3}>
  Card ttle
</Typography>
```

### Publication titles

```jsx
<Typography variant={'h5'} component={'h5'}>
  Title of publication
</Typography>
```

### Body text

```jsx
<Typography variant={'body1'}>This is some body text</Typography>
```

### Citations

```jsx
<Typography variant={'caption'}>This is citation body text</Typography>
```
