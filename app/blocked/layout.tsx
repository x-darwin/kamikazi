export default function BlockedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex-grow relative z-10">{children}</main>;
}