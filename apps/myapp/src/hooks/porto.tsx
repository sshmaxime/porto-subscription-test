import { Hooks } from "porto/wagmi";

const usePortoActions = () => {
	const addFunds = Hooks.useAddFunds({});
	const grantPermissions = Hooks.useGrantPermissions({});

	return { addFunds, grantPermissions };
};

const usePorto = () => {
	const permissions = Hooks.usePermissions({});

	return { permissions };
};

export { usePortoActions, usePorto };
