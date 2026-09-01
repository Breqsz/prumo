export function CaseBlock({ title, body }: { title: string; body?: string }) {
  if (!body || !body.trim()) return null;
  return (
    <div>
      <h2 className="font-display text-3xl tracking-tight text-white md:text-4xl">
        {title}
      </h2>
      <p className="mt-6 text-base leading-relaxed text-white/70 md:text-lg">
        {body}
      </p>
    </div>
  );
}
