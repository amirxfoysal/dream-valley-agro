import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BASE_URL } from '../api/client.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductSkeleton from '../components/ProductSkeleton.jsx';
import styles from './TreeBar.module.css';

export default function TreeBar() {
  const { t, i18n } = useTranslation();
  const bn = i18n.resolvedLanguage === 'bn';
  const [trees, setTrees] = useState([]);
  const [selected, setSelected] = useState(null);
  const [varieties, setVarieties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [varietyLoading, setVarietyLoading] = useState(false);
  const [error, setError] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`${BASE_URL}/trees`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const list = Array.isArray(data) ? data : [];
        setTrees(list);
        if (list.length > 0) setSelected(list[0]._id);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(t('shop.error'));
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [t]);

  useEffect(() => {
    if (!selected) return;
    const controller = new AbortController();
    setVarieties([]);
    setVarietyLoading(true);
    fetch(`${BASE_URL}/products?tree=${selected}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setVarieties(Array.isArray(data) ? data : []))
      .catch((err) => {
        if (err.name !== 'AbortError') setError(t('shop.error'));
      })
      .finally(() => setVarietyLoading(false));
    return () => controller.abort();
  }, [selected, t]);

  useEffect(() => {
    if (!drawerOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [drawerOpen]);

  if (loading) return null;

  const activeTree = trees.find((tree) => tree._id === selected) || null;

  const pickTree = (treeId) => {
    setSelected(treeId);
    setDrawerOpen(false);
  };

  const activeTreeName = activeTree
    ? bn
      ? activeTree.nameBn || activeTree.name
      : activeTree.name
    : '';

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2>{t('home.treebar.title')}</h2>
        <p>{t('home.treebar.subtitle')}</p>
      </div>

      {/* Desktop horizontal bar */}
      <div className={styles.bar} role="tablist" aria-label={t('home.treebar.title')}>
        {trees.length === 0 ? (
          <p className={styles.empty}>{t('home.treebar.empty')}</p>
        ) : (
          trees.map((tree) => (
            <button
              key={tree._id}
              type="button"
              role="tab"
              aria-selected={selected === tree._id}
              className={`${styles.tab} ${selected === tree._id ? styles.active : ''}`}
              onClick={() => pickTree(tree._id)}
            >
              {bn ? tree.nameBn || tree.name : tree.name}
              <span className={styles.count}>{tree.varietyCount}</span>
            </button>
          ))
        )}
      </div>

      {/* Mobile filter bar trigger button */}
      {trees.length > 0 && (
        <div className={styles.mobileFilterBar}>
          <button
            type="button"
            className={styles.drawerBtn}
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
            aria-controls="tree-mobile-sidebar"
          >
            <div className={styles.drawerBtnLeft}>
              <span className={styles.drawerIcon}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </span>
              <div className={styles.drawerBtnText}>
                <span className={styles.drawerBtnLabel}>{t('home.treebar.browse')}</span>
                {activeTreeName && (
                  <span className={styles.drawerCurrent}>{activeTreeName}</span>
                )}
              </div>
            </div>
            <span className={styles.drawerBtnBadge}>
              {activeTree ? activeTree.varietyCount : trees.length} {bn ? 'জাত' : 'varieties'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      )}

      {/* Mobile Sidebar Drawer */}
      {trees.length > 0 && (
        <>
          <div
            className={`${styles.backdrop} ${drawerOpen ? styles.backdropOpen : ''}`}
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside
            id="tree-mobile-sidebar"
            className={`${styles.sidebar} ${drawerOpen ? styles.sidebarOpen : ''}`}
            aria-label={t('home.treebar.title')}
            role="dialog"
            aria-modal={drawerOpen}
            aria-hidden={!drawerOpen}
          >
            <div className={styles.sidebarHead}>
              <div className={styles.sidebarTitleGroup}>
                <span className={styles.sidebarTitleIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 2C9 2 4.5 4 3 8c-1.5 4 .5 10 3 13 1.2 1.4 2.5-1 3.5-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M12 2c2.5 0 6 1.5 8 5 1.8 3.2 2 7 .5 10.5C19 20.8 16 21 13 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    <path d="M3 8c4 2.5 8.5 4.5 14 4M12 2v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <strong>{t('home.treebar.title')}</strong>
                  <span className={styles.sidebarSubtitle}>
                    {trees.length} {bn ? 'টি গাছ উপলব্ধ' : 'trees available'}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className={styles.sidebarClose}
                onClick={() => setDrawerOpen(false)}
                aria-label={t('home.treebar.close') || 'Close'}
              >
                ✕
              </button>
            </div>

            <div className={styles.sidebarList}>
              {trees.map((tree) => {
                const isSelected = selected === tree._id;
                const name = bn ? tree.nameBn || tree.name : tree.name;
                return (
                  <button
                    key={tree._id}
                    type="button"
                    className={`${styles.sidebarTab} ${
                      isSelected ? styles.sidebarTabActive : ''
                    }`}
                    onClick={() => pickTree(tree._id)}
                  >
                    <span className={styles.sidebarTabName}>
                      <span className={styles.sidebarTabBullet} />
                      {name}
                    </span>
                    <span className={styles.sidebarCount}>{tree.varietyCount}</span>
                  </button>
                );
              })}
            </div>

            <div className={styles.sidebarFooter}>
              {t('home.treebar.subtitle')}
            </div>
          </aside>
        </>
      )}

      {activeTree && (
        <div className={styles.treeTitle}>
          <h3>{activeTreeName}</h3>
          <p>
            {bn ? activeTree.descriptionBn || activeTree.description : activeTree.description}
          </p>
        </div>
      )}

      {error ? (
        <p className={styles.status}>{error}</p>
      ) : varietyLoading ? (
        <div className={styles.grid}>
          {Array.from({ length: 4 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </div>
      ) : varieties.length === 0 ? (
        <p className={styles.status}>{t('home.treebar.noVarieties')}</p>
      ) : (
        <div className={styles.grid}>
          {varieties.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
}