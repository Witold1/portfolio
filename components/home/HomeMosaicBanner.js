import { useEffect, useState } from 'react';

/**
 * Draft home banner: flat mosaic of gallery stills.
 * Click a tile to reveal its title (curate via config/home-mosaic.json).
 */
export default function HomeMosaicBanner({ tiles }) {
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    if (!openId) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpenId(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [openId]);

  if (!tiles?.length) return null;

  return (
    <section className="content-rail home-mosaic" aria-label="Visualization examples">
      <div className="home-mosaic__grid">
        {tiles.map((tile) => {
          const isOpen = openId === tile.id;
          return (
            <button
              key={tile.id}
              type="button"
              className={`home-mosaic__cell${isOpen ? ' home-mosaic__cell--open' : ''}`}
              aria-pressed={isOpen}
              aria-label={tile.title}
              onClick={() => setOpenId(isOpen ? null : tile.id)}
            >
              <img src={tile.src} alt="" loading="lazy" decoding="async" />
              <span className="home-mosaic__title" aria-hidden={!isOpen}>
                {tile.title}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
