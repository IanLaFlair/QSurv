import fs from 'fs';
import path from 'path';

const LEDGER_PATH = path.join(process.cwd(), 'ledger.json');

interface LedgerData {
    surveys: Record<string, {
        balance: number;
        isActive: boolean;
        transactions: Transaction[];
    }>;
}

interface Transaction {
    hash: string;
    type: 'FUND' | 'PAYOUT';
    amount: number;
    timestamp: string;
    to?: string;
    from?: string;
}

function getLedger(): LedgerData {
    if (!fs.existsSync(LEDGER_PATH)) {
        return { surveys: {} };
    }
    try {
        const data = fs.readFileSync(LEDGER_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return { surveys: {} };
    }
}

function saveLedger(data: LedgerData) {
    fs.writeFileSync(LEDGER_PATH, JSON.stringify(data, null, 2));
}

function generateTxHash(): string {
    return Array.from({ length: 60 }, () =>
        '0123456789abcdef'[Math.floor(Math.random() * 16)]
    ).join('');
}

export const qubicSimulation = {
    // Simulate locking funds into the smart contract
    lockFunds: async (surveyId: string, amount: number, creatorAddress: string) => {
        const ledger = getLedger();

        if (!ledger.surveys[surveyId]) {
            ledger.surveys[surveyId] = {
                balance: 0,
                isActive: true,
                transactions: []
            };
        }

        const txHash = generateTxHash();
        const tx: Transaction = {
            hash: txHash,
            type: 'FUND',
            amount,
            timestamp: new Date().toISOString(),
            from: creatorAddress,
            to: 'QSURV_CONTRACT_ADDRESS'
        };

        ledger.surveys[surveyId].balance += amount;
        ledger.surveys[surveyId].transactions.push(tx);

        saveLedger(ledger);
        return txHash;
    },

    // Simulate a payout from the smart contract
    payout: async (surveyId: string, amount: number, respondentAddress: string) => {
        const ledger = getLedger();
        const survey = ledger.surveys[surveyId];

        if (!survey) {
            throw new Error("Survey not found in ledger");
        }

        if (!survey.isActive) {
            throw new Error("Survey is not active");
        }

        if (survey.balance < amount) {
            throw new Error("Insufficient contract balance");
        }

        const txHash = generateTxHash();
        const tx: Transaction = {
            hash: txHash,
            type: 'PAYOUT',
            amount,
            timestamp: new Date().toISOString(),
            from: 'QSURV_CONTRACT_ADDRESS',
            to: respondentAddress
        };

        survey.balance -= amount;
        survey.transactions.push(tx);

        saveLedger(ledger);
        return txHash;
    },

    // Get the current state of a survey contract
    getContractState: async (surveyId: string) => {
        const ledger = getLedger();
        return ledger.surveys[surveyId] || { balance: 0, isActive: false, transactions: [] };
    }
};
