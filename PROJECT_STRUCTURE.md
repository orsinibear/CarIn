# CarIn Project Structure

This project uses **Hardhat** for smart contract development and **Next.js** for the frontend application.

## Project Structure

```
CarIn/
├── frontend/                 # Next.js frontend application
│   ├── app/                 # Next.js App Router directory
│   ├── components/          # React components
│   ├── lib/                 # Utility functions and hooks
│   ├── package.json         # Frontend dependencies
│   ├── next.config.js       # Next.js configuration
│   ├── tailwind.config.ts   # Tailwind CSS configuration
│   └── tsconfig.json        # TypeScript configuration
│
├── smartcontracts/          # Hardhat smart contract project
│   ├── contracts/           # Solidity smart contracts
│   │   ├── ParkingSpot.sol
│   │   └── PaymentEscrow.sol
│   ├── scripts/             # Deployment and utility scripts
│   │   ├── deploy.js
│   │   └── verify.js
│   ├── test/                # Contract tests
│   ├── hardhat.config.js    # Hardhat configuration
│   └── package.json         # Smart contract dependencies
│
├── .gitignore
├── README.md
└── PROJECT_STRUCTURE.md     # This file
```

## Technology Stack

### Smart Contracts
- **Framework**: Hardhat
- **Language**: Solidity ^0.8.20
- **Network**: Celo (Alfajores testnet & Mainnet)
- **Libraries**: OpenZeppelin Contracts

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Wallet**: Reown AppKit (WalletConnect)
- **Blockchain Integration**: Wagmi + Viem

## Setup Instructions

### Smart Contracts (Hardhat)
```bash
cd smartcontracts
npm install
npx hardhat compile
npx hardhat test
npx hardhat run scripts/deploy.js --network alfajores
```

### Frontend (Next.js)
```bash
cd frontend
npm install
npm run dev
```

## Development Workflow

1. Smart contracts are developed and tested using Hardhat
2. Contracts are deployed to Celo testnet/mainnet
3. Contract ABIs and addresses are used in the Next.js frontend
4. Frontend connects to deployed contracts via Reown AppKit/Wagmi

