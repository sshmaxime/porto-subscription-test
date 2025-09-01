"use server";

import { Value } from "ox";
import { Chains, RelayActions } from "porto";
import { type Address, encodeFunctionData } from "viem";
import { expAbi, expContract, mockServerKey } from "@/configs/constants";
import { client } from "@/server/configs/web3";

const mintOnBehalf = async (address: Address) => {
	const dataMint = encodeFunctionData({
		abi: expAbi,
		functionName: "mint",
		args: [address, Value.fromEther("1")],
	});

	await RelayActions.sendCalls(client, {
		account: address,
		chain: Chains.baseSepolia,
		calls: [{ to: expContract.address, data: dataMint }],
		key: mockServerKey,
	});

	console.log("Executed on behalf");
};

export { mintOnBehalf };
