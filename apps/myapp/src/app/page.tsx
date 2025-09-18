"use client";

import { Value } from "ox";
import type { wallet_grantPermissions } from "porto/RpcSchema";
import { parseEther } from "viem";
import { useBalance, useReadContract, useSendCalls } from "wagmi";
import { Button } from "@/components/button";
import { expContract, mockReceiver, mockServerAccount } from "@/configs/constants";
import { usePorto, usePortoActions } from "@/hooks/porto";
import { useWeb3 } from "@/providers/web3";
import { mintForServer } from "@/server/actions/mintForServer";
import { mintOnBehalf } from "@/server/actions/mintOnBehalf";
import { transferOnBehalf } from "@/server/actions/transferOnBehalf";
import { upgradeServerAccount } from "@/server/actions/upgradeServerAccount";

const newPermissions: wallet_grantPermissions.Parameters = {
	expiry: Math.floor(Date.now() / 1_000) + 60 * 60, // 1 hour
	feeToken: {
		symbol: "USDC",
		limit: "1",
	},
	key: {
		publicKey: mockServerAccount.publicKey,
		type: "secp256k1",
	},
	permissions: {
		calls: [
			{
				to: expContract.address,
			},
		],
		spend: [
			{
				period: "minute",
				limit: Value.fromEther("10"),
				token: expContract.address,
			},
		],
	},
} as const;

const FromTheClient = () => {
	const { eoa } = useWeb3();
	const { addFunds, grantPermissions } = usePortoActions();
	const { sendCalls } = useSendCalls();

	return (
		<div>
			<h1 className="text-5xl tracking-tighter font-medium">Executing from the client:</h1>

			<div className="flex gap-1">
				<Button
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
					Add funds
				</Button>

				<Button
					onClick={() =>
						sendCalls(
							{
								calls: [
									{
										abi: expContract.abi,
										to: expContract.address,
										functionName: "mint",
										args: [eoa.address!, parseEther("10")],
									},
								],
							},
							{
								onError: (err) => console.log("Err: ", err),
								onSuccess: (err) => console.log("Success: ", err),
							},
						)
					}
				>
					Mint 10 EXP
				</Button>

				<Button
					onClick={() =>
						sendCalls(
							{
								calls: [
									{
										abi: expContract.abi,
										to: expContract.address,
										functionName: "transfer",
										args: [mockReceiver!, parseEther("10")],
									},
								],
							},
							{
								onError: (err) => console.log("Err: ", err),
								onSuccess: (err) => console.log("Success: ", err),
							},
						)
					}
				>
					Send 10 EXP to Receiver
				</Button>

				<Button
					onClick={() =>
						grantPermissions.mutate(newPermissions, {
							onError: (err) => console.log("Err: ", err),
							onSuccess: (err) => console.log("Success: ", err),
						})
					}
				>
					Add Permissions
				</Button>
			</div>
		</div>
	);
};

const FromTheServer = () => {
	const { eoa } = useWeb3();

	return (
		<div>
			<h1 className="text-5xl tracking-tighter">Executing from the server:</h1>

			<div className="flex gap-1">
				<Button
					onClick={async () => {
						await mintOnBehalf(eoa.address!);
					}}
				>
					Mint on behalf
				</Button>

				<Button
					onClick={async () => {
						await transferOnBehalf(eoa.address!, mockReceiver);
					}}
				>
					Transfer On Behalf
				</Button>

				<Button
					onClick={async () => {
						await upgradeServerAccount();
					}}
				>
					Upgrade Server Account
				</Button>

				<Button
					onClick={async () => {
						await mintForServer();
					}}
				>
					Mint For Server
				</Button>
			</div>
		</div>
	);
};

const Info = () => {
	const { eoa, isConnected, isConnecting, isDisconnected } = useWeb3();

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

	const { data: balanceServer } = useReadContract({
		address: expContract.address,
		abi: expContract.abi,
		functionName: "balanceOf",
		args: [mockServerAccount.address!],
	});

	const { data: balanceEthSender } = useBalance({
		address: eoa.address!,
	});

	const { data: balanceEthReceiver } = useBalance({
		address: mockReceiver!,
	});

	const { data: balanceEthServer } = useBalance({
		address: mockServerAccount.address!,
	});

	return (
		<div>
			<h1 className="text-5xl tracking-tighter">Info:</h1>

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
					<div>[Server] - EXP Balance: {Value.formatEther(balanceServer ?? BigInt(0))}</div>
				</div>
			</div>

			<div>
				<h1 className="text-2xl">ETH Balance:</h1>
				<div className="flex flex-col">
					<div>
						[Sender] - ETH Balance: {Value.formatEther(balanceEthSender?.value ?? BigInt(0))}
					</div>
					<div>
						[Receiver] - ETH Balance: {Value.formatEther(balanceEthReceiver?.value ?? BigInt(0))}
					</div>
					<div>
						[Server] - ETH Balance: {Value.formatEther(balanceEthServer?.value ?? BigInt(0))}
					</div>
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

const Page = () => {
	const { connect, disconnect } = useWeb3();

	return (
		<div className="flex flex-col gap-4 p-2">
			<div className="flex gap-1">
				<Button onClick={connect}>Connect</Button>
				<Button onClick={disconnect}>Disconnect</Button>
			</div>

			<FromTheClient />
			<FromTheServer />
			<Info />
		</div>
	);
};

export default Page;
