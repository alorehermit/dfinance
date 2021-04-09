import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Nat "mo:base/Nat";

module {
    /// Get the min value of two input nature.
    public func min(x: Nat, y: Nat): Nat {
        if(x < y) {
            x
        } else {
            y
        }
    };

    public func sqrt(y: Nat): Nat {
        var z = 0;
        if (y > 3) {
            z := y;
            var x: Nat = y / 2 + 1;
            while (x < z) {
                z := x;
                x := (y / x + x) / 2;
            }
        } else if (y != 0) {
            z := 1;
        };
        z
    };

    public func sortTokens(tokenA: Principal, tokenB: Principal): (Principal, Principal) {
        if(Principal.less(tokenA, tokenB)) {
            (tokenA, tokenB)
        } else {
            (tokenB, tokenA)
        }
    };

    public func quote(amount0: Nat, r0: Nat, r1: Nat): Nat {
        assert(amount0 > 0);
        assert(r0 > 0 and r1 > 0);
        return amount0 * r1 / r0;
    };

    public func getAmountOut(amountIn: Nat, reserveIn: Nat, reserveOut: Nat): Nat {
        var amountInWithFee = amountIn * 997;
        var numerator = amountInWithFee * reserveOut;
        var denominator = reserveIn * 1000 + amountInWithFee;
        numerator / denominator
    };

    public func getAmountIn(amountOut: Nat, reserveIn: Nat, reserveOut: Nat): Nat {
        var numerator = reserveIn * amountOut * 1000;
        var denominator = (reserveOut - amountOut) * 997;
        numerator / denominator + 1
    };
};
