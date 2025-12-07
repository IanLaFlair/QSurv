// WalletConnect configuration for Qubic
export const WALLETCONNECT_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'demo-project-id';

export const qubicChainConfig = {
    chainId: 'qubic:testnet', // Change to 'qubic:mainnet' for production
    name: 'Qubic Testnet',
    rpc: ['http://localhost:31841'], // Local testnet RPC
};

export const walletConnectMetadata = {
    name: 'QSurv',
    description: 'Decentralized Survey Platform on Qubic',
    url: typeof window !== 'undefined' ? window.location.origin : 'https://qsurv.app',
    icons: [typeof window !== 'undefined' ? `${window.location.origin}/logo.png` : 'https://qsurv.app/logo.png'],
};

export const sessionNamespaces = {
    qubic: {
        methods: [
            'qubic_signTransaction',
            'qubic_sendTransaction',
            'qubic_getBalance',
            'qubic_getAddress',
        ],
        chains: [qubicChainConfig.chainId],
        events: ['accountsChanged', 'chainChanged'],
    },
};
