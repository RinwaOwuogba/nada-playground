const config = {
  nillion: {
    clusterId: import.meta.env.VITE_NILLION_CLUSTER_ID || "",
    bootnodes: [import.meta.env.VITE_NILLION_BOOTNODE_WEBSOCKET || ""],
    chain: {
      endpoint: `${window.location.origin}/nilchain-proxy`,
      keys: [import.meta.env.VITE_NILLION_NILCHAIN_PRIVATE_KEY || ""],
    },
    userKey: import.meta.env.VITE_NILLION_USER_KEY || "",
  },
};

export default config;
