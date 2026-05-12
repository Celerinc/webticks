/**
 * @webticks/appinsights
 * Sends webticks batches to Azure Application Insights via the Track v2 ingestion API.
 * No SDK dependency — raw fetch only.
 */

/**
 * Parse an App Insights connection string into its key/value pairs.
 * Connection string format: "InstrumentationKey=xxx;IngestionEndpoint=https://...;..."
 * Note: InstrumentationKey values may contain '=' (base64), so we split on ';' first,
 * then split each segment on the FIRST '=' only.
 *
 * @param {string} connectionString
 * @returns {{ InstrumentationKey?: string, IngestionEndpoint?: string, [key: string]: string }}
 */
function parseConnectionString(connectionString) {
  const result = {};
  for (const segment of connectionString.split(';')) {
    const eqIdx = segment.indexOf('=');
    if (eqIdx > 0) {
      result[segment.slice(0, eqIdx).trim()] = segment.slice(eqIdx + 1).trim();
    }
  }
  return result;
}

export class AppInsightsDestination {
  name = 'appinsights';

  /**
   * @param {object} options
   * @param {string} options.connectionString - Azure App Insights connection string
   *   (found under "Overview" → "Connection String" in the Azure portal)
   */
  constructor({ connectionString }) {
    if (!connectionString) {
      throw new Error('[webticks/appinsights] connectionString is required');
    }

    const parts = parseConnectionString(connectionString);
    this.iKey = parts['InstrumentationKey'];

    if (!this.iKey) {
      throw new Error('[webticks/appinsights] could not parse InstrumentationKey from connectionString');
    }

    // IngestionEndpoint may or may not have a trailing slash
    const ingestionBase = (parts['IngestionEndpoint'] || 'https://dc.services.visualstudio.com')
      .replace(/\/$/, '');
    this.endpoint = `${ingestionBase}/v2/track`;
  }

  /**
   * Map a single webticks event to an App Insights envelope.
   *
   * @param {import('@webticks/core').WebticksEvent} event
   * @param {string | null} uid
   * @param {string} sessionId
   * @returns {object} App Insights telemetry envelope
   */
  _toEnvelope(event, uid, sessionId) {
    const isPageView = event.type === 'pageview';
    const eventName = isPageView
      ? (event.path || '/')
      : (event.name || event.type);

    const properties = {
      uid: uid || 'anonymous',
      sessionId,
      ...(event.path ? { path: event.path } : {}),
      ...(event.customType ? { eventType: event.customType } : {}),
      ...(event.method ? { method: event.method } : {}),
      ...(event.details || {}),
    };

    return {
      name: `Microsoft.ApplicationInsights.${this.iKey}.${isPageView ? 'Pageview' : 'Event'}`,
      time: event.timestamp,
      iKey: this.iKey,
      tags: {
        'appInsights.userId': uid || 'anonymous',
        'appInsights.sessionId': sessionId,
      },
      data: {
        baseType: isPageView ? 'PageViewData' : 'EventData',
        baseData: {
          ver: 2,
          name: eventName,
          ...(isPageView ? { url: event.path || '/' } : {}),
          properties,
        },
      },
    };
  }

  /**
   * Send a batch of events to App Insights.
   * @param {import('@webticks/core').WebTicksBatch} batch
   */
  async send(batch) {
    if (!batch.events.length) return;

    const envelopes = batch.events.map(e =>
      this._toEnvelope(e, batch.uid, batch.sessionId)
    );

    const res = await fetch(this.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(envelopes),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`[webticks/appinsights] ingestion failed ${res.status}: ${body}`);
    }
  }
}

export default AppInsightsDestination;
