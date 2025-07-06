import { IBalanceService } from "../types/IBalanceService";
import { Protocol } from "../constants/Protocol";
import { EvmBalanceService } from "../evm/services/EvmBalanceService";
// import { SolanaBalanceService } from "../solana/services/SolanaBalanceService";

const registry: Record<Protocol, IBalanceService> = {
  [Protocol.EVM]: new EvmBalanceService(),
  // [Protocol.SOLANA]: new SolanaBalanceService(),
};

export const BalanceServiceRegistry = {
  get(protocol: Protocol): IBalanceService {
    const service = registry[protocol];
    if (!service) throw new Error(`No balance service found for ${protocol}`);
    return service;
  },
};

/**
 * BalanceServiceRegistry
 *
 * Este registro actúa como un punto central para acceder a los servicios encargados
 * de obtener los balances de tokens, dependiendo del protocolo seleccionado (EVM, Solana, etc).
 *
 * Cada servicio implementa la interfaz IBalanceService, lo que garantiza una estructura uniforme
 * y permite desacoplar la lógica específica de cada protocolo del resto del sistema.
 *
 * Cómo funciona:
 * - Se define un objeto 'registry' donde cada protocolo está asociado a su servicio correspondiente.
 * - El método `get()` recibe un protocolo y retorna el servicio adecuado.
 * - Si el protocolo no tiene un servicio registrado, lanza un error claro.
 *
 * Este diseño sigue el patrón Registry + Dependency Inversion:
 * - El código de alto nivel (APIs, stores, etc.) no conoce ni importa EvmBalanceService directamente.
 * - En su lugar, trabaja con IBalanceService, permitiendo cambiar o agregar protocolos sin afectar el resto del sistema.
 *
 * Ejemplo de uso:
 * const service = BalanceServiceRegistry.get(Protocol.EVM);
 * const balances = await service.getWalletBalances("0x...");
 */
