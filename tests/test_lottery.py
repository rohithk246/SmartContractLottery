from brownie import Lottery, accounts, config, network, exceptions
import pytest, math
from web3 import Web3

MAX_PLAYERS, USD_ENTRY_FEE = 10, 10

def test_getEntranceFee():
    if(network.show_active() == "development"):
        pytest.skip()
    account = accounts[0]
    lottery = Lottery.deploy(
        MAX_PLAYERS, 
        USD_ENTRY_FEE,
        config["networks"][network.show_active()]["eth_usd_price_feed"],
        {"from":account}
    )
    print(f'{lottery.getEntranceFee()} is 10 USD/ETH (18 decimals)')

def test_convertToCorrectDecimals():
    account = accounts[0]
    lottery = Lottery.deploy(
        MAX_PLAYERS, 
        USD_ENTRY_FEE,
        config["networks"][network.show_active()]["eth_usd_price_feed"],
        {"from":account}
    )
    num_with_correct_decimals = lottery.convertToCorrectDecimals(1, 0)
    assert num_with_correct_decimals == 10**18
    num_with_correct_decimals = lottery.convertToCorrectDecimals(10**20, 20)
    assert num_with_correct_decimals == 10**18

def test_enterLottery():
    account = accounts[0]
    lottery = Lottery.deploy(
        MAX_PLAYERS, 
        USD_ENTRY_FEE,
        config["networks"][network.show_active()]["eth_usd_price_feed"],
        {"from":account}
    )
    lottery.enterLottery({"from": account, "value": lottery.getEntranceFee()})

def test_enterLottery_closed():
    account = accounts[0]
    lottery = Lottery.deploy(
        1, 
        USD_ENTRY_FEE,
        config["networks"][network.show_active()]["eth_usd_price_feed"],
        {"from":account}
    )
    lottery.enterLottery({"from": account, "value": lottery.getEntranceFee()})
    with pytest.raises(exceptions.VirtualMachineError):
        lottery.enterLottery({"from": account, "value": lottery.getEntranceFee()})

