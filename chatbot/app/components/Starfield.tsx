export default function Starfield() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 opacity-50 animate-[drift_160s_linear_infinite]" style={{
        backgroundImage: `radial-gradient(2px 2px at 20px 30px, rgba(255,255,255,0.8) 50%, transparent 51%),
          radial-gradient(1.5px 1.5px at 120px 80px, rgba(255,255,255,0.6) 50%, transparent 51%),
          radial-gradient(1.5px 1.5px at 200px 150px, rgba(255,255,255,0.6) 50%, transparent 51%),
          radial-gradient(2px 2px at 350px 220px, rgba(255,255,255,0.8) 50%, transparent 51%)`,
        backgroundRepeat: 'repeat',
        width: '200%',
        height: '200%'
      }} />
      <div className="absolute inset-0 opacity-40 animate-[drift_220s_linear_infinite_reverse]" style={{
        backgroundImage: `radial-gradient(1.5px 1.5px at 80px 120px, rgba(255,255,255,0.5) 50%, transparent 51%),
          radial-gradient(2px 2px at 300px 50px, rgba(255,255,255,0.7) 50%, transparent 51%),
          radial-gradient(2px 2px at 500px 200px, rgba(255,255,255,0.7) 50%, transparent 51%)`,
        backgroundRepeat: 'repeat',
        width: '200%',
        height: '200%'
      }} />
      <div className="absolute inset-0 opacity-35 animate-[drift_300s_linear_infinite]" style={{
        backgroundImage: `radial-gradient(1.5px 1.5px at 150px 200px, rgba(255,255,255,0.5) 50%, transparent 51%),
          radial-gradient(2px 2px at 420px 100px, rgba(255,255,255,0.7) 50%, transparent 51%),
          radial-gradient(1.5px 1.5px at 650px 300px, rgba(255,255,255,0.6) 50%, transparent 51%)`,
        backgroundRepeat: 'repeat',
        width: '200%',
        height: '200%'
      }} />
    </div>
  );
}


