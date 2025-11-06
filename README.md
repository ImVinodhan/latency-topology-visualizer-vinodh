# Latency Topology Visualizer

This project is a **3D latency visualization tool** built using **Next.js**, designed to display cryptocurrency exchange server locations and their latency topology across AWS, GCP, and Azure cloud regions.

The application provides an interactive 3D globe where users can:
- View **exchange server geo-locations**
- Observe **simulated real-time latency arcs**
- Inspect **historical latency trends**
- Filter and analyze based on **cloud provider, exchange, and latency thresholds**
- Monitor **system performance metrics** in real-time (FPS, memory, CPU load)


##  Features Implemented

### 1. **3D World Map Display**
- Interactive **3D globe** using `react-globe.gl`
- Supports rotation, zoom, and pan
- Smooth orbit controls and camera transitions

### 2. **Exchange Server Location Visualization**
- Major exchange servers plotted (OKX, Binance, Deribit, Bybit, etc.)
- Hover tooltip shows:
  - Exchange name
  - Cloud provider
- Color-coded based on cloud.

### 3. **Real-Time Latency Visualization**
- Latency arcs animated between cloud regions & exchanges
- Arc color varies with latency intensity:
  - `Green` → Low latency
  - `Yellow` → Moderate
  - `Red` → High

> **Note:**  
> Due to API rate limits and restricted network policies, this project uses **simulated latency generation**. The structure supports replacing it with Cloudflare Radar API easily in the future.

### 4. **Historical Latency Trends**
- Time-series latency charts implemented using `recharts`
- Tracks latency over time while interacting
- Displays:
  - **Min latency**
  - **Max latency**
  - **Average latency**
- Time selectors: `1h | 24h | 7d | 30d`

### 5. **Cloud Provider Regions**
- Region presence visualized through grouped markers
- Ability to toggle cloud regions layer on/off

### 6. **Interactive Controls Panel**
- Filter by cloud provider
- Filter by exchange
- Search bar to quickly locate exchanges
- Latency threshold slider

### 7. **Performance Metrics Dashboard**
Displayed in UI (bottom-left):
- FPS (Frames Per Second)
- Frame time
- CPU core count
- JS heap usage (when supported by browser)

### 8. **Responsive Design**
- Fully optimized for desktops
- Graceful scaling on smaller screens

---

## Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | Next.js (App Router) + TypeScript |
| 3D Globe | `react-globe.gl` + `three.js` |
| Charts | `recharts` |
| State Management | React Context (Latency Context) |
| Styling | TailwindCSS |

---

## How to Run Locally

```bash
git clone https://github.com/ImVinodhan/latency-topology-visualizer-vinodh.git
cd latency-topology-visualizer-vinodh
npm install
npm run dev

```
## Designed & Developed By

Vinodhan G
GitHub: https://github.com/ImVinodhan
