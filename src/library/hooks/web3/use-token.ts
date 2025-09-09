'use client';

import { useCallback, useEffect, useState } from 'react';
import { Address } from 'viem';
import SupportedChainIds from '@/library/types/supported-chain-ids.enum';
import { useAccount } from 'wagmi';
import { Token } from '@cryptoalgebra/integral-sdk';
import TokensRpc from '@/library/request/tokens.rpc';

interface UseTokenOptions {
  includeBalance?: boolean;
  includeAllowance?: boolean;
  spender?: Address;
}

interface UseTokenResult {
  token: Token | null;
  loading: boolean;
  error: Error | null;
  balance: bigint | null;
  shifftedBalance: number;
  allowance: bigint | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch token information, balance, and allowance
 * @param address - The token address
 * @param chainId - The chain ID where the token exists
 * @param options - Additional options
 * @returns Token information, loading state, error, balance, allowance, and refetch function
 */
export function useToken(
  address: Address | undefined,
  chainId: SupportedChainIds | undefined,
  options: UseTokenOptions = {}
): UseTokenResult {
  const { includeBalance = false, includeAllowance = false, spender } = options;
  const { address: account } = useAccount();

  const [token, setToken] = useState<Token | null>(null);
  const [balance, setBalance] = useState<bigint>(0n);
  const [shifftedBalance, setShifftedBalance] = useState<number>(0);
  const [allowance, setAllowance] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchToken = useCallback(async () => {
    if (!address || !chainId) return;

    setLoading(true);
    setError(null);

    try {
      // Fetch token data
      const tokenData = await TokensRpc.getToken(chainId, address);
      setToken(tokenData);

      // Fetch balance if requested and account is connected
      if (includeBalance && account) {
        const balanceData = await TokensRpc.getTokenBalance(
          chainId,
          account,
          address
        );
        setBalance(balanceData);
      }

      // Fetch allowance if requested, account is connected, and spender is provided
      if (includeAllowance && account && spender) {
        const allowanceData = await TokensRpc.getTokenAllowance(
          chainId,
          account,
          spender,
          address
        );
        setAllowance(allowanceData);
      }
    } catch (err) {
      console.error('Error fetching token data:', err);
      setError(
        err instanceof Error ? err : new Error('Failed to fetch token data')
      );
    } finally {
      setLoading(false);
    }
  }, [address, chainId, account, includeBalance, includeAllowance, spender]);

  // Fetch data on mount and when dependencies change
  useEffect(() => {
    fetchToken();
  }, [fetchToken]);

  useEffect(() => {
    if (!token?.decimals) return;
    setShifftedBalance(Number(balance) / 10 ** token.decimals);
  }, [balance, token?.decimals]);

  // Refetch function to manually trigger a refresh
  const refetch = useCallback(async () => {
    await fetchToken();
  }, [fetchToken]);

  return {
    token,
    loading,
    error,
    balance,
    shifftedBalance,
    allowance,
    refetch,
  };
}

export default useToken;
