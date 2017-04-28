AuthButton
---
#####Button commonly used in the header to link to the login/logout URL.

###Use:
```jsx
    import AuthButton from 'modules/AuthButton';
    ...

    <AuthButton isAuthorizedUser={isAuthorizedUser} name={account.get('name')} />
```
No user settable props are available, as it queries the current account loaded state, and passes the account details from the account props.