// WalletConnect configuration for Qubic
export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'a5fe9a648499ad1340176532e41e21b9';

export const qubicChainConfig = {
    chainId: 'qubic:mainnet', // Official Qubic chain ID
    name: 'Qubic Mainnet',
    rpc: ['https://rpc.qubic.org'], // Official Qubic RPC
};

export const walletConnectMetadata = {
    name: 'QSurv',
    description: 'Decentralized Survey Platform on Qubic',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://qsurv.app',
    icons: [typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : 'https://qsurv.app/logo.png'],
};

// Required namespaces for Qubic WalletConnect
export const requiredNamespaces = {
    qubic: {
        chains: ['qubic:mainnet'],
        methods: [
            'qubic_requestAccounts',
            'qubic_sendQubic',
            'qubic_signTransaction',
            'qubic_sendTransaction',
            'qubic_sign',
            'qubic_sendAsset',
        ],
        events: [
            'accountsChanged',
            'amountChanged',
            'assetAmountChanged',
        ],
    },
};

// Deep link schema for Qubic Wallet
export const QUBIC_WALLET_DEEP_LINK = 'qubic-wallet://open';
