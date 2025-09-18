import { Porto } from "porto";
import { createClient, http } from "viem";
import { portoConfig } from "@/configs/web3";

const porto = Porto.create(portoConfig);

const client = createClient({
	transport: http("https://rpc.ithaca.xyz"),
});

export { porto, client };
