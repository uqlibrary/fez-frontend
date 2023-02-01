These are dump components that wraps svg code from specific icons imported from https://fonts.google.com/icons

The reason for using them is to minimize build size.
Using the following has shown significant build size impact:
- @mui/icons-material
- mdi-material-ui

These should be replaced by the first once MUI is upgraded to v5.
