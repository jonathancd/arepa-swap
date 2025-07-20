"use client";

import { useEffect } from "react";
import { useDefaultProtocol } from "@/features/protocols/hooks/useDefaultProtocol";
import { useDefaultNetwork } from "@/features/network/hooks/useDefaultNetwork";
import { useRestoreWallet } from "@/features/wallet/hooks/useRestoreWallet";
import { useWalletOverview } from "@/features/wallet/hooks/useWalletOverview";
import { useWalletBalanceSync } from "@/features/wallet/hooks/useWalletBalanceSync";
import { useSyncNetworkWithWallet } from "@/features/network/hooks/useSyncNetworkWithWallet";
import { useSwapDefaults } from "@/features/swap/hooks/useSwapDefaults";
import { usePushNotification } from "@/features/push-notifications/usePushNotification";
import { useInitializationStore } from "@/stores/initializationStore";

export function AppInitializer() {
  const {
    currentStep,
    protocolInitialized,
    networkInitialized,
    walletRestored,
    isReady,
  } = useInitializationStore();

  // 1. Inicializar protocolo y red por defecto
  useDefaultProtocol();
  useDefaultNetwork();

  // 2. Restaurar wallet (espera a que protocolo y red estén listos)
  useRestoreWallet();

  // 3. Sincronizar wallet con red
  useSyncNetworkWithWallet();

  // 4. Cargar datos del wallet
  useWalletOverview();
  useWalletBalanceSync();

  // 5. Inicializar swap (espera a que todo esté listo)
  useSwapDefaults();

  // 6. Inicializar notificaciones push
  usePushNotification();

  // Logs de coordinación
  useEffect(() => {
    console.log("[AppInitializer] Initialization state:", {
      currentStep,
      protocolInitialized,
      networkInitialized,
      walletRestored,
      isReady: isReady(),
    });
  }, [
    currentStep,
    protocolInitialized,
    networkInitialized,
    walletRestored,
    isReady,
  ]);

  // Mostrar loading mientras se inicializa
  // if (!isReady()) {
  //   return (
  //     <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
  //       <div className="text-center space-y-4">
  //         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
  //         <p className="text-sm text-muted-foreground">
  //           Initializing... {currentStep}
  //         </p>
  //       </div>
  //     </div>
  //   );
  // }

  return null;
}
