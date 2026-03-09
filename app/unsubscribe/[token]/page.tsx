import UnsubscribeClient from "@/components/unsubscribe/UnsubscribeClient";

export default async function UnsubscribePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return <UnsubscribeClient token={token} />;
}