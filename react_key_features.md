# Memory Leak

"In React, the function returned from a useEffect is used for cleanup. This is essential whenever you start side effects that persist beyond a render cycle — like intervals, event listeners, WebSocket subscriptions, or observers.

Without a cleanup, those effects would continue running even if the component is unmounted or re-rendered, leading to memory leaks or duplicated logic. So, I always use a return function to clear timers, remove listeners, or unsubscribe from services to avoid unexpected behavior."

## ¿Qué casos requieren cleanup? Una regla fácil:

Si el efecto crea algo que "vive" en segundo plano (tiempos, listeners, conexiones, observadores…), debes limpiarlo.

## Tipo: ¿Necesita return cleanup?

setTimeout, setInterval = Sí, con clearTimeout, clearInterval
addEventListener = Sí, con removeEventListener
WebSocket, Firebase = Sí, con .unsubscribe() o .close()
ResizeObserver, MutationObserver = Sí, con .disconnect()
API calls con abortController = Sí, con .abort()

# Resumen en una línea para entrevista técnica

"If my effect sets up anything persistent like a timer or listener, I always return a cleanup function to avoid memory leaks and dangling side effects."

# Polling

"Polling is a fallback mechanism we use when the wallet or SDK does not support real-time events. If available, we prefer using event listeners like onBalanceChanged, but if not, we perform regular checks every few seconds to stay in sync with the blockchain state."

# Why use an abstract class instead of an interface?

An abstract class in TypeScript:

Acts like an interface by enforcing a contract using the abstract keyword.

Allows shared logic or utility methods between subclasses.

Supports instanceof checks and inheritance at runtime (unlike interfaces).

## Use case in the project:

You use abstract class BaseWalletProvider because:

You want every wallet (e.g., MetaMask, WalletConnect) to implement core methods like connect(), getBalance(), etc.

You might later add shared methods or helper functions (e.g., formatBalance()).

You benefit from stronger type checks and future extensibility.

## When to use abstract vs ? (optional)

abstract means the method/property must be implemented in every subclass.

? means the method/property is optional, so not all providers need to implement it.

You can’t combine them (abstract? is invalid).

## Example:

abstract class WalletProvider {
abstract connect(): Promise<void>; // Required in every subclass
onBalanceChanged?: (account: string, handler: (bal: string) => void) => void; // Optional
}
❗ Why use the ! (non-null assertion) operator?
The ! tells TypeScript:

"Trust me, this property is not undefined, even if the type says it might be."

## Example:

if (typeof provider.onBalanceChanged === "function") {
provider.onBalanceChanged!(account, updateBalance); // safe use after type check
}
Without !, TypeScript will throw an error because onBalanceChanged is marked as optional.

## Alternative without !:

provider.onBalanceChanged?.(account, updateBalance); // Safe with optional chaining
But if we are already checking the type, using ! is cleaner and slightly more performant.

## Summary

- Use abstract for required properties/methods.
- Use ? for optional features (not supported by all wallets).
- Use ! when you’ve already ensured that an optional property is defined.
- abstract class is more powerful than interface if you plan to add default logic or share methods between adapters.
