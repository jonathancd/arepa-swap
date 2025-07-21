"use client";

import { useMediaQuery } from "@/hooks/useMediaQuery";
import { TokenSelectorDrawer } from "../drawer/TokenSelectorDrawer";
import { TokenSelectorDialog } from "../modal/TokenSelectorDialog";
import { useEffect, useState } from "react";
import { ITokenSelectorProps } from "../../types/ITokenSelector";

function useIsClient() {
  const [isClient, setIsClient] = useState(false);
  useEffect(() => setIsClient(true), []);
  return isClient;
}

export function TokenSelectorManager({ open, ...props }: ITokenSelectorProps) {
  const isClient = useIsClient();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const sharedProps = {
    ...props,
    open,
    isMobile,
  };

  if (!open) if (!isClient) return <div />;

  return isMobile ? (
    <TokenSelectorDrawer {...sharedProps} />
  ) : (
    <TokenSelectorDialog {...sharedProps} />
  );
}
