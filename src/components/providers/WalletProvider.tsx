"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

interface WalletContextType {
  connect: () => Promise<void>;
  disconnect: () => void;
  address: string | null;
  isConnected: boolean;
  balance: number;
  isConnecting: boolean;
}

const WalletContext = createContext<WalletContextType>({
  connect: async () => {},
  disconnect: () => {},
  address: null,
  isConnected: false,
  balance: 0,
  isConnecting: false,
});

export const useWallet = () => useContext(WalletContext);

const SNAP_ID = 'npm:@qubic-lib/qubic-mm-snap';

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    // Check if already connected
    const savedAddress = localStorage.getItem('qsurv_wallet_address');
    if (savedAddress) {
      setAddress(savedAddress);
      setIsConnected(true);
      setBalance(0); // Balance fetching would require another API call
    }

    // Listen for MetaMask account changes
    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', () => {
        // When user switches accounts in MetaMask, disconnect to force re-login
        // This ensures they get the correct Qubic address if the Snap supports it,
        // or at least clears the confusing state.
        disconnect();
      });
    }

    return () => {
      if ((window as any).ethereum) {
        (window as any).ethereum.removeListener('accountsChanged', disconnect);
      }
    };
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    try {
      const ethereum = (window as any).ethereum;
      if (!ethereum) {
        alert("MetaMask is not installed!");
        return;
      }

      // 1. Request Snap Installation
      await ethereum.request({
        method: 'wallet_requestSnaps',
        params: {
          [SNAP_ID]: {},
        },
      });

      // 2. Get Public ID (Address) from Snap
      const publicId = await ethereum.request({
        method: 'wallet_invokeSnap',
        params: {
          snapId: SNAP_ID,
          request: {
            method: 'getPublicId',
            params: {
              confirm: true // Ask for user confirmation
            }
          },
        },
      });

      if (publicId) {
        setAddress(publicId as string);
        setIsConnected(true);
        localStorage.setItem('qsurv_wallet_address', publicId as string);
        
        // Mock balance for now as Snap doesn't seem to expose getBalance directly in the code I saw
        // We would need a separate API to fetch balance using the publicId
        setBalance(0); 
      }

    } catch (error) {
      console.error("Wallet connection failed", error);
      alert("Failed to connect Qubic Snap. Check console for details.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setBalance(0);
    localStorage.removeItem('qsurv_wallet_address');
  };

  return (
    <WalletContext.Provider value={{ connect, disconnect, address, isConnected, balance, isConnecting }}>
      {children}
    </WalletContext.Provider>
  );
}
