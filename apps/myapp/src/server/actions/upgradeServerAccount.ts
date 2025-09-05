"use server";

import { RelayActions } from "porto";
import { baseSepolia } from "viem/chains";
import { mockServerAccount } from "@/configs/constants";
import { client } from "@/server/configs/web3";

const upgradeServerAccount = async () => {
	await RelayActions.upgradeAccount(client, {
		account: mockServerAccount,
		chain: baseSepolia,
	});

	console.log("upgradeServerAccount");
};

export { upgradeServerAccount };
