---
title: cw20-staking Spec
order: 6
---

# CW20 Staking Derivates

cw20-staking source code: [https://github.com/CosmWasm/cosmwasm-plus/tree/master/contracts/cw20-escrow](https://github.com/CosmWasm/cosmwasm-plus/tree/master/contracts/cw20-escrow)
This is a sample contract that releases a minimal form of staking derivatives.
This is to be used for integration tests and as a foundation for other to build
more complex logic upon.

## Functionality

On one side, this acts as a CW20 token, holding a list of
balances for multiple addresses, and exposing queries and transfers (no
allowances and "transfer from" to focus the logic on the staking stuff).
However, it has no initial balance. Instead, it mints and burns them based on
delegations.

For such a "bonding curve" we expose two additional message types. A "bond"
message sends native staking tokens to the contract to be bonded to a validator
and credits the user with the appropriate amount of derivative tokens. Likewise
you can burn some of your derivative tokens, and the contract will unbond the
proportional amount of stake to the user's account (after typical 21-day
unbonding period).

To show an example of charging for such a service, we allow the contract owner
to take a small exit tax, thus maybe 98% of the tokens will be unbonded and sent
to the original account, and 2% of the tokens are not unbonded, but rather
transferred to the owners account. (The ownership can also be transferred).
