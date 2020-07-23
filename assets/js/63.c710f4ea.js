(window.webpackJsonp=window.webpackJsonp||[]).push([[63],{638:function(e,t,a){"use strict";a.r(t);var s=a(0),o=Object(s.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"actor-model-for-contract-calls"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#actor-model-for-contract-calls"}},[e._v("#")]),e._v(" Actor Model for Contract Calls")]),e._v(" "),a("p",[e._v("The "),a("a",{attrs:{href:"https://en.wikipedia.org/wiki/Actor_model",target:"_blank",rel:"noopener noreferrer"}},[e._v("actor model"),a("OutboundLink")],1),e._v(" is a design pattern, often used in to build reliable, distributed systems. The fundamental points, in my opinion, are that each "),a("code",[e._v("Actor")]),e._v(" has exclusive access to its own internal state, and that "),a("code",[e._v("Actors")]),e._v(" cannot call each other directly, only dispatch messages over some "),a("code",[e._v("Dispatcher")]),e._v(" (that maintains the state of the system and can map addresses to code and storage). Fundamentally the "),a("code",[e._v("Actor")]),e._v(" pattern can be encapsulated in such an interface:")]),e._v(" "),a("code-block",{staticClass:"codeblock",attrs:{language:"rust",base64:"cHViIHRyYWl0IEFjdG9yIHsKICAgIGZuIGhhbmRsZShtc2dQYXlsb2FkOiAmYW1wO1t1OF0pIC0mZ3Q7IFZlYyZsdDtNc2cmZ3Q7Owp9CgpwdWIgc3RydWN0IE1zZyB7CiAgICBwdWIgZGVzdGluYXRpb246IFZlYyZsdDt1OCZndDssCiAgICBwdWIgcGF5bG9hZDogVmVjJmx0O3U4Jmd0OywKfQo="}}),e._v(" "),a("p",[e._v("This is the basic model that was used to model contracts in CosmWasm. You can see the same influence in the function "),a("code",[e._v("pub fn handle<T: Storage>(store: &mut T, params: Params, msg: Vec<u8>) -> Result<Response>")]),e._v(". "),a("code",[e._v("Response")]),e._v(" contains "),a("code",[e._v("Vec<Msg>")]),e._v(" and a little metadata. "),a("code",[e._v("store")]),e._v(" is access to the contract's internal state. And "),a("code",[e._v("params")]),e._v(" is some global immutable context. So, just a little bit of syntax around the same design. From this basic design, a few other useful aspects can be derived:")]),e._v(" "),a("p",[e._v("First, there is a "),a("strong",[e._v("loose coupling")]),e._v(" between Actors, limited to the format of the data packets (the recipient must support a superset of what you send). There is no complex API or function pointers to pass around. This is much like using REST or RPC calls as a boundary between services, which is a scalable way to compose systems from many vendors.")]),e._v(" "),a("p",[e._v("Secondly, each "),a("code",[e._v("Actor")]),e._v(" can effectively run on its own thread, with its own queue. This both enables concurrency (which we don't make use of in CosmWasm... yet), and "),a("strong",[e._v("serialized execution")]),e._v(" within each actor (which we do rely upon). This means that it is impossible for the "),a("code",[e._v("Handle")]),e._v(" method above to be executed in the middle of a previously executed "),a("code",[e._v("Handle")]),e._v(" call. "),a("code",[e._v("Handle")]),e._v(" is a synchronous call and returns before the "),a("code",[e._v("Actor")]),e._v(" can process the next message. This feature is what "),a("a",{attrs:{href:"../getting-started/smart-contracts#avoiding-reentrancy-attacks"}},[e._v("protects us from reentrancy by design")]),e._v(".")]),e._v(" "),a("p",[e._v("Another important aspect related to CosmWasm is "),a("strong",[e._v("locality")]),e._v(". That is, actors can only communicate with other actors "),a("strong",[e._v("whose address they previously received")]),e._v(". We will go more into depth on "),a("a",{attrs:{href:"./addresses"}},[e._v("addresses and naming")]),e._v(" in the next page, but the key point is that for two actors to communicate, an external message (from the contract creator, or potentially a user) must be sent to the actor. This is a flexible way to set up topologies in a distributed manner. The only thing that must be hard-coded is the data format to pass to such addresses. Once some standard interfaces are established (like ERC20, ERC721, ENS, etc), then we can support composability between large classes of contracts, with different backing code, but sharing a common API.")]),e._v(" "),a("h2",{attrs:{id:"security-benefits"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#security-benefits"}},[e._v("#")]),e._v(" Security Benefits")]),e._v(" "),a("p",[e._v("By enforcing "),a("strong",[e._v("private internal state")]),e._v(", a given contract can guarantee all valid transitions in its internal state. This is in contrast to the capabilities model used in Cosmos SDK, where trusted modules are passed a "),a("code",[e._v("StoreKey")]),e._v(" in their constructor, which allows "),a("em",[e._v("full read and write access to the other module's storage")]),e._v(". In the Cosmos SDK, we can audit the modules before calling them, and safely pass in such powerful set of rights at compile time. However, there are no compile time checks in a smart contract system and we need to produce stricter boundaries between contracts. This allows us to comprehensively reason over all possibles transitions in a contract's state (and use quick-check like methods to test it).")]),e._v(" "),a("p",[e._v("As mentioned above, "),a("strong",[e._v("serialized execution")]),e._v(" prevents all concurrent execution of a contract's code. This is like an automatic mutex over the entire contract code. This is exactly the issue that one of the most common Ethereum attacks, reentrancy, makes use of. Contract A calls into contract B, which calls back into contract A. There may be local changes in memory in contract A from the first call (eg. deduct a balance), which are not yet persisted, so the second call can use the outdated state a second time (eg. authorize sending a balance twice). By enforcing serialized execution, the contract will write all changes to storage before exiting, and have a proper view when the next message is processed.")]),e._v(" "),a("h2",{attrs:{id:"atomic-execution"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#atomic-execution"}},[e._v("#")]),e._v(" Atomic Execution")]),e._v(" "),a("p",[e._v('One problem with sending messages is atomically committing a state change over two contracts. There are many cases where we want to ensure that all returned messages were properly processed before committing our state. There are ideas like "three-phase-commit" used in distributed databases, but since in the normal case, all actors are living in the same binary, we can handle this in the '),a("code",[e._v("Keeper")]),e._v(". Before executing a Msg that came from an external transaction, we create a SavePoint of the global data store, and pass in a subset to the first contract. We then execute all returned messages inside the same sub-transaction. If all messages succeed, then we can commit the sub-transaction. If any fails (or we run out of gas), we abort execution and rollback the state to before the first contract was executed.")]),e._v(" "),a("p",[e._v('This allows us to optimistically update code, relying on rollback for error handling. For example if an exchange matches a trade between two "ERC20" tokens, it can make the offer as fulfilled and return two messages to move token A to the buyer and token B to the seller. (ERC20 tokens use a concept of allowance, so the owner "allows" the exchange to move up to X tokens from their account). When executing the returned messages, it turns out the the buyer doesn\'t have sufficient token B (or provided an insufficient allowance). This message will fail, causing the entire sequence to be reverted. Transaction failed, the offer was not marked as fulfilled, and no tokens changed hands.')]),e._v(" "),a("p",[e._v("While many developers may be more comfortable thinking about directly calling the other contract in their execution path and handling the errors, you can achieve almost all the same cases with such an "),a("em",[e._v("optimistic update and return")]),e._v(" approach. And there is no room for making mistakes in the contract's error handling code.")]),e._v(" "),a("h2",{attrs:{id:"dynamically-linking-host-modules"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#dynamically-linking-host-modules"}},[e._v("#")]),e._v(" Dynamically Linking Host Modules")]),e._v(" "),a("p",[e._v("The aspects of "),a("strong",[e._v("locality")]),e._v(" and "),a("strong",[e._v("loose coupling")]),e._v(" mean that we don't even need to link to other CosmWasm contracts. We can send messages to anything the Dispatcher has an address for. For example, we can return a "),a("code",[e._v("SendMsg")]),e._v(", which will be processed by the native "),a("code",[e._v("x/supply")]),e._v(" module in Cosmos SDK, moving native tokens. As we define standard interfaces for composability, we can define interfaces to call into core modules (bond and unbond your stake...), and then pass in the address to the native module in the contract constructor.")]),e._v(" "),a("h2",{attrs:{id:"inter-blockchain-messaging"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#inter-blockchain-messaging"}},[e._v("#")]),e._v(" Inter Blockchain Messaging")]),e._v(" "),a("p",[e._v('Since the Actor model doesn\'t attempt to make synchronous calls to another contract, but just returns a message "to be executed", it is a nice match for making cross-chain contract calls using '),a("a",{attrs:{href:"https://cosmos.network/ibc",target:"_blank",rel:"noopener noreferrer"}},[e._v("IBC"),a("OutboundLink")],1),e._v(". The only caveat here is that the "),a("em",[e._v("atomic execution")]),e._v(" guarantee we provided above no longer applies here. The other call will not be called by the same dispatcher, so we need to store an intermediate state in the contract itself. That means a state that cannot be changed until the result of the IBC call is known, then can be safely applied or reverted.")]),e._v(" "),a("p",[e._v("For example, if we want to move tokens from chain A to chain B, we would first prepare a send:")]),e._v(" "),a("ol",[a("li",[e._v("Contract A reduces token supply of sender")]),e._v(" "),a("li",[e._v('Contract A creates a "escrow" of those tokens linked to IBC message id, sender and receiving chain.')]),e._v(" "),a("li",[e._v("Contract A commits state and returns a message to initiate an IBC transaction to chain B.")]),e._v(" "),a("li",[e._v("If the IBC send part fails, then the contract is atomically reverted as above.")])]),e._v(" "),a("p",[e._v('After some time, a "success" or "error"/"timeout" message is returned from the IBC module to the token contract:')]),e._v(" "),a("ol",[a("li",[e._v("Contract A validates the message came from the IBC handler (authorization) and refers to a known IBC message ID it has in escrow.")]),e._v(" "),a("li",[e._v('If it was a success, the escrow is deleted and the escrowed tokens are placed in an account for "Chain B" (meaning that only a future IBC message from Chain B may release them).')]),e._v(" "),a("li",[e._v("If it was an error, the escrow is deleted and the escrowed tokens are returned to the account of the original sender.")])]),e._v(" "),a("p",[e._v("You can imagine a similar scenario working for cases like moving NFT ownership, cross-chain staking, etc. We will expand on these possibilities and provide tooling to help make proper design once the IBC code in Cosmos SDK is stabilized (and included in a release), but the contract design is made with this in mind.")]),e._v(" "),a("h2",{attrs:{id:"credits"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#credits"}},[e._v("#")]),e._v(" Credits")]),e._v(" "),a("p",[e._v("Much thanks to "),a("a",{attrs:{href:"https://github.com/aaronc",target:"_blank",rel:"noopener noreferrer"}},[e._v("Aaron Craelius"),a("OutboundLink")],1),e._v(", who came up with this design of using an Actor model to avoid reentrancy attacks.")])],1)}),[],!1,null,null,null);t.default=o.exports}}]);