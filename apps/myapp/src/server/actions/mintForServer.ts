"use server";

import { Value } from "ox";
import { RelayActions } from "porto";
import { encodeFunctionData } from "viem";
import { baseSepolia } from "viem/chains";
import { expAbi, expContract, mockServerAccount, mockServerKey } from "@/configs/constants";
import { client } from "@/server/configs/web3";

const mintForServer = async () => {
	const dataMint = encodeFunctionData({
		abi: expAbi,
		functionName: "mint",
		args: [mockServerAccount.address, Value.fromEther("1")],
	});

	await RelayActions.sendCalls(client, {
		account: mockServerAccount,
		chain: baseSepolia,
		calls: [{ to: expContract.address, data: dataMint }],
		key: mockServerKey,
	});

	console.log("mintForServer");
};

export { mintForServer };
