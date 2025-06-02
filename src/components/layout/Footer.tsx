export function Footer() {
  return (
    <footer className="w-full border-t bg-background mt-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 text-sm text-muted-foreground text-center">
        © {new Date().getFullYear()} Arepa Swap. All rights reserved.
      </div>
    </footer>
  );
}
