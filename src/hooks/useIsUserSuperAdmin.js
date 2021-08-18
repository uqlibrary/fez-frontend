import { useAccountContext } from 'context';

export const useIsUserSuperAdmin = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { account } = useAccountContext();
    return !!account.is_super_administrator;
};
