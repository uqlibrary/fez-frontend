import { useAccountContext } from 'context';

export const useIsUserSuperAdmin = () => {
    const { account } = useAccountContext();
    return !!account.is_super_administrator;
};
