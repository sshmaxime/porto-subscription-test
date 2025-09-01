"use client";

import { Value } from "ox";
import type { wallet_grantPermissions } from "porto/RpcSchema";
import { useReadContract } from "wagmi";
import { expContract, mockReceiver, mockServerAccount, mockServerKey } from "@/configs/constants";
import { usePorto, usePortoActions } from "@/hooks/porto";
import { useWeb3 } from "@/providers/web3";
import { mintOnBehalf } from "@/server/actions/mintOnBehalf";

const newPermissions: wallet_grantPermissions.Parameters = {
	expiry: Math.floor(Date.now() / 1_000) + 60 * 60, // 1 hour
	feeLimit: {
		currency: "USD",
		value: "1",
	},
	key: mockServerKey,
	permissions: {
		calls: [
			{
				signature: "mint()",
				to: expContract.address,
			},
		],
		spend: [
			{
				period: "minute",
				limit: Value.fromEther("1000"),
				token: expContract.address,
			},
		],
	},
} as const;

const Page = () => {
	const { connect, disconnect, eoa, isConnected, isConnecting, isDisconnected } = useWeb3();

	const { addFunds, grantPermissions } = usePortoActions();
	const { permissions } = usePorto();

	const { data: balanceSender } = useReadContract({
		address: expContract.address,
		abi: expContract.abi,
		functionName: "balanceOf",
		args: [eoa.address!],
	});

	const { data: balanceReceiver } = useReadContract({
		address: expContract.address,
		abi: expContract.abi,
		functionName: "balanceOf",
		args: [mockReceiver!],
	});

	return (
		<div>
			<button type="button" onClick={connect}>
				Connect
			</button>
			<button type="button" onClick={disconnect}>
				Disconnect
			</button>

			<button
				type="button"
				onClick={() =>
					grantPermissions.mutate(newPermissions, {
						onError: (err) => console.log("Err: ", err),
						onSuccess: (err) => console.log("Success: ", err),
					})
				}
			>
				Add Permissions
			</button>

			<button
				type="button"
				onClick={() =>
					addFunds.mutate(
						{},
						{
							onError: (err) => console.log("Err: ", err),
							onSuccess: (err) => console.log("Success: ", err),
						},
					)
				}
			>
				Add Exp
			</button>

			<button
				type="button"
				onClick={async () => {
					await mintOnBehalf(eoa.address!);
				}}
			>
				Mint on behalf
			</button>

			<div>
				<h1 className="text-2xl">Server:</h1>
				<div className="flex flex-col">
					<div>Server Wallet: {mockServerAccount.address}</div>
				</div>
			</div>

			<div>
				<h1 className="text-2xl">Account:</h1>
				<div className="flex flex-col">
					<div>Address: {eoa.address}</div>
				</div>
			</div>

			<div>
				<h1 className="text-2xl">Permissions:</h1>
				<div className="flex flex-col">
					{permissions.data?.map((item) => (
						<div key={item.id + item.expiry}>
							Permission: {item.address} to {item.key.publicKey}, until{" "}
							{new Date(item.expiry * 1000).toString()}
						</div>
					))}
				</div>
			</div>

			<div>
				<h1 className="text-2xl">EXP Balance:</h1>
				<div className="flex flex-col">
					<div>[Sender] - EXP Balance: {Value.formatEther(balanceSender ?? BigInt(0))}</div>
					<div>[Receiver] - EXP Balance: {Value.formatEther(balanceReceiver ?? BigInt(0))}</div>
				</div>
			</div>

			<div>
				<h1 className="text-2xl">Status:</h1>
				<div className="flex flex-col">
					<div>isConnected: {isConnected ? "true" : "false"}</div>
					<div>isConnecting: {isConnecting ? "true" : "false"}</div>
					<div>isDisconnected: {isDisconnected ? "true" : "false"}</div>
				</div>
			</div>
		</div>
	);
};

export default Page;
