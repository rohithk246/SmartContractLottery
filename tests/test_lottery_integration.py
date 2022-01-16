from brownie import Lottery, accounts, config, network, exceptions
from scripts.deploy_lottery import deploy_lottery
from web3 import Web3
from scripts.helpful_scripts import *
import pytest, math, time


def test_can_pick_winner():
    if network.show_active() in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip()

    account = get_account()
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

    # Lottery will end after max players join (in this case 2)
    account_balance_before_winning = account.balance() - lottery.getEntranceFee()
    tx = lottery.enterLottery({"from": account, "value": lottery.getEntranceFee()})
    tx.wait(1)

    # It's taking even longer than this, so it might not be right to do this way
    # Need to replace this with some kind of waiting mechanism till it's done (Infinite loop maybe?)
    time.sleep(180)

    account_balance_after_winning = account.balance()

    # Total lottery prize amount is entranceFee * joined_players 
    lottery_prize_amount = lottery.getEntranceFee() * 2

    assert lottery.winner() == account
    assert lottery.balance() == 0
    assert account_balance_after_winning == account_balance_before_winning + lottery_prize_amount
    assert lottery.getLotteryState() == "OPEN"
