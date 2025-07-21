import { IToken } from "./IToken";

export interface ITokenSelectorProps {
  open: boolean;
  isConnected: boolean;
  isMobile?: boolean;
  editingField: "in" | "out" | null;
  currentFromToken: IToken | null;
  currentToToken: IToken | null;
  onClose: () => void;
  onSelect: (token: IToken) => void;
  onSwapTokens: () => void;
}
