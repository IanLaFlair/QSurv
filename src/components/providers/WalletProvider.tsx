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
    // WalletConnect integration
    // For now, this is a simplified implementation
    // Full implementation would use @walletconnect/web3wallet
    
    try {
      // Generate WalletConnect URI
      // This would normally come from WalletConnect client initialization
      const mockUri = `wc:demo-uri@2?relay-protocol=irn&symKey=mock-key`;
      setWcUri(mockUri);
      
      // In a real implementation:
      // 1. Initialize WalletConnect client
      // 2. Create pairing/session
      // 3. Wait for mobile wallet approval
      // 4. Get address from approved session
      
      // For demo purposes, we'll simulate a connection after 3 seconds
      setTimeout(() => {
        const mockAddress = 'QUBIC' + Math.random().toString(36).substring(2, 15).toUpperCase();
        setAddress(mockAddress);
        setIsConnected(true);
        setWalletType('walletconnect');
        setWcUri(null);
        localStorage.setItem('qsurv_wallet_address', mockAddress);
        localStorage.setItem('qsurv_wallet_type', 'walletconnect');
        setBalance(0);
      }, 3000);
      
    } catch (error) {
      console.error("WalletConnect connection failed", error);
      setWcUri(null);
      throw error;
    }
  };

  const restoreWalletConnectSession = async () => {
    // Check localStorage for existing WalletConnect session
    // Restore if valid
    // This would use WalletConnect SDK's session restoration
    console.log('Attempting to restore WalletConnect session...');
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

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setBalance(0);
    setWalletType(null);
    setWcUri(null);
    localStorage.removeItem('qsurv_wallet_address');
    localStorage.removeItem('qsurv_wallet_type');
    
    // TODO: Disconnect WalletConnect session if active
  };

  return (
    <WalletContext.Provider value={{ connect, disconnect, address, isConnected, balance, isConnecting, walletType, wcUri }}>
      {children}
    </WalletContext.Provider>
  );
}
