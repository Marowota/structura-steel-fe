import { AuthorizedLayout } from "@/components/composition/AuthorizedLayout";
import { MainLayout } from "@/components/composition/MainLayout";

export default function MainPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthorizedLayout>
      <MainLayout>{children}</MainLayout>
    </AuthorizedLayout>
  );
}
