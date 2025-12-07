"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';

type WalletType = 'metamask' | 'walletconnect' | null;

interface WalletContextType {
  connect: (type: 'metamask' | 'walletconnect') => Promise<void>;
  disconnect: () => void;
  address: string | null;
  isConnected: boolean;
  balance: number;
  isConnecting: boolean;
  walletType: WalletType;
  wcUri: string | null; // WalletConnect URI for QR code
}

const WalletContext = createContext<WalletContextType>({
  connect: async () => {},
  disconnect: () => {},
  address: null,
  isConnected: false,
  balance: 0,
  isConnecting: false,
  walletType: null,
  wcUri: null,
});

export const useWallet = () => useContext(WalletContext);

const SNAP_ID = 'npm:@qubic-lib/qubic-mm-snap';

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);
  const [isConnecting, setIsConnecting] = useState(false);
  const [walletType, setWalletType] = useState<WalletType>(null);
  const [wcUri, setWcUri] = useState<string | null>(null);

  useEffect(() => {
    // Check if already connected
    const savedAddress = localStorage.getItem('qsurv_wallet_address');
    const savedWalletType = localStorage.getItem('qsurv_wallet_type') as WalletType;
    
    if (savedAddress && savedWalletType) {
      setAddress(savedAddress);
      setIsConnected(true);
      setWalletType(savedWalletType);
      setBalance(0); // Balance fetching would require another API call
      
      // TODO: Restore WalletConnect session if type is 'walletconnect'
      if (savedWalletType === 'walletconnect') {
        // Check for existing WC session and restore
        restoreWalletConnectSession();
      }
    }

    // Listen for MetaMask account changes
    if ((window as any).ethereum) {
      (window as any).ethereum.on('accountsChanged', () => {
        if (walletType === 'metamask') {
          disconnect();
        }
      });
    }

    return () => {
      if ((window as any).ethereum) {
        (window as any).ethereum.removeListener('accountsChanged', disconnect);
      }
    };
  }, []);

  const connectMetaMask = async () => {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      throw new Error("MetaMask is not installed!");
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
      setWalletType('metamask');
      localStorage.setItem('qsurv_wallet_address', publicId as string);
      localStorage.setItem('qsurv_wallet_type', 'metamask');
      setBalance(0); 
    }
  };

  const connectWalletConnect = async () => {
    try {
      // Dynamically import WalletConnect client (client-side only)
      const { createWalletConnectSession, waitForSessionApproval } = await import('@/lib/walletconnect-client');
      
      // Create session and get URI for QR code
      const { uri, approval } = await createWalletConnectSession();
      
      if (!uri) {
        throw new Error('Failed to generate WalletConnect URI');
      }
      
      // Set URI for QR modal to display
      setWcUri(uri);
      
      // Wait for user to scan QR and approve in mobile wallet
      const { session, address } = await waitForSessionApproval(approval);
      
      // Connection approved!
      setAddress(address);
      setIsConnected(true);
      setWalletType('walletconnect');
      setWcUri(null);
      localStorage.setItem('qsurv_wallet_address', address);
      localStorage.setItem('qsurv_wallet_type', 'walletconnect');
      setBalance(0);
      
      console.log('WalletConnect session established:', session);
      
    } catch (error) {
      console.error("WalletConnect connection failed", error);
      setWcUri(null);
      throw error;
    }
  };

  const restoreWalletConnectSession = async () => {
    try {
      const { restoreSession } = await import('@/lib/walletconnect-client');
      const restored = await restoreSession();
      
      if (restored) {
        setAddress(restored.address);
        setIsConnected(true);
        setWalletType('walletconnect');
        setBalance(0);
        console.log('WalletConnect session restored:', restored.session);
      }
    } catch (error) {
      console.error('Failed to restore WalletConnect session:', error);
    }
  };

  const connect = async (type: 'metamask' | 'walletconnect') => {
    setIsConnecting(true);
    try {
      if (type === 'metamask') {
        await connectMetaMask();
      } else if (type === 'walletconnect') {
        await connectWalletConnect();
      }
    } catch (error) {
      console.error("Wallet connection failed", error);
      alert(`Failed to connect ${type === 'metamask' ? 'MetaMask Snap' : 'WalletConnect'}. Check console for details.`);
      setWcUri(null);
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnect = async () => {
    // Disconnect WalletConnect session if active
    if (walletType === 'walletconnect') {
      try {
        const { disconnectWalletConnect } = await import('@/lib/walletconnect-client');
        await disconnectWalletConnect();
      } catch (error) {
        console.error('Failed to disconnect WalletConnect:', error);
      }
    }
    
    setAddress(null);
    setIsConnected(false);
    setBalance(0);
    setWalletType(null);
    setWcUri(null);
    localStorage.removeItem('qsurv_wallet_address');
    localStorage.removeItem('qsurv_wallet_type');
  };

  return (
    <WalletContext.Provider value={{ connect, disconnect, address, isConnected, balance, isConnecting, walletType, wcUri }}>
      {children}
    </WalletContext.Provider>
  );
}
