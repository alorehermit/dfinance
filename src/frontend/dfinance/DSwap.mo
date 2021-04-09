import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Array "mo:base/Array";
import Utils "./utils";

actor class DSwap() = this {
    private stable let MINIMUM_LIQUIDITY: Nat = 1000;

    public type Token = {
        name: Text;
        symbol: Text;
        decimals: Nat;
        owner: Principal;
        var totalSupply: Nat;
        balances: HashMap.HashMap<Principal, Nat>;
        allowances: HashMap.HashMap<Principal, HashMap.HashMap<Principal, Nat>>;
    };

    public type TokenActor = actor {
        allowance: shared (owner: Principal, spender: Principal) -> async Nat;
        approve: shared (spender: Principal, value: Nat) -> async Bool;
        balanceOf: (owner: Principal) -> async Nat;
        decimals: () -> async Nat;
        name: () -> async Text;
        symbol: () -> async Text;
        totalSupply: () -> async Nat;
        transfer: shared (to: Principal, value: Nat) -> async Bool;
        transferFrom: shared (from: Principal, to: Principal, value: Nat) -> async Bool;
    };

    // id 和 lptoken 都是从t0与t1地址拼凑出来的 Text，且它们相等
    public type PairInfo = {
        id: Text;
        token0: Principal;
        token1: Principal;
        creator: Principal;
        reserve0: Nat;
        reserve1: Nat;
        lptoken: Text;
    };

    // pairs[t0][t1] 能够获取 t0 和 t1 交易对的信息。其中 t0 < t1;
    // 其中某个token可能参与构建多个 pair。
    private var pairs = HashMap.HashMap<Principal, HashMap.HashMap<Principal, PairInfo>>(1, Principal.equal, Principal.hash);
    // 所以有的配对数组
    private var pairlist : [(Principal, Principal)] = [];
    private var lptokens = HashMap.HashMap<Text, Token>(1, Text.equal, Text.hash);
    
    private func _getPair(token0: Principal, token1: Principal) : ?PairInfo {
        let (t0, t1) = Utils.sortTokens(token0, token1);
        switch (pairs.get(t0)) {
            case (?hpair) {
                return hpair.get(t1);
            };
            case (_) {
                return null;
            };
        }
    };

    private func _getlpTokenId(token0: Principal, token1: Principal) : Text {
        let (t0, t1) = Utils.sortTokens(token0, token1);
        let pair_str = Principal.toText(t0) # Principal.toText(t1);
        return pair_str;
    };
    
    // 创建/修改 pair
    private func _putPair(token0: Principal, token1: Principal, info: PairInfo) : Bool {
        let (t0, t1) = Utils.sortTokens(token0, token1);
        switch (pairs.get(t0)) {
            case (?hpair) {
                switch (hpair.get(t1)) {
                    case (?pair) { 
                        hpair.put(t1, info);
                        pairs.put(t0, hpair);
                        return true;
                    };
                    case (_) {
                        hpair.put(t1, info);
                        pairs.put(t0, hpair);
                        return true;
                    };
                }
            };
            case (_) {
                var temp = HashMap.HashMap<Principal, PairInfo>(1, Principal.equal, Principal.hash);
                temp.put(t1, info);
                pairs.put(t0, temp);
                return true;
            }
        };
    };
    

    public query func getPair(token0: Principal, token1: Principal) : async ?PairInfo {
        _getPair(token0, token1)
    };

    public query func getTokenId(token0: Principal, token1: Principal) : async Text {
        _getlpTokenId(token0, token1);
    };

    public query func getAllPair() : async [(Principal, Principal)] {
        return pairlist;
    };

    public query func getNumPairs(): async Nat {
        return pairlist.size();
    };


    // TODO: error handling
    public shared(msg) func createPair(token0: Principal, token1: Principal): async Bool {
        let (t0, t1) = Utils.sortTokens(token0, token1);
        let pair_str = Principal.toText(t0) # Principal.toText(t1);

        assert(_getPair(t0, t1) == null);
        let lp : Token = {
            name = "DSWAP-LP";
            symbol = "DSWAP-LP";
            decimals = 18;
            owner = msg.caller; // TODO
            var totalSupply = 0;
            balances = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
            allowances = HashMap.HashMap<Principal, HashMap.HashMap<Principal, Nat>>(1, Principal.equal, Principal.hash);
        };
        
        let pairinfo: PairInfo = {
            id = pair_str;
            token0 = t0;
            token1 = t1;
            creator = msg.caller;
            reserve0 = 0;
            reserve1 = 0;
            lptoken = pair_str;
        };
        assert(_putPair(t0, t1, pairinfo));
        pairlist := Array.append<(Principal, Principal)>(pairlist, [(t0, t1)]);
        lptokens.put(pair_str, lp);
        return true;
    };


    /**
    *   1. calculate amount0/amount1
    *   2. transfer token0/token1 from user to this canister (user has to approve first)
    *   3. mint lp token for msg.caller
    *   4. update reserve0/reserve1 info of pair
    */
    public shared(msg) func addLiquidity(token0: Principal, token1: Principal, amount0Desired: Nat, amount1Desired: Nat, amount0Min: Nat, amount1Min: Nat): async Bool {
        var amount0 = 0;
        var amount1 = 0;

        let (t0, t1) = Utils.sortTokens(token0, token1);
        var pair = switch (pairs.get(t0)) {
            case (?hpair) {
                switch (hpair.get(t1)) {
                    case (?_pair) {
                        _pair
                    };
                    case (_) {
                        return false;
                    };
                }
            };
            case (_) {
                return false;
            }
        };
        let tokenId = _getlpTokenId(t0, t1);
        var token = switch (lptokens.get(tokenId)) {
            case (?_token) {
                _token;
            };
            case (_) {
                return false;
            };
        };

        var totalSupply_ = token.totalSupply;

        let reserve0 = pair.reserve0;
        let reserve1 = pair.reserve1;
        if(reserve0 == 0 and reserve1 == 0) {
            amount0 := amount0Desired;
            amount1 := amount1Desired;
        } else {
            let amount1Optimal = Utils.quote(amount0Desired, reserve0, reserve1);
            if(amount1Optimal <= amount1Desired) {
                assert(amount1Optimal >= amount1Min);
                amount0 := amount0Desired;
                amount1 := amount1Optimal;
            } else {
                let amount0Optimal = Utils.quote(amount1Desired, reserve1, reserve0);
                assert(amount0Optimal <= amount0Desired);
                assert(amount0Optimal >= amount0Min);
                amount0 := amount0Optimal;
                amount1 := amount1Desired;
            };
        };
        var token0Canister: TokenActor = actor(Principal.toText(pair.token0));
        var token1Canister: TokenActor = actor(Principal.toText(pair.token1));
        // transfer tokens
        assert(await token0Canister.transferFrom(msg.caller, Principal.fromActor(this), amount0));
        assert(await token1Canister.transferFrom(msg.caller, Principal.fromActor(this), amount1));
        // mint LP token
        var lpAmount = 0;
        if(totalSupply_ == 0) {
            lpAmount := Utils.sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY;
            totalSupply_ := totalSupply_ + MINIMUM_LIQUIDITY;
        } else {
            lpAmount := Utils.min(amount0 * totalSupply_ / reserve0, amount1 * totalSupply_ / reserve1);
        };
        assert(lpAmount > 0);
        assert(_mint(tokenId, msg.caller, lpAmount));
        assert(await _sync(t0, t1)); // todo 
        return true;
    };

    /**
    *   1. transfer lp token from user to this canister (user has to approve first)
    *   2. burn lp token
    *   3. calculate token0/token1 amount
    *   4. transfer token0/token1 to user
    *   5. update reserve0/reserve1 info of pair
    */
    public shared(msg) func removeLiquidity(token0: Principal, token1: Principal, lpAmount: Nat): async Bool {
        return true;
    };

    public shared(msg) func swap(tokenIn: Principal, tokenOut: Principal, amountIn: Nat, amountOutMin: Nat): async Bool {
        var amountOut = 0;
        let (t0, t1) = Utils.sortTokens(tokenIn, tokenOut);
        var pair = switch (pairs.get(t0)) {
            case (?hpair) {
                switch (hpair.get(t1)) {
                    case (?_pair) {
                        _pair
                    };
                    case (_) {
                        return false;
                    };
                }
            };
            case (_) {
                return false;
            }
        };
        var token0Canister: TokenActor = actor(Principal.toText(pair.token0));
        var token1Canister: TokenActor = actor(Principal.toText(pair.token1));

        if(Principal.equal(tokenIn, t0)) {
            amountOut := Utils.getAmountOut(amountIn, pair.reserve0, pair.reserve1);
            Debug.print(debug_show((pair.reserve0, pair.reserve1, amountOut)));
            assert(amountOut >= amountOutMin);
            assert(await token0Canister.transferFrom(msg.caller, Principal.fromActor(this), amountIn));
            assert(await token1Canister.transfer(msg.caller, amountOut));
        } else {
            amountOut := Utils.getAmountOut(amountIn, pair.reserve1, pair.reserve0);
            Debug.print(debug_show((pair.reserve0, pair.reserve1, amountOut)));
            assert(amountOut >= amountOutMin);
            assert(await token1Canister.transferFrom(msg.caller, Principal.fromActor(this), amountIn));
            assert(await token0Canister.transfer(msg.caller, amountOut));
        };
        return true;
    };

    /**
    *   1. transfer amountIn path[0] token from user to this canister (user has to approve first)
    *   2. calculate the output amount follow the given path
    *   3. update reserves info along the path
    *   4. transfer amountOut path[-1] token to user
    */
    public shared(msg) func swapExactTokensForTokens(amountIn: Nat, amountOutMin: Nat, path: [Principal]): async Bool {
        return true;
    };


    // TODO
    private func _sync(token0: Principal, token1: Principal): async Bool {
        let (t0, t1) = Utils.sortTokens(token0, token1);
        var pair = switch (pairs.get(t0)) {
            case (?hpair) {
                switch (hpair.get(t1)) {
                    case (?_pair) {
                        _pair
                    };
                    case (_) {
                        return false;
                    };
                }
            };
            case (_) {
                return false;
            }
        };
        var token0Canister: TokenActor = actor(Principal.toText(pair.token0));
        var token1Canister: TokenActor = actor(Principal.toText(pair.token1));
        let reserve0 = await token0Canister.balanceOf(Principal.fromActor(this));
        let reserve1 = await token1Canister.balanceOf(Principal.fromActor(this));
        return true;
    };


    // LP token functions
    public shared(msg) func transfer(tokenId: Text, to: Principal, value: Nat) : async Bool {
        var token = switch (lptokens.get(tokenId)) {
            case (?_token) {
                _token;
            };
            case (_) {
                return false;
            };
        };
        switch (token.balances.get(msg.caller)) {
            case (?from_balance) {
                if (from_balance >= value) {
                    var from_balance_new = from_balance - value;
                    var to_balance_new = switch (token.balances.get(to)) {
                        case (?to_balance) {
                            to_balance + value;
                        };
                        case (_) {
                            value;
                        };
                    };
                    assert(from_balance_new <= from_balance);
                    assert(to_balance_new >= value);
                    token.balances.put(msg.caller, from_balance_new);
                    token.balances.put(to, to_balance_new);
                    lptokens.put(tokenId, token);
                    return true;
                } else {
                    return false;
                };
            };
            case (_) {
                return false;
            };
        }
    };

    public shared(msg) func transferFrom(tokenId: Text, from: Principal, to: Principal, value: Nat) : async Bool {
        var token = switch (lptokens.get(tokenId)) {
            case (?_token) {
                _token;
            };
            case (_) {
                return false;
            };
        };
        switch (token.balances.get(from), token.allowances.get(from)) {
            case (?from_balance, ?allowance_from) {
                switch (allowance_from.get(msg.caller)) {
                    case (?allowance) {
                        if (from_balance >= value and allowance >= value) {
                            var from_balance_new = from_balance - value;
                            var allowance_new = allowance - value;
                            var to_balance_new = switch (token.balances.get(to)) {
                                case (?to_balance) {
                                   to_balance + value;
                                };
                                case (_) {
                                    value;
                                };
                            };
                            assert(from_balance_new <= from_balance);
                            assert(to_balance_new >= value);
                            allowance_from.put(msg.caller, allowance_new);
                            token.allowances.put(from, allowance_from);
                            token.balances.put(from, from_balance_new);
                            token.balances.put(to, to_balance_new);
                            return true;                            
                        } else {
                            return false;
                        };
                    };
                    case (_) {
                        return false;
                    };
                }
            };
            case (_) {
                return false;
            };
        }
    };

    public shared(msg) func approve(tokenId: Text, spender: Principal, value: Nat) : async Bool {
        var token = switch (lptokens.get(tokenId)) {
            case (?_token) {
                _token;
            };
            case (_) {
                return false;
            };
        };
        switch(token.allowances.get(msg.caller)) {
            case (?allowances_caller) {
                allowances_caller.put(spender, value);
                token.allowances.put(msg.caller, allowances_caller);
                return true;
            };
            case (_) {
                var temp = HashMap.HashMap<Principal, Nat>(1, Principal.equal, Principal.hash);
                temp.put(spender, value);
                token.allowances.put(msg.caller, temp);
                return true;
            };
        }
    };

    private func _mint(tokenId: Text, to: Principal, value: Nat) : Bool {
        var token = switch (lptokens.get(tokenId)) {
            case (?_token) {
                _token;
            };
            case (_) {
                return false;
            };
        };
        switch (token.balances.get(to)) {
            case (?to_balance) {
                token.balances.put(to, to_balance + value);                
                token.totalSupply += value;
                lptokens.put(tokenId, token);
                return true;
            };
            case (_) {
                token.balances.put(to, value);
                token.totalSupply += value;
                lptokens.put(tokenId, token);
                return true;
            };
        }
    };

    private func _burn(tokenId: Text, from: Principal, value: Nat) : Bool {
        var token = switch (lptokens.get(tokenId)) {
            case (?_token) {
                _token;
            };
            case (_) {
                return false;
            };
        };
        switch (token.balances.get(from)) {
            case (?from_balance) {
                if (from_balance >= value) {
                    token.balances.put(from, from_balance - value);
                    token.totalSupply -= value;
                    lptokens.put(tokenId, token);
                    return true;
                } else {
                    return false;
                }
            };
            case (_) {
                return false;
            };
        }
    };

    public query func balanceOf(tokenId: Text, who: Principal) : async Nat {
        var token = switch (lptokens.get(tokenId)) {
            case (?_token) {
                _token;
            };
            case (_) {
                return 0;
            };
        };
        switch (token.balances.get(who)) {
            case (?balance) {
                return balance;
            };
            case (_) {
                return 0;
            };
        }
    };

    public query func allowance(tokenId: Text, owner: Principal, spender: Principal) : async Nat {
        var token = switch (lptokens.get(tokenId)) {
            case (?_token) {
                _token;
            };
            case (_) {
                return 0;
            };
        };
        switch(token.allowances.get(owner)) {
            case (?allowance_owner) {
                switch(allowance_owner.get(spender)) {
                    case (?allowance) {
                        return allowance;
                    };
                    case (_) {
                        return 0;
                    };
                }
            };
            case (_) {
                return 0;
            };
        }
    };

    public query func totalSupply(tokenId: Text) : async Nat {
        var token = switch (lptokens.get(tokenId)) {
            case (?_token) {
                _token;
            };
            case (_) {
                return 0;
            };
        };
        return token.totalSupply;
    };

    public query func name(tokenId: Text) : async Text {
        var token = switch (lptokens.get(tokenId)) {
            case (?_token) {
                _token;
            };
            case (_) {
                return "";
            };
        };
        return token.name;
    };

    public query func decimals(tokenId: Text) : async Nat {
        var token = switch (lptokens.get(tokenId)) {
            case (?_token) {
                _token;
            };
            case (_) {
                return 0;
            };
        };
        return token.decimals;
    };

    public query func symbol(tokenId: Text) : async Text {
        var token = switch (lptokens.get(tokenId)) {
            case (?_token) {
                _token;
            };
            case (_) {
                return "";
            };
        };
        return token.symbol;
    };
};
