import type { WebticksDestination, WebTicksBatch, WebticksEvent } from '@webticks/core';

export interface AppInsightsOptions {
  /**
   * Azure Application Insights connection string.
   * Found under: Azure Portal → your App Insights resource → Overview → Connection String
   *
   * @example
   * "InstrumentationKey=abc123;IngestionEndpoint=https://westeurope-5.in.applicationinsights.azure.com/"
   */
  connectionString: string;
}

/**
 * Sends webticks batches to Azure Application Insights via the Track v2 ingestion API.
 * No SDK dependency — uses raw fetch.
 *
 * @example
 * import WebticksAnalytics from '@webticks/next';
 * import { AppInsightsDestination } from '@webticks/appinsights';
 *
 * <WebticksAnalytics
 *   destinations={[
 *     new AppInsightsDestination({
 *       connectionString: process.env.NEXT_PUBLIC_APPINSIGHTS_CONNECTION_STRING!,
 *     }),
 *   ]}
 * />
 */
export declare class AppInsightsDestination implements WebticksDestination {
  name: 'appinsights';
  readonly iKey: string;
  readonly endpoint: string;

  constructor(options: AppInsightsOptions);
  send(batch: WebTicksBatch): Promise<void>;
}

export default AppInsightsDestination;
