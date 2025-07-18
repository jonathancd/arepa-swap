import { useDefaultProtocol } from "@/features/wallet/hooks/useDefaultProtocol";
import { useDefaultNetwork } from "@/features/network/hooks/useDefaultNetwork";

export function AppInitializer() {
  useDefaultProtocol();
  useDefaultNetwork();
  return null;
}
