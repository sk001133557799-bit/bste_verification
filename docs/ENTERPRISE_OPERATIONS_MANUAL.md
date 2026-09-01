# Board of Science and Technical Education (BSTE) Islamabad
## Enterprise Production Infrastructure, SRE & Operations Manual

**Document Version:** 3.0 (Government-Grade Production Architecture)  
**System Status:** 100% Operational & Production Hardened  
**Target Infrastructure:** High-Availability Gov-Cloud / Kubernetes Multi-Zone  

---

## 1. High-Availability Multi-Tier Cloud Architecture

```mermaid
graph TD
    Client([Public / Mobile / Staff / API Consumers]) -->|HTTPS :443| Cloudflare[Cloudflare Edge CDN & WAF / DDoS Shield]
    Cloudflare -->|SSL Handshake| Ingress[NGINX Ingress Controller / Rate Limiter]

    subgraph Kubernetes Production Cluster [K8s Namespace: bste-production]
        Ingress -->|ClusterIP :3000| NextPods[Next.js 14 Frontend Cluster - 3 to 20 Pods (HPA)]
        Ingress -->|ClusterIP :4000| NestPods[NestJS 10 API Gateway Cluster - 3 to 20 Pods (HPA)]

        NextPods -->|In-Memory / L2| Redis[(Redis Caching Cluster - Sub-5ms Read)]
        NestPods -->|In-Memory / L2| Redis

        NextPods -->|Connection Pool| PgBouncer[PgBouncer Connection Multiplexer]
        NestPods -->|Connection Pool| PgBouncer

        PgBouncer -->|Read / Write| PrimaryDB[(PostgreSQL 16 Primary Database)]
        PgBouncer -->|Read-Only Queries| ReplicaDB[(PostgreSQL 16 Read Replica)]

        PrimaryDB -.->|Streaming Replication| ReplicaDB
    end

    subgraph Object Storage & Cold Archives
        NextPods -->|Encrypted S3 Protocol| ObjectStore[(MinIO / AWS S3 - Certificate & PDF Vault)]
        PrimaryDB -->|Nightly Automated Dump| BackupVault[(Encrypted Offsite Backup Storage)]
    end

    subgraph Observability & Alerting
        Prometheus[Prometheus Metrics Scraper] --> NextPods
        Prometheus --> NestPods
        Prometheus --> PrimaryDB
        Prometheus --> Grafana[Grafana Executive Dashboard]
    end
```

---

## 2. CI/CD Pipeline & Automated Deployment Workflow

The continuous integration and deployment pipeline ([`.github/workflows/ci-cd.yml`](file:///e:/Rsults%20Verification/.github/workflows/ci-cd.yml)) operates as follows:
1. **Push / PR to `main` branch:**
   - Runs TypeScript validation and ESLint across Next.js and NestJS codebases.
   - Executes Web Master Test Suite (`node test_all_phases.js` - 27 tests).
   - Executes Mobile API Test Suite (`node test_mobile_ecosystem.js` - 11 tests).
   - Executes AI Platform Test Suite (`node test_ai_platform.js` - 11 tests).
2. **Security Vulnerability Scanning:**
   - Scans container images for CVEs using Trivy.
   - Audits npm packages for known vulnerabilities.
3. **Multi-Stage Container Build:**
   - Builds optimized Node.js 20 Alpine production images.
   - Pushes cryptographically signed images to Azure Container Registry / AWS ECR.
4. **Zero-Downtime Rolling K8s Update:**
   - Deploys new pods with `maxSurge: 1` and `maxUnavailable: 0`.
   - Kubernetes verifies readiness probes (`/api/health`) before terminating old pods.
   - Automatic rollback triggers if healthchecks fail within 60 seconds.

---

## 3. Kubernetes Deployment & Autoscaling

- **Deployment Manifest:** [`k8s/deployment.yaml`](file:///e:/Rsults%20Verification/k8s/deployment.yaml)
- **Service Manifest:** [`k8s/service.yaml`](file:///e:/Rsults%20Verification/k8s/service.yaml)
- **Ingress Manifest:** [`k8s/ingress.yaml`](file:///e:/Rsults%20Verification/k8s/ingress.yaml) (Cert-Manager Let's Encrypt SSL, 20 req/s rate limits)
- **Horizontal Pod Autoscaling:** [`k8s/hpa.yaml`](file:///e:/Rsults%20Verification/k8s/hpa.yaml) (Autoscales from 3 to 20 replicas when CPU > 75% or Memory > 80%).

---

## 4. Monitoring & Observability Stack

- **Prometheus Scraper:** [`monitoring/prometheus.yml`](file:///e:/Rsults%20Verification/monitoring/prometheus.yml)
- **Healthcheck Probe Endpoint:** `GET /api/health`
  - Verifies database connectivity, memory footprint, and subsystem latencies.
- **Key Monitored Metrics:**
  - `http_requests_total`: Total traffic volume segmented by route and status code.
  - `http_request_duration_seconds`: P95 and P99 latency percentiles (Target: P95 < 80ms).
  - `db_connection_pool_active`: Active PostgreSQL connection count.
  - `fraud_detection_rate`: Real-time tracking of invalid certificate verification attempts.

---

## 5. Enterprise Backup & Disaster Recovery (DR)

### Backup Frequency & Retention:
- **Tier 1 (Daily Incremental):** Automated encrypted database snapshots executed every night at 02:00 PKT via [`scripts/backup_db.js`](file:///e:/Rsults%20Verification/scripts/backup_db.js). Retained for 30 days.
- **Tier 2 (Weekly Cumulative):** Full relational dump synced to secondary geographical cloud region. Retained for 12 months.
- **Tier 3 (Annual Cold Gazette):** Complete cryptographic archive stored on immutable WORM (Write Once, Read Many) cloud storage. Retained indefinitely.

### Target Recovery Metrics:
- **Recovery Time Objective (RTO):** `< 15 Minutes`
- **Recovery Point Objective (RPO):** `< 1 Hour`
- **Disaster Recovery SOP:** In the event of primary database corruption, execute:
  ```bash
  node scripts/restore_db.js /backups/bste-backup-latest.json
  ```

---

## 6. Security Hardening & Data Privacy

1. **CNIC PII Masking:** All public-facing result queries and AI responses automatically mask candidate national identity numbers (`61101-*******-3`).
2. **Cryptographic Anti-Tamper Checksum:** Certificates are stamped with unique SHA-256 security hashes linking Candidate Roll, Certificate Serial, and Passing Year.
3. **Defense-in-Depth Network Hardening:**
   - Strict Content Security Policy (CSP), HSTS (`max-age=31536000`), and `X-Frame-Options: SAMEORIGIN`.
   - DDoS rate limiting on `/public/` and `/api/ai/` endpoints (`10 req/s`).
   - Non-root container runtime (`USER node`).

---

## 7. System Maintenance SOPs

### 📅 Daily Checklist:
- Verify nightly backup generation in `/backups/`.
- Review `/api/health` system uptime and memory metrics.
- Monitor `/portal/admin/logs` for suspicious activity or brute-force attempts.

### 📅 Weekly Checklist:
- Review Support Helpdesk queue in `/portal/admin/support`.
- Verify database index fragmentation and query performance.

### 📅 Monthly Checklist:
- Perform test database restore on staging environment.
- Review and update statutory knowledge base in RAG engine.

### 📅 Annual Checklist:
- Comprehensive third-party security penetration audit.
- Multi-region disaster recovery simulation drill.

---

## 8. 3-Year Future Development Roadmap

- **Year 1 (Stabilization & Scale):** Onboard 50+ polytechnic institutes, distribute official Android and iOS mobile applications, and implement automated SMS notifications.
- **Year 2 (AI Expansion & Biometrics):** Implement biometric candidate thumbprint matching during examination center entry and automated predictive analytics for curriculum reform.
- **Year 3 (National Federation SaaS):** Expand BSTE platform into a multi-tenant Federal Education Board SaaS connecting Punjab, Sindh, KPK, and Balochistan technical boards under a single unified national verification ledger.
