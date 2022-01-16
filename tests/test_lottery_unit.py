from multiprocessing.connection import wait
from brownie import Lottery, accounts, config, network, exceptions
import pytest, math, scripts.helpful_scripts
from web3 import Web3
from scripts.deploy_lottery import deploy_lottery
from scripts.helpful_scripts import *

def test_convertToCorrectDecimals():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    
    lottery = deploy_lottery()
    num_with_correct_decimals = lottery.convertToCorrectDecimals(1, 0)
    assert num_with_correct_decimals == 10**18
    num_with_correct_decimals = lottery.convertToCorrectDecimals(10**20, 20)
    assert num_with_correct_decimals == 10**18


def test_deploy_with_incorrect_max_players():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    
    account = accounts[0]

    # Deploying Lottery with max players less than 2
    with pytest.raises(exceptions.VirtualMachineError):
        lottery = Lottery.deploy(
            1, 
            10, 
            get_contract("eth_usd_price_feed").address, 
            get_contract("vrf_coordinator").address, 
            get_contract("link_token").address,
            config["networks"][network.show_active()]["link_fee"],
            config["networks"][network.show_active()]["keyhash"], 
            {"from":account}, 
            publish_source = config["networks"][network.show_active()].get("verify", False)
        )

def test_deploy_with_incorrect_entry_fee():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    
    account = accounts[0]
    
    # Deploying Lottery with entry fee less than 1 USD
    with pytest.raises(exceptions.VirtualMachineError):
        lottery = Lottery.deploy(
            1, 
            0, 
            get_contract("eth_usd_price_feed").address, 
            get_contract("vrf_coordinator").address, 
            get_contract("link_token").address,
            config["networks"][network.show_active()]["link_fee"],
            config["networks"][network.show_active()]["keyhash"], 
            {"from":account}, 
            publish_source = config["networks"][network.show_active()].get("verify", False)
        )

def test_enterLottery():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    
    account = accounts[0]
    lottery = deploy_lottery()
    tx = lottery.enterLottery({"from": account, "value": lottery.getEntranceFee()})
    print(tx)
    tx.wait(1)
    print(tx)
    assert account == lottery.players(0)


def test_enterLottery_with_less_entrance_fee():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    
    account = accounts[0]
    lottery = deploy_lottery()
    lottery.enterLottery({"from": account, "value": lottery.getEntranceFee()})
    with pytest.raises(exceptions.VirtualMachineError):
        lottery.enterLottery({"from": account, "value": lottery.getEntranceFee() - 1})

def test_enterLottery_while_calculating_winner():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    
    account = accounts[0]
    lottery = Lottery.deploy(
        2, 
        10, 
        get_contract("eth_usd_price_feed").address, 
        get_contract("vrf_coordinator").address, 
        get_contract("link_token").address,
        config["networks"][network.show_active()]["link_fee"],
        config["networks"][network.show_active()]["keyhash"], 
        {"from":account}, 
        publish_source = config["networks"][network.show_active()].get("verify", False)
    )
    fund_with_link(lottery)
    tx = lottery.enterLottery({"from": account, "value": lottery.getEntranceFee()})
    tx.wait(1)
    tx = lottery.enterLottery({"from": accounts[1], "value": lottery.getEntranceFee()})
    tx.wait(1)

    # Max playes joined and no more can join before winner is declared
    with pytest.raises(exceptions.VirtualMachineError):
        lottery.enterLottery({"from": account, "value": lottery.getEntranceFee()})


def test_can_endLottery_when_maxplayers_joined():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()
    
    account = accounts[0]
    lottery = Lottery.deploy(
        2, 
        10, 
        get_contract("eth_usd_price_feed").address, 
        get_contract("vrf_coordinator").address, 
        get_contract("link_token").address,
        config["networks"][network.show_active()]["link_fee"],
        config["networks"][network.show_active()]["keyhash"], 
        {"from":account}, 
        publish_source = config["networks"][network.show_active()].get("verify", False)
    )
    fund_with_link(lottery)
    tx = lottery.enterLottery({"from": account, "value": lottery.getEntranceFee()})
    tx.wait(1)
    tx = lottery.enterLottery({"from": accounts[1], "value": lottery.getEntranceFee()})
    tx.wait(1)

    assert lottery.totalPlayersJoined() == 2
    assert account == lottery.players(0)
    assert accounts[1] == lottery.players(1)
    assert lottery.getLotteryState() == "CALCULATING_WINNER"

    account_balance_before_winning = account.balance()
    lottery_prize_amount = lottery.balance()
    request_id = tx.events["RequestedRandomness"]["requestId"]
    STATIC_RND = 4444

    # Mocking the link node response
    get_contract("vrf_coordinator").callBackWithRandomness(
        request_id, STATIC_RND, lottery.address, {"from": account}
    )
    account_balance_after_winning = account.balance()

    # 4444 % 2 == 0
    assert lottery.winner() == account
    assert lottery.balance() == 0
    assert account_balance_after_winning == account_balance_before_winning + lottelottery_prize_amountry_amount
    assert lottery.getLotteryState() == "OPEN"

