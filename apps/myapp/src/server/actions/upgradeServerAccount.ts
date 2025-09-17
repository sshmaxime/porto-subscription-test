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

	// TODO: remove once https://github.com/ithacaxyz/relay/pull/1387 merged.
	await RelayActions.sendCalls(client, {
		account: mockServerAccount,
		chain: baseSepolia,
		calls: [],
	});

	console.log("upgradeServerAccount");
};

export { upgradeServerAccount };
