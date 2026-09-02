import Link from 'next/link';
import PageMeta from '../components/content/PageMeta';
import HomeMosaicBanner from '../components/home/HomeMosaicBanner';
import HomePipeline from '../components/home/HomePipeline';
import { getHomeDraftData } from '../lib/content/homeDraft';

export async function getStaticProps() {
  return { props: getHomeDraftData() };
}

export default function Home({ mosaicTiles }) {
  return (
    <div className="content-page flex flex-col">
      <PageMeta
        title="Home - Witold's Data Consulting"
        description="Data visualization, project write-ups, and notes from Witold's Data Consulting."
        pathname="/"
      />
      <div className="content-main content-main--home flex-grow">
        <div className="content-rail home-intro home-intro--banner">
          <h1 className="home-intro__lede">
            Hello - this is a home for data products, and the notes behind them.
          </h1>
        </div>

        <HomeMosaicBanner tiles={mosaicTiles} />

        <div className="content-rail home-intro">
          <p className="home-intro__lede">
            We do data visualization, analysis, and small tools that help people see patterns and tell clearer stories.
          </p>
        </div>

        <HomePipeline />

        <div className="content-rail home-intro">
          <p className="home-intro__lede">
            Curious about a collaboration?{' '}
            <Link href="/about/">Let&apos;s make your data insightful again!</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
