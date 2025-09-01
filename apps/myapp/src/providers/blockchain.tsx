"use client";

import { Chains } from "porto";
import { porto } from "porto/wagmi";
import type { PropsWithChildren } from "react";
import { createConfig, http, WagmiProvider } from "wagmi";

import { portoConfig } from "@/configs/web3";

const wagmiConfig = createConfig({
	chains: [Chains.baseSepolia],
	connectors: [porto(portoConfig)],
	ssr: true,
	transports: {
		[Chains.baseSepolia.id]: http(),
	},
});

const BlockchainProvider = ({ children }: PropsWithChildren) => (
	<WagmiProvider config={wagmiConfig}>{children}</WagmiProvider>
);

export { BlockchainProvider };
