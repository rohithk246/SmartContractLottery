from scripts.helpful_scripts import get_account, get_contract
from brownie import Lottery, config, network
from web3 import Web3

MAX_PLAYERS, USD_ENTRY_FEE = 10, 10


def deploy_lottery():
    account = get_account()
    lottery = Lottery.deploy(
        MAX_PLAYERS, 
        USD_ENTRY_FEE,
        get_contract("eth_usd_price_feed").address, 
        get_contract("vrf_coordinator").address, 
        get_contract("link_token").address,
        config["networks"][network.show_active()]["link_fee"],
        config["networks"][network.show_active()]["keyhash"], 
        {"from":account}, 
        publish_source = config["networks"][network.show_active()].get("verify", False)
    )
    print("Lottery deployed!")
    return lottery

def main():
    deploy_lottery()