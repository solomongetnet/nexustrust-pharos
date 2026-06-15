import { getBalanceTool } from "./getBalance.js";
import { getLatestBlockTool } from "./getLatestBlock.js";
import { getGasPriceTool } from "./getGasPrice.js";
export const accountTools = [
    getBalanceTool,
    getLatestBlockTool,
    getGasPriceTool,
];
