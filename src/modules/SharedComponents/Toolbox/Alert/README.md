# Alert

Prorotype component to display alerts/warnings/errors

## Props

- `message: PropTypes.string`
- `title: PropTypes.string`
- `type PropTypes.string - valid values ['error', 'error_outline', 'warning', 'info', 'info_outline', 'help', 'help_outline', 'success', 'done', 'custom']`
- `showLoader PropTypes.bool` - prop is to render a spinner instead of icon
- `allowDismiss PropTypes.bool` - prop is to render a dismiss button
- `dismissAction PropTypes.func` - prop is function to call when dismiss button pressed
- `dismissTitle PropTypes.string` - prop is title for dismiss button for accessibility
- `announce PropTypes.oneOf(['auto', 'assertive', 'off'])` - controls how screen readers announce the alert (default `'auto'`), see [Accessibility](#accessibility)

## Accessibility

The title and message are wrapped in a live region (the buttons are not, so their labels are not read out with the alert). The `announce` prop controls the region's `role`:

| `announce` | Role | Use for |
| --- | --- | --- |
| `'auto'` (default) | `alert` for `error`, `error_outline`, `warning` and `success`/`done` types, otherwise `status` | Errors, warnings and success results that appear in response to an action or a change of state |
| `'assertive'` | `alert` | Info results shown right after a user action that must be reliably announced (any type is forced to `alert`) |
| `'off'` | none | Static content present when the page loads (e.g. informational notices, dashboard lures), which is read in normal reading order |

Notes:

- The role is chosen from the effective type: `customType` when `customIcon` is provided, otherwise `type`.
- Live regions are most reliable when the element is already in the page and its content changes. An alert that is mounted with its content already inside it is announced reliably only with `role="alert"`; `role="status"` is often not announced by NVDA in that case. `success`/`done` alerts are therefore `alert` by default; use `announce="assertive"` for post-action `info` alerts that are conditionally rendered.
- Use `announce="off"` where several alerts can be shown on page load, so they don't queue up and flood screen reader users.
- Relevant WCAG criterion: 4.1.3 Status Messages (Level AA).

## Usage

```jsx
import React from 'react';
...

import { Alert } from 'modules/SharedComponents/Toolbox/Alert';

const App = () => (
  <div>

    <Alert
        title="This is a title"
        message="Some body text."
        type="error_outline"
        outsidelayout
        showLoader
    />
  </div>
);

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
```
