import crypto from "crypto";
import { Axios, create as createAxios } from "axios";

const BASE_URL = "https://api.cryptomus.com/v1";

/**
 * Configuration for CryptomusClient
 */
export interface CryptomusConfig {
  /** Your Cryptomus API key */
  apiKey: string;

  /** Your Cryptomus merchant ID */
  merchantId: string;

  /**
   * Optional custom base URL
   * Use this if Cryptomus changes API endpoint or for sandbox
   */
  baseURL?: string;
}

/**
 * Cryptomus SDK Client
 */
export class CryptomusClient {
  private apiKey: string;
  private merchantId: string;
  private baseURL: string;
  private axios: Axios;

  constructor({ apiKey, merchantId, baseURL }: CryptomusConfig) {
    if (!apiKey || !merchantId) {
      throw new Error("CryptomusClient: apiKey and merchantId are required");
    }

    this.apiKey = apiKey;
    this.merchantId = merchantId;
    this.baseURL = baseURL ?? BASE_URL;

    this.axios = createAxios({
      baseURL: this.baseURL,
    });

    this.axios.interceptors.request.use((config) => {
      config.headers.merchant = this.merchantId;
      config.headers.sign = this.sign(config.data);
      return config;
    });
  }

  sign(body: any) {
    const base64Body = Buffer.from(body).toString("base64");
    const sign = crypto
      .createHash("md5")
      .update(base64Body + this.apiKey)
      .digest("hex");
    return sign;
  }

  createInvoice({
    amount,
    currency,
    order_id,
  }: {
    amount: number;
    order_id: string;
    currency: string;
  }) {
    return this.axios.post("/payment", {
      amount,
      order_id,
      currency: currency ?? "USD",
    });
  }


  



}


