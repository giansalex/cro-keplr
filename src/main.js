const { defaultBech32Config } = require("@chainapsis/cosmosjs/core/bech32Config");

window.onload = async () => {
    // Keplr extension injects the wallet provider that is compatible with chainapsis's cosmosJS.
    // You can get this wallet provider from `window.cosmosJSWalletProvider` after load event.
    // If `window.cosmosJSWalletProvider` is null, Keplr extension may be not installed on browser.
    if (!window.getOfflineSigner || !window.keplr) {
        alert("Please install keplr extension");
    } else {
        if (window.keplr.experimentalSuggestChain) {
            try {
                // Keplr v0.6.4 introduces an experimental feature that supports the feature to suggests the chain from a webpage.
                // If the user approves, the chain will be added to the user's Keplr extension.
                // If the user rejects it or the suggested chain information doesn't include the required fields, it will throw an error.
                // If the same chain id is already registered, it will resolve and not require the user interactions.
                await window.keplr.experimentalSuggestChain({
                    // Chain-id of the Cosmos SDK chain.
                    chainId: "crypto-org-chain-mainnet-1",
                    // The name of the chain to be displayed to the user.
                    chainName: "Crypto.org Chain",
                    // RPC endpoint of the chain.
                    rpc: "https://mainnet.crypto.org:26657",
                    // REST endpoint of the chain.
                    rest: "https://mainnet.crypto.org:1317",
                    // Staking coin information
                    // (Currently, Keplr doesn't have the UI that shows multiple tokens, therefore this uses the SHELL token as the primary token althought SHELL is not a staking coin.)
                    stakeCurrency: {
                        // Coin denomination to be displayed to the user.
                        coinDenom: "CRO",
                        // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                        coinMinimalDenom: "basecro",
                        // # of decimal points to convert minimal denomination to user-facing denomination.
                        coinDecimals: 8,
                        // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                        // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                        coinGeckoId: "crypto-com-chain"
                    },
                    // (Optional) If you have a wallet webpage used to stake the coin then provide the url to the website in `walletUrlForStaking`.
                    // The 'stake' button in Keplr extension will link to the webpage.
                    // walletUrlForStaking: "",
                    // The BIP44 path.
                    bip44: {
                        // You can only set the coin type of BIP44.
                        // 'Purpose' is fixed to 44.
                        coinType: 394,
                    },
                    // Bech32 configuration to show the address to user.
                    // This field is the interface of
                    // {
                    //   bech32PrefixAccAddr: string;
                    //   bech32PrefixAccPub: string;
                    //   bech32PrefixValAddr: string;
                    //   bech32PrefixValPub: string;
                    //   bech32PrefixConsAddr: string;
                    //   bech32PrefixConsPub: string;
                    // }
                    bech32Config: defaultBech32Config("cro", "cncl", "", "", ""),
                    // List of all coin/tokens used in this chain.
                    currencies: [{
                        // Coin denomination to be displayed to the user.
                        coinDenom: "CRO",
                        // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                        coinMinimalDenom: "basecro",
                        // # of decimal points to convert minimal denomination to user-facing denomination.
                        coinDecimals: 8,
                        // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                        // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                        // coinGeckoId: ""
                        coinGeckoId: "crypto-com-chain"
                    }],
                    // List of coin/tokens used as a fee token in this chain.
                    feeCurrencies: [{
                        // Coin denomination to be displayed to the user.
                        coinDenom: "CRO",
                        // Actual denom (i.e. uatom, uscrt) used by the blockchain.
                        coinMinimalDenom: "basecro",
                        // # of decimal points to convert minimal denomination to user-facing denomination.
                        coinDecimals: 8,
                        // (Optional) Keplr can show the fiat value of the coin if a coingecko id is provided.
                        // You can get id from https://api.coingecko.com/api/v3/coins/list if it is listed.
                        // coinGeckoId: ""
                        coinGeckoId: "crypto-com-chain"
                    }],
                    // (Optional) The number of the coin type.
                    // This field is only used to fetch the address from ENS.
                    // Ideally, it is recommended to be the same with BIP44 path's coin type.
                    // However, some early chains may choose to use the Cosmos Hub BIP44 path of '118'.
                    // So, this is separated to support such chains.
                    // coinType: 118,
                    // (Optional) This is used to set the fee of the transaction.
                    // If this field is not provided, Keplr extension will set the default gas price as (low: 0.01, average: 0.025, high: 0.04).
                    // Currently, Keplr doesn't support dynamic calculation of the gas prices based on on-chain data.
                    // Make sure that the gas prices are higher than the minimum gas prices accepted by chain validators and RPC/REST endpoint.
                    gasPriceStep: {
                        low: 0.025,
                        average: 0.03,
                        high: 0.04
                    },
                    features: ["stargate"]
                });
            } catch {
                alert("Failed to suggest the chain");
            }
        } else {
            alert("Please use the recent version of keplr extension");
        }
    }

    const chainId = "crypto-org-chain-mainnet-1";

    await window.keplr.enable(chainId);

    const offlineSigner = window.getOfflineSigner(chainId);
    const accounts = await offlineSigner.getAccounts();

    document.getElementById("address").textContent = accounts[0].address;
};
