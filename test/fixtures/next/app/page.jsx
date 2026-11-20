export default function Page() {
  return (
    <div id="probe" className="bg-background text-foreground rounded-md font-sans">
      probe
      <p id="probe-muted" className="text-muted">muted</p>
      <p id="probe-accent" className="bg-accent text-accent-foreground rounded-lg font-mono">accent</p>
      <p id="probe-sm" className="rounded-sm border border-border">small</p>
    </div>
  );
}
