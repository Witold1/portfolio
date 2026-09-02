import { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import GalleryGridLayoutToolbar from '../components/gallery/GalleryGridLayoutToolbar';
import GalleryGrid from '../components/gallery/GalleryGrid';
import GalleryLightbox from '../components/gallery/GalleryLightbox';
import {
  getGalleryCategories,
  filterGalleryItems,
  filterVisibleGalleryItems,
  galleryNotesToMetaString,
  formatGalleryCategoryLabel,
  useGalleryLightbox,
} from '../lib/gallery';
import { useAdminPrefs } from '../components/admin/AdminPrefsProvider';
import ContentBreadcrumb from '../components/content/ContentBreadcrumb';
import { SITE_ORGANIZATION } from '../lib/site';

const galleryBreadcrumbItems = [
  { href: '/', label: 'Home' },
  { label: 'Gallery', title: 'Data and information visualization pond ⛵' },
];

export async function getStaticProps() {
  try {
    const { loadGallery } = await import('../lib/gallery/server');
    const { items: galleryData, categories: galleryCategories } = loadGallery();
    return {
      props: {
        galleryData,
        galleryCategories,
        galleryLoadError: null,
      },
    };
  } catch (err) {
    console.error('gallery getStaticProps:', err);
    return {
      props: {
        galleryData: [],
        galleryCategories: [],
        galleryLoadError: err?.message || 'Could not load gallery data',
      },
    };
  }
}

export default function Gallery({ galleryData, galleryCategories, galleryLoadError }) {
  const loadError = galleryLoadError;
  const { showHiddenGallery } = useAdminPrefs();
  const [gridType, setGridType] = useState('uniform');
  const [filter, setFilter] = useState(() => ['all']);
  const [page, setPage] = useState(1);
  const itemsPerPage = 15;

  const visibleItems = useMemo(
    () => filterVisibleGalleryItems(galleryData, { showHidden: showHiddenGallery }),
    [galleryData, showHiddenGallery],
  );

  const { item: modalItem, isOpen, open: openModal, close: closeModal } = useGalleryLightbox({
    syncQuery: true,
    catalog: visibleItems,
  });

  useEffect(() => {
    setPage(1);
  }, [filter.join('\0')]);

  const categories = useMemo(
    () => getGalleryCategories(visibleItems, galleryCategories),
    [visibleItems, galleryCategories],
  );
  const filteredItems = useMemo(() => filterGalleryItems(visibleItems, filter), [visibleItems, filter]);
  const paginatedItems = useMemo(
    () => filteredItems.slice(0, page * itemsPerPage),
    [filteredItems, page],
  );

  const modalDescription = modalItem ? galleryNotesToMetaString(modalItem.notes) : '';
  const showingAll = filter.includes('all') || filter.length === 0;

  const toggleCategory = (cat) => {
    setFilter((prev) => {
      if (cat === 'all') return ['all'];
      const specifics = prev.filter((c) => c !== 'all');
      if (specifics.includes(cat)) {
        const next = specifics.filter((c) => c !== cat);
        return next.length === 0 ? ['all'] : next;
      }
      return [...specifics, cat];
    });
  };

  return (
    <>
      <Head>
        {modalItem ? (
          <>
            <title>{modalItem.title || `Gallery Item ${modalItem.id}`}</title>
            <meta name="description" content={modalDescription} />
            <meta property="og:title" content={modalItem.title || `Gallery Item ${modalItem.id}`} />
            <meta property="og:description" content={modalDescription} />
            {modalItem.src ? <meta property="og:image" content={modalItem.src} /> : null}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={SITE_ORGANIZATION} />
          </>
        ) : (
          <>
            <title>Data and Information Visualization Pond</title>
            <meta name="description" content="Explore my gallery of data and information visualizations" />
            <meta property="og:title" content="Data and Information Visualization Pond" />
            <meta property="og:description" content="Explore my gallery of data and information visualizations" />
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content={SITE_ORGANIZATION} />
          </>
        )}
      </Head>
      <div className="content-page flex flex-col">
        <div className="content-main flex-grow">
          <div className="content-reading relative">
            <div className="content-breadcrumb-rail">
              <ContentBreadcrumb items={galleryBreadcrumbItems} />
            </div>
            <div className="content-index-body">
              <div className="mb-6 gallery-controls flex flex-col gap-3 max-w-full">
                <div
                  role="group"
                  aria-label="Filter by category; multiple categories combine with OR"
                  className="gallery-cat-row"
                >
                  {categories.map((category) => {
                    const pressed =
                      category === 'all' ? showingAll : !showingAll && filter.includes(category);
                    return (
                      <button
                        key={category}
                        type="button"
                        aria-pressed={pressed}
                        disabled={!!loadError}
                        onClick={() => toggleCategory(category)}
                        className={`gallery-cat-chip${pressed ? ' gallery-cat-chip--active' : ''}`}
                      >
                        {formatGalleryCategoryLabel(category)}
                      </button>
                    );
                  })}
                </div>
                <GalleryGridLayoutToolbar
                  gridType={gridType}
                  onUniform={() => setGridType('uniform')}
                  onVariable={() => setGridType('variable')}
                />
              </div>
              {loadError && (
                <p className="text-red-600 dark:text-red-400" role="alert">
                  {loadError}
                </p>
              )}
              {!loadError && paginatedItems.length > 0 ? (
                <>
                  <GalleryGrid
                    items={paginatedItems}
                    onCardClick={openModal}
                    layout={gridType}
                  />
                  {paginatedItems.length < filteredItems.length && (
                    <button
                      type="button"
                      onClick={() => setPage(page + 1)}
                      className="gallery-load-more"
                    >
                      Load more
                      <svg
                        className="gallery-load-more__icon"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}
                </>
              ) : null}
              {!loadError && galleryData.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300">No gallery items to display.</p>
              ) : null}
              {!loadError && visibleItems.length > 0 && paginatedItems.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300">No items match the selected filter.</p>
              ) : null}
            </div>
            <GalleryLightbox isOpen={isOpen} onClose={closeModal} item={modalItem} />
          </div>
        </div>
      </div>
    </>
  );
}
