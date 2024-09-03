import * as nillion from "@nillion/client-web";
import { DirectSecp256k1Wallet, Registry } from "@cosmjs/proto-signing";
import { GasPrice, SigningStargateClient } from "@cosmjs/stargate";
import { MsgPayFor, typeUrl } from "@nillion/client-web/proto";
import config from "@/config";

// async function transformNadaProgramToUint8Array(
//   filePath: string
// ): Promise<Uint8Array> {
//   const response = await fetch(filePath);
//   const arrayBuffer = await response.arrayBuffer();
//   return new Uint8Array(arrayBuffer);
// }

export async function createNillionClient(
  userKey: string,
  nodeKeySeed?: string
): Promise<nillion.NillionClient> {
  await nillion.default();
  const uk = nillion.UserKey.from_base58(userKey);
  const nodeKey = nillion.NodeKey.from_seed(nodeKeySeed || "");
  const client = new nillion.NillionClient(
    uk,
    nodeKey,
    config.nillion.bootnodes
  );
  return client;
}

export async function getQuote(
  client: nillion.NillionClient,
  // programName: string,
  programBinary: Uint8Array
): Promise<nillion.PriceQuote> {
  // const programBinary = await transformNadaProgramToUint8Array(
  //   `./programs/${programName}.nada.bin`
  // );
  if (!programBinary) {
    throw new Error("Program binary is null");
  }

  const operation = nillion.Operation.store_program(programBinary);
  return await client.request_price_quote(config.nillion.clusterId, operation);
}

export async function payAndStoreProgram(
  client: nillion.NillionClient,
  programName: string,
  programBinary: Uint8Array | null,
  quote: nillion.PriceQuote
): Promise<void> {
  if (!programBinary) {
    throw new Error("Program binary is null");
  }

  const [nilChainClient, nilChainWallet] =
    await createNilChainClientAndWalletFromPrivateKey();
  const paymentReceipt = await payWithWalletFromPrivateKey(
    nilChainClient,
    nilChainWallet,
    quote
  );
  await client.store_program(
    config.nillion.clusterId,
    programName,
    programBinary,
    paymentReceipt
  );
}

async function createNilChainClientAndWalletFromPrivateKey(): Promise<
  [SigningStargateClient, DirectSecp256k1Wallet]
> {
  const key = Uint8Array.from(
    config.nillion.chain.keys[0]
      .match(/.{1,2}/g)!
      .map((byte) => parseInt(byte, 16))
  );
  const wallet = await DirectSecp256k1Wallet.fromKey(key, "nillion");

  const registry = new Registry();
  registry.register(typeUrl, MsgPayFor);

  const options = {
    registry,
    gasPrice: GasPrice.fromString("0.0unil"),
  };

  const client = await SigningStargateClient.connectWithSigner(
    config.nillion.chain.endpoint,
    wallet,
    options
  );
  return [client, wallet];
}

async function payWithWalletFromPrivateKey(
  nilChainClient: SigningStargateClient,
  wallet: DirectSecp256k1Wallet,
  quoteInfo: any
): Promise<nillion.PaymentReceipt> {
  const { quote } = quoteInfo;
  const denom = "unil";
  const [account] = await wallet.getAccounts();
  const from = account.address;

  const payload: MsgPayFor = {
    fromAddress: from,
    resource: quote.nonce,
    amount: [{ denom, amount: quote.cost.total }],
  };

  const result = await nilChainClient.signAndBroadcast(
    from,
    [{ typeUrl, value: payload }],
    "auto"
  );
  return new nillion.PaymentReceipt(quote, result.transactionHash);
}
