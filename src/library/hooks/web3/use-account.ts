"use client";

import { useQuery } from "@apollo/client";
import { GET_ACCOUNT_BY_ID } from "@/library/apollo/queries/pre-deposits";
import { Address } from "viem";
import { useCallback } from "react";

export interface AccountBalance {
  token: {
    id: string;
    symbol: string;
    name: string;
  };
  amount: string;
}

export interface ReferralUser {
  id: string;
  timestamp?: string;
}

export interface ReferralCode {
  id: string;
  timesUsed: number;
  usedBy: ReferralUser[];
  creator?: {
    id: string;
  };
}

export interface Account {
  id: string;
  balances: AccountBalance[];
  code: ReferralCode | null;
  usedCode: ReferralCode | null;
  totalDeposited?: string;
  lastActivityTimestamp?: string;
}

export interface UseAccountResult {
  account: Account | null;
  loading: boolean;
  error: any;
  refetch: () => Promise<any>;
}

/**
 * Hook to fetch account information by address
 * @param address - Ethereum address of the account
 * @returns Account information, loading state, error and refetch function
 */
export function useAccountPredepositData(
  address?: Address | string
): UseAccountResult {
  const { data, loading, error, refetch } = useQuery(GET_ACCOUNT_BY_ID, {
    variables: { id: address?.toLowerCase() },
    skip: !address,
    fetchPolicy: "cache-and-network",
  });

  const refetchAccount = useCallback(async () => {
    if (address) {
      return await refetch({ id: address.toLowerCase() });
    }
    return null;
  }, [address, refetch]);

  return {
    account: data?.account || null,
    loading,
    error,
    refetch: refetchAccount,
  };
}

export default useAccountPredepositData;
