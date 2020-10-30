import { useAccountContext } from 'context';

export const userIsAdmin = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { account } = useAccountContext();
    return !!account.is_administrator;
};
