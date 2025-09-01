import { Porto } from "porto";
import { createClient, custom } from "viem";
import { portoConfig } from "@/configs/web3";

const porto = Porto.create(portoConfig);

const client = createClient({
	transport: custom(porto.provider),
});

export { porto, client };
