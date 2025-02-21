export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="gap-12 items-start">{children}</div>;
}
