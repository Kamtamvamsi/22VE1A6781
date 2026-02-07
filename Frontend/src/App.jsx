import { useMemo, useState } from 'react';
import './App.css';

const CLASSIFICATIONS = ['Public', 'Internal', 'Confidential', 'Restricted'];

const INITIAL_DATASETS = [
  {
    id: 'ds-101',
    name: 'Customer Profiles',
    owner: 'Data Steward Team',
    classification: 'Restricted',
    retentionDays: 365,
    encryptedAtRest: true,
    pii: true
  },
  {
    id: 'ds-102',
    name: 'Website Analytics',
    owner: 'Marketing Ops',
    classification: 'Internal',
    retentionDays: 180,
    encryptedAtRest: true,
    pii: false
  }
];

const INITIAL_REQUESTS = [
  {
    id: 'req-01',
    requester: 'analyst@company.com',
    dataset: 'Customer Profiles',
    purpose: 'Monthly churn analysis',
    mfaVerified: true,
    status: 'Pending'
  },
  {
    id: 'req-02',
    requester: 'intern@company.com',
    dataset: 'Website Analytics',
    purpose: 'Dashboard QA',
    mfaVerified: false,
    status: 'Pending'
  }
];

function safeText(value) {
  return value.replace(/[<>]/g, '').trim();
}

function App() {
  const [datasets, setDatasets] = useState(INITIAL_DATASETS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);
  const [auditLogs, setAuditLogs] = useState([
    'Policy baseline loaded (encryption, MFA, least privilege).',
    'DLP monitor enabled for Restricted data exports.'
  ]);
  const [form, setForm] = useState({
    name: '',
    owner: '',
    classification: 'Internal',
    retentionDays: 90,
    pii: false,
    encryptedAtRest: true
  });
  const [error, setError] = useState('');

  const metrics = useMemo(() => {
    const encryptedCount = datasets.filter((d) => d.encryptedAtRest).length;
    const piiCount = datasets.filter((d) => d.pii).length;
    const pendingAccess = requests.filter((r) => r.status === 'Pending').length;

    const score = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          (encryptedCount / datasets.length) * 45 +
            ((datasets.length - piiCount) / datasets.length) * 20 +
            ((requests.length - pendingAccess) / requests.length) * 35
        )
      )
    );

    return { encryptedCount, piiCount, pendingAccess, score };
  }, [datasets, requests]);

  function appendAuditLog(message) {
    setAuditLogs((prev) => [`${new Date().toLocaleString()}: ${message}`, ...prev]);
  }

  function handleFormChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function handleCreateDataset(event) {
    event.preventDefault();
    const name = safeText(form.name);
    const owner = safeText(form.owner);
    const retentionDays = Number(form.retentionDays);

    if (!name || !owner) {
      setError('Dataset name and owner are required.');
      return;
    }

    if (!Number.isInteger(retentionDays) || retentionDays < 30 || retentionDays > 3650) {
      setError('Retention must be between 30 and 3650 days.');
      return;
    }

    const id = `ds-${Date.now()}`;
    const newDataset = {
      id,
      name,
      owner,
      classification: form.classification,
      retentionDays,
      pii: form.pii,
      encryptedAtRest: form.encryptedAtRest
    };

    setDatasets((prev) => [...prev, newDataset]);
    setError('');
    appendAuditLog(`Dataset ${name} registered by ${owner} with ${form.classification} classification.`);
    setForm({
      name: '',
      owner: '',
      classification: 'Internal',
      retentionDays: 90,
      pii: false,
      encryptedAtRest: true
    });
  }

  function handleRequestDecision(id, decision) {
    setRequests((prev) =>
      prev.map((request) => {
        if (request.id !== id || request.status !== 'Pending') return request;
        const status = decision === 'approve' && request.mfaVerified ? 'Approved' : 'Denied';
        appendAuditLog(`Access ${status.toLowerCase()} for ${request.requester} (${request.dataset}).`);
        return { ...request, status };
      })
    );
  }

  return (
    <main className="governance-shell">
      <header className="hero">
        <h1>Data Governance & Security Module</h1>
        <p>
          Reference module covering data cataloging, classification, retention governance,
          encryption controls, MFA-aware access workflows, and immutable audit logging.
        </p>
      </header>

      <section className="metrics-grid">
        <article>
          <h3>Governance score</h3>
          <p className="metric-value">{metrics.score}%</p>
        </article>
        <article>
          <h3>Encrypted datasets</h3>
          <p className="metric-value">{metrics.encryptedCount}/{datasets.length}</p>
        </article>
        <article>
          <h3>PII datasets</h3>
          <p className="metric-value">{metrics.piiCount}</p>
        </article>
        <article>
          <h3>Pending access requests</h3>
          <p className="metric-value">{metrics.pendingAccess}</p>
        </article>
      </section>

      <section className="module-grid">
        <article className="card">
          <h2>Register Dataset</h2>
          <form className="dataset-form" onSubmit={handleCreateDataset}>
            <input name="name" value={form.name} onChange={handleFormChange} placeholder="Dataset name" maxLength={60} />
            <input name="owner" value={form.owner} onChange={handleFormChange} placeholder="Data owner" maxLength={60} />
            <select name="classification" value={form.classification} onChange={handleFormChange}>
              {CLASSIFICATIONS.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <input
              type="number"
              name="retentionDays"
              value={form.retentionDays}
              onChange={handleFormChange}
              min="30"
              max="3650"
            />
            <label>
              <input type="checkbox" name="pii" checked={form.pii} onChange={handleFormChange} /> Contains PII
            </label>
            <label>
              <input
                type="checkbox"
                name="encryptedAtRest"
                checked={form.encryptedAtRest}
                onChange={handleFormChange}
              />
              Encryption at rest enabled
            </label>
            <button type="submit">Add dataset</button>
            {error && <p className="error">{error}</p>}
          </form>
        </article>

        <article className="card">
          <h2>Data Catalog</h2>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Owner</th>
                  <th>Class</th>
                  <th>Retention</th>
                  <th>Security</th>
                </tr>
              </thead>
              <tbody>
                {datasets.map((dataset) => (
                  <tr key={dataset.id}>
                    <td>{dataset.name}</td>
                    <td>{dataset.owner}</td>
                    <td>{dataset.classification}</td>
                    <td>{dataset.retentionDays}d</td>
                    <td>{dataset.encryptedAtRest ? 'Encrypted' : 'At Risk'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="card">
          <h2>Access Governance (RBAC + MFA)</h2>
          {requests.map((request) => (
            <div key={request.id} className="request">
              <div>
                <strong>{request.requester}</strong>
                <p>{request.dataset} — {request.purpose}</p>
                <small>MFA: {request.mfaVerified ? 'Verified' : 'Missing'} | Status: {request.status}</small>
              </div>
              <div className="request-actions">
                <button onClick={() => handleRequestDecision(request.id, 'approve')} disabled={request.status !== 'Pending'}>
                  Approve
                </button>
                <button onClick={() => handleRequestDecision(request.id, 'deny')} disabled={request.status !== 'Pending'} className="danger">
                  Deny
                </button>
              </div>
            </div>
          ))}
        </article>

        <article className="card">
          <h2>Security Controls</h2>
          <ul>
            <li>Least privilege policy enforced at role level.</li>
            <li>Field-level masking for sensitive identifiers.</li>
            <li>Key rotation target: every 90 days.</li>
            <li>Data loss prevention alerts for export anomalies.</li>
            <li>TLS 1.3 required for all in-transit data flows.</li>
          </ul>
        </article>

        <article className="card wide">
          <h2>Audit Trail</h2>
          <div className="audit-log">
            {auditLogs.map((entry, index) => (
              <p key={`${entry}-${index}`}>{entry}</p>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}

export default App;
