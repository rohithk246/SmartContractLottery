import { Rinkeby, useContractFunction, useEtherBalance, useEthers, useNetwork } from "@usedapp/core";
import { constants, utils } from "ethers";
import networkMapping from "../helper-config.json";
import Lottery from "../abis/Lottery.json";
import { Contract } from "@ethersproject/contracts";


export const useContractFunctions =  (contractAdress?: string) => {

    const { chainId, library, account } = useEthers();
    const { network } = useNetwork();
    const signer = network.provider?.getSigner();
    const lotteryAddress = chainId ? networkMapping[String(chainId)]["Lottery"][0] : constants.AddressZero;
    const lotteryABI = Lottery.abi;
    // const provider = new ethers.providers.Web3Provider(window.ethereum);

    const isConnected: boolean = account !== undefined;
    const lotteryContract = new Contract(lotteryAddress, new utils.Interface(lotteryABI), signer);
    const lotteryBalance = useEtherBalance(lotteryAddress);
    console.log("LotteryContract: ", lotteryContract);
    console.log("LotteryBalance: ", lotteryBalance?.toString());
    // const wallet = new Wallet("0x7c7b5d5dce5d6bb89b059fc3c1e3433f1e88a5f7c259cdf1ba396415bf528de7", getDefaultProvider())

    const {state: getEntranceFeeState, send: getEntranceFeeSend} = useContractFunction(lotteryContract, "getLotteryState");
    
    const getLotteryState = () => {
        return getEntranceFeeSend();
    }

    // console.log(getEntranceFee());
    
    return { getEntranceFeeState, getLotteryState };
}