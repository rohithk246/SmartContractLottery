import { useContractFunction, useEtherBalance, useEthers } from "@usedapp/core";
import { constants, utils } from "ethers";
import networkMapping from "../helper-config.json";
import Lottery from "../abis/Lottery.json";
import { Contract } from "@ethersproject/contracts";
import { formatUnits } from "@ethersproject/units";
import { useContractFunctions } from "../hooks/useContractFunctions";
import { Button } from "@material-ui/core";

export const Main = () => {
  const chainId = useEthers().chainId;
  const lotteryAddress = chainId ? networkMapping[String(chainId)]["Lottery"][0] : constants.AddressZero;
  const lotteryABI = Lottery.abi;

  const lotteryContract = new Contract(lotteryAddress, new utils.Interface(lotteryABI));
  const lotteryBalance = useEtherBalance(lotteryAddress);

  const { getEntranceFeeState, getLotteryState } = useContractFunctions();
  let entranceFee;

  const handleClick = async () => {
    console.log("Lottery State: ", await getLotteryState());
  }

  return (
    <div>
      <div>ChainId: { chainId }</div>
      <div>Lottery is deployed at: { lotteryAddress }</div>
      { lotteryBalance && <div>Lottery balance: { formatUnits(lotteryBalance.toString()) }</div> }
      <Button onClick={handleClick}>
        Get Entry Fee
      </Button>
      { entranceFee && <div>Entrance Fee: {entranceFee}</div> }
    </div>
  )
}

