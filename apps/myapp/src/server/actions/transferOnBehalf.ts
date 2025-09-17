"use server";

import { Value } from "ox";
import { Chains, RelayActions } from "porto";
import { type Address, encodeFunctionData } from "viem";
import { expAbi, expContract, mockServerAccount, mockServerKey } from "@/configs/constants";
import { client } from "@/server/configs/web3";

const transferOnBehalf = async (from: Address, to: Address) => {
	console.log(mockServerKey.hash);
	const dataTransfer = encodeFunctionData({
		abi: expAbi,
		functionName: "transfer",
		args: [to, Value.fromEther("1")],
	});

	await RelayActions.sendCalls(client, {
		account: mockServerAccount.address,
		chain: Chains.baseSepolia,
		calls: [{ to: expContract.address, data: dataTransfer }],
		key: mockServerKey,
	});

	console.log("transferOnBehalf");
};

export { transferOnBehalf };
