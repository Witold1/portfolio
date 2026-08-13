import Head from 'next/head';
import AdminSettings from '../components/admin/AdminSettings';

export default function AdminPage() {
  return (
    <>
      <Head>
        <title>Admin - Witold&apos;s Data Consulting</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <AdminSettings />
    </>
  );
}
