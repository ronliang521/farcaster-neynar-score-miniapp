interface Window {
  farcaster?: {
    connectWallet?: () => Promise<string | null>;
    connectUser?: () => Promise<{ fid: number } | null>;
    user?: {
      fid?: number;
      fidNumber?: number;
    };
    cast?: (options: { text: string }) => Promise<void>;
    publishCast?: (options: { text: string }) => Promise<void>;
    openCastComposer?: (options: { text?: string; embeds?: Array<{ url: string }> }) => void;
  };
  ethereum?: {
    request: (options: { method: string; params?: any[] }) => Promise<any>;
  };
  solana?: {
    connect?: () => Promise<{ publicKey: { toString: () => string } }>;
  };
}

