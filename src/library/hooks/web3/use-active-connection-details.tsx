/* eslint-disable @typescript-eslint/no-explicit-any */
import { Address } from "viem";
import { useAccount } from "wagmi";

import { useMemo } from "react";
import isSupportedChain from "@/library/utils/is-supported-chain";
import { FALLBACK_CHAIN_ID } from "@/library/constants/default-chain-info";
import SupportedChainIds from "@/library/types/supported-chain-ids.enum";

interface IActiveConnectionDetails {
  chainId?: number;
  validChainId: number;
  chain?: any;
  address?: Address;
  isConnected: boolean;
  isConnecting: boolean;
}

export default function useActiveConnectionDetails(): IActiveConnectionDetails {
  /**
   * This hook is used to get the current connection details for the application
   * Used to display the current connection details, unifying account abstraction with defi
   * This hook should be the only one used in the application to interact with web3
   */

  const {
    chainId,
    address: wagmiAddress,
    isConnected: wagmiIsConnected,
    isConnecting: wagmiIsConnecting,
  } = useAccount();

  const validChainId = useMemo(() => {
    return isSupportedChain(chainId) && chainId ? chainId : FALLBACK_CHAIN_ID;
  }, [chainId]);

  return {
    chainId,
    validChainId: validChainId as SupportedChainIds,
    isConnected: wagmiIsConnected,
    isConnecting: wagmiIsConnecting,
    address: wagmiAddress,
  };
}
