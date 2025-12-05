"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { QubicConnect } from '@qubic-connect/core';

interface WalletContextType {
  connect: () => Promise<void>;
  disconnect: () => void;
  address: string | null;
  isConnected: boolean;
  balance: number;
}

const WalletContext = createContext<WalletContextType>({
  connect: async () => {},
  disconnect: () => {},
  address: null,
  isConnected: false,
  balance: 0,
});

export const useWallet = () => useContext(WalletContext);

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  const [qubicConnect, setQubicConnect] = useState<QubicConnect | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    // Initialize QubicConnect
    const qc = new QubicConnect({
      name: 'QSurv',
      key: 'qubic-hackathon-key', // Placeholder key for dev
      secret: 'qubic-hackathon-secret',
    });
    setQubicConnect(qc);

    // Check if already connected (mock check for now as library behavior might vary)
    const savedAddress = localStorage.getItem('qsurv_wallet_address');
    if (savedAddress) {
      setAddress(savedAddress);
      setIsConnected(true);
      setBalance(1250000); // Mock balance for now
    }
  }, []);

  const connect = async () => {
    if (!qubicConnect) return;

    try {
      // In a real app, this would trigger the Qubic Connect modal
      // For this hackathon MVP step, we'll simulate a successful connection
      // or use the library's connect method if it works out of the box without real credentials
      
      // Simulating connection for the "Real MVP" transition phase
      // In next steps we will try to make this actual library call work
      
      // const user = await qubicConnect.loginWithRedirect(); 
      // For now, let's mock the "Get Address" part as requested by the user
      // to ensure the UI updates immediately while we debug the library specifics
      
      const mockAddress = "BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"; 
      setAddress(mockAddress);
      setIsConnected(true);
      setBalance(1250000);
      localStorage.setItem('qsurv_wallet_address', mockAddress);
      
    } catch (error) {
      console.error("Wallet connection failed", error);
      alert("Failed to connect wallet");
    }
  };

  const disconnect = () => {
    setAddress(null);
    setIsConnected(false);
    setBalance(0);
    localStorage.removeItem('qsurv_wallet_address');
  };

  return (
    <WalletContext.Provider value={{ connect, disconnect, address, isConnected, balance }}>
      {children}
    </WalletContext.Provider>
  );
}
