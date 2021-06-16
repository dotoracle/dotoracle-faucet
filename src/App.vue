<template>
    <div id="app">
        <div class="container">
            <div class="text-center mb-4">
                <img class="mb-4" src="./assets/logo.png" alt="" height="150px">
                <h1 class="h3 mb-3 font-weight-normal">DotOracle testnet faucet</h1>
            </div>

            <div v-if="networkId === 0">
                <button
                        v-if="account === ''"
                        @click="connect"
                        class="btn btn-lg btn-primary btn-block btn-request">Connect Wallet
                </button>
            </div>
            <div v-else>
                <div v-if="networks[networkId]">
                    <p>You are connected to {{networks[networkId].name}} network.</p>
                    <p v-if="txHash !== ''">
                        1,000 tokens transferred to your address. <a :href="networks[networkId].explorer + '/tx/' + txHash"
                                                                  target="_blank">Transaction details</a>
                    </p>
                    <p>Token address: <a
                            :href="networks[networkId].explorer + '/address/' + networks[networkId].contract"
                            target="_blank">{{networks[networkId].contract}}</a></p>
                    <button
                            v-if="account !== ''"
                            @click="faucet"
                            class="btn btn-lg btn-primary btn-block btn-request">Request faucet
                    </button>
                    <p v-if="networks[networkId].faucet !== ''" class="mt-4">
                        Go to <a :href="networks[networkId].faucet" target="_blank">Faucet</a> to get testnet {{networks[networkId].token}}</p>
                </div>
                <div v-else>
                    This network is currently not supported
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Web3 from 'web3'

    const ABI = [{
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "mint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }]
    export default {
        name: 'App',
        components: {},
        data() {
            return {
                web3: {},
                account: '',
                txHash: '',
                networkId: 0,
                networks: {
                    42: {
                        contract: '0x77d77774fc52577a1111d90adf29f6a7cd62e70f',
                        name: 'Kovan',
                        rpc: '',
                        faucet: 'https://faucet.kovan.network/',
                        token: 'ETH',
                        explorer: 'https://kovan.etherscan.io'
                    },
                    89: {
                        contract: '0x0bb20dc9D6fEE2E8bd291842EFf7f34AbdcEE451',
                        name: 'TomoChain testnet',
                        rpc: 'https://rpc.testnet.tomochain.com',
                        faucet: 'https://faucet.testnet.tomochain.com/',
                        token: 'TOMO',
                        explorer: 'https://scan.testnet.tomochain.com'
                    },
                    97: {
                        contract: '0xF18efcc1e406385B646d1b0dc507cC893B3eD489',
                        name: 'BSC testnet',
                        rpc: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
                        faucet: 'https://testnet.binance.org/faucet-smart',
                        token: 'BNB',
                        explorer: 'https://testnet.bscscan.com'
                    },
                    1287: {
                        contract: '0xA73EfffAeB7DAE47ff894401c3398BD13cD2915B',
                        name: 'MoonBeam Testnet',
                        rpc: 'https://rpc.testnet.moonbeam.network',
                        faucet: '',
                        token: 'DEV',
                        explorer: 'https://moonbeam-explorer.netlify.app'
                    },
                    4002: {
                        contract: '0x936128d61b1Dd39DAD09dd2A2cBD7Dc09Be2F14B',
                        name: 'Fantom Testnet',
                        rpc: 'https://rpc.testnet.fantom.network',
                        faucet: 'https://faucet.fantom.network/',
                        token: 'FTM',
                        explorer: 'https://testnet.ftmscan.com'
                    },
                    43113: {
                        contract: '0xa6f8eB1f92e6e20b6F634dD2d1CB125aCBf85155',
                        name: 'Avalanche Testnet',
                        rpc: 'https://api.avax-test.network/ext/bc/C/rpc',
                        faucet: 'https://faucet.avax-test.network/',
                        token: 'AVAX',
                        explorer: 'https://cchain.explorer.avax-test.network'
                    },
                    80001: {
                        contract: '0x52810aC61d1fd106AeFc8a6d7F1898ffCb86f5F5',
                        name: 'Mumbai Matic',
                        rpc: 'https://rpc-mumbai.maticvigil.com',
                        faucet: 'https://faucet.matic.network/',
                        token: 'MATIC',
                        explorer: 'https://explorer-mumbai.maticvigil.com'
                    }
                }
            }
        },
        methods: {
            async faucet() {
                let contract = await new this.web3.eth.Contract(ABI, this.networks[this.networkId].contract)
                contract.methods.mint(this.account).send({
                    from: this.account
                }, async (error, txHash) => {
                    if (error) {
                        alert('There are something errors! Please try again later.')
                    } else {
                        this.txHash = txHash
                    }

                })
            },
            async connect() {
                if (window.ethereum) {
                    await window.ethereum.enable()
                    if (window.ethereum) {
                        this.web3 = new Web3(window.ethereum)
                    } else if (window.web3) {
                        this.web3 = new Web3(window.web3)
                    }

                    if (this.web3) {
                        let chainId = this.web3.currentProvider.chainId
                        this.networkId = this.web3.utils.hexToNumber(chainId)
                        let networkVersion = this.web3.currentProvider.networkVersion
                        let accounts = await this.web3.eth.getAccounts()
                        if (Array.isArray(accounts)) {
                            this.account = accounts[0]
                        } else {
                            this.account = accounts
                        }
                    }
                }
            }
        }
    }
</script>

<style>
    :root {
        --input-padding-x: .75rem;
        --input-padding-y: .75rem;
    }

    html,
    body {
        background-color: #490fb4 !important;
        height: 100%;
        color: #fff !important;
    }

    a {
        color: #da4bfd !important;
    }

    body {
        display: -ms-flexbox;
        display: -webkit-box;
        display: flex;
        -ms-flex-align: center;
        -ms-flex-pack: center;
        -webkit-box-align: center;
        align-items: center;
        -webkit-box-pack: center;
        justify-content: center;
        padding-top: 40px;
        padding-bottom: 40px;
        background: url('https://dotoracle.network/images/banner-bg.svg') no-repeat center / cover;
    }

    .container {
        width: 100%;
        max-width: 640px;
        padding: 15px;
        margin: 0 auto;
        text-align: center;
    }

    .form-label-group > input,
    .form-label-group > label {
        padding: var(--input-padding-y) var(--input-padding-x);
    }

    .form-label-group > label {
        position: absolute;
        top: 0;
        left: 0;
        display: block;
        width: 100%;
        margin-bottom: 0; /* Override default `<label>` margin */
        line-height: 1.5;
        color: #495057;
        border: 1px solid transparent;
        border-radius: .25rem;
        transition: all .1s ease-in-out;
    }

    .form-label-group input::-webkit-input-placeholder {
        color: transparent;
    }

    .form-label-group input:-ms-input-placeholder {
        color: transparent;
    }

    .form-label-group input::-ms-input-placeholder {
        color: transparent;
    }

    .form-label-group input::-moz-placeholder {
        color: transparent;
    }

    .form-label-group input::placeholder {
        color: transparent;
    }

    .form-label-group input:not(:placeholder-shown) {
        padding-top: calc(var(--input-padding-y) + var(--input-padding-y) * (2 / 3));
        padding-bottom: calc(var(--input-padding-y) / 3);
    }

    .form-label-group input:not(:placeholder-shown) ~ label {
        padding-top: calc(var(--input-padding-y) / 3);
        padding-bottom: calc(var(--input-padding-y) / 3);
        font-size: 12px;
        color: #777;
    }

    .btn-request {
        background-color: #da4bfd !important;
        border: 1px solid #da4bfd !important;
    }
</style>
