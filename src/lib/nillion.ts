import config from "@/config";
import { NamedNetwork } from "@nillion/client-core";
import { createSignerFromKey } from "@nillion/client-payments";
import { NillionClient } from "@nillion/client-vms";

export const nillionClientInstance = NillionClient.create({
  network: NamedNetwork.enum.Photon,

  overrides: async () => {
    const signer = await createSignerFromKey(config.nillion.chain.keys[0]);
    return {
      endpoint: `${window.location.origin}/nilchain-proxy`,
      signer,
      userSeed: "test-key",
    };
  },
});

// const test = async () => {
//   try {
//     await nillionClientInstance.connect();
//     console.log("Connected to Nillion client");
//   } catch (error) {
//     console.error("Error connecting to Nillion client:", error);
//   }
// };

// // Only run the test function if we're in a browser environment
// if (typeof window !== "undefined") {
//   test();
// }
