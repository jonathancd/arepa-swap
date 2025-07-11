import { INetwork } from "@/features/protocols/types/INetwork";

export interface INetworkSelectorProps extends INetworkSelectorLayoutProps {
  open: boolean;
  onOpenChange: () => void;
}

export interface INetworkSelectorLayoutProps {
  isMobile: boolean;
  networks: INetwork[];
  handleSelect: (networkId: number) => void;
}
