import { getServiceStatus } from "@/src/service";

const plans = [
  ["Free", "$0", "100K queries/mo", "10/s"],
  ["Pro", "$99", "10M queries/mo", "50/s"],
  ["Enterprise", "$999+", "Custom queries", "Custom"],
] as const;

export default function HomePage() {
  const status = getServiceStatus();

  return (
    <main className="grid">
      <section className="hero">
        <div className="eyebrow">Kite Mainnet data API</div>
        <h1>KiteIndex Pro</h1>
        <p className="lead">
          Production API shell for transfers, bridge activity, staking data, and usage billing.
          This deployment is live, but endpoint data is disabled until real indexer connector URLs
          are configured.
        </p>
        <a className="button" href="/api/v1/transfers?api_key=demo">
          Test transfers endpoint
        </a>
      </section>

      <section className="grid cards">
        <Stat label="Data status" value={status.data_status === "connected" ? "Live" : "Connectors required"} />
        <Stat label="Connected endpoints" value={`${status.connected_endpoints}/${status.total_endpoints}`} />
        <Stat label="Auth" value="API key" note="Every data endpoint requires X-API-Key or api_key." />
        <Stat label="Missing envs" value={String(status.missing_integrations.length)} note={status.missing_integrations.join(", ")} />
      </section>

      <section className="card notice">
        <h2>Live indexer required</h2>
        <p className="note">
          Empty placeholder arrays are disabled. Set the endpoint env vars below to connect the
          API to a real KiteIndex data source.
        </p>
      </section>

      <section className="grid cards">
        {status.endpoints.map((endpoint) => (
          <div className="card" key={endpoint.name}>
            <div className="card-label">{endpoint.path}</div>
            <div className="metric">{endpoint.connected ? "Connected" : "Needs API"}</div>
            <p className="note">{endpoint.description}</p>
            <p className="note mono">{endpoint.env}</p>
          </div>
        ))}
      </section>

      <section className="grid plans">
        {plans.map(([name, price, quota, rate]) => (
          <div className="card" key={name}>
            <div className="card-label">{name}</div>
            <div className="metric">{price}</div>
            <p className="note">{quota}</p>
            <p className="note">Rate limit: {rate}</p>
          </div>
        ))}
      </section>
    </main>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="card">
      <div className="card-label">{label}</div>
      <div className="metric">{value}</div>
      {note && <p className="note">{note}</p>}
    </div>
  );
}
