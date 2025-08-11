export const dynamic = 'force-static';
export default function Offline() {
  return (
    <div className="concave" style={{ padding: 16 }}>
      <h1>Offline</h1>
      <p>This is the offline fallback. Cached content will continue to work.</p>
    </div>
  );
}
