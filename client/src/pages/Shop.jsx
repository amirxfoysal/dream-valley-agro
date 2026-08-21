import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchPublicJson, resolveMediaUrl } from '../api/client.js';
import {
  CATEGORIES,
  allCategorySlugs,
  categoryBySlug,
  rootSlugOf,
  subcategoriesOf,
  parentSlugOf,
  categoryMatches,
} from '../constants/categories.js';
import { useSubcategories } from '../context/SubcategoriesContext.jsx';
import ProductCard from '../components/ProductCard.jsx';
import ProductSkeleton from '../components/ProductSkeleton.jsx';
import styles from './Shop.module.css';

export default function Shop() {
  const { t, i18n } = useTranslation();
  const bn = i18n.resolvedLanguage === 'bn';
  useSubcategories();
  const [searchParams, setSearchParams] = useSearchParams();
  const treeParam = searchParams.get('tree') || 'all';
  const categoryParam = searchParams.get('category') || 'all';
  const category = allCategorySlugs().includes(categoryParam) ? categoryParam : 'all';
  const featuredParam = searchParams.get('featured') === 'true';

  const [products, setProducts] = useState([]);
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchParam = searchParams.get('search') || '';
  const [query, setQuery] = useState(searchParam);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Sync only when the URL value actually changes, so local edits to the
  // search box aren't wiped by unrelated param updates (category/tree chips).
  useEffect(() => {
    setQuery(searchParam);
  }, [searchParam]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError('');

    Promise.all([
      fetchPublicJson('/products', controller.signal),
      fetchPublicJson('/trees', controller.signal),
    ])
      .then(([productsData, treesData]) => {
        setProducts(Array.isArray(productsData) ? productsData : []);
        setTrees(Array.isArray(treesData) ? treesData : []);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setError(t('shop.error'));
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [t]);

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

  const selectTree = (treeId) => {
    const newParams = new URLSearchParams(searchParams);
    if (treeId === 'all') {
      newParams.delete('tree');
    } else {
      newParams.set('tree', treeId);
    }
    setSearchParams(newParams);
    setDrawerOpen(false);
  };

  const selectCategory = (slug) => {
    const newParams = new URLSearchParams(searchParams);
    if (slug === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', slug);
      if (subcategoriesOf(slug).length > 0) newParams.delete('tree');
    }
    setSearchParams(newParams);
  };

  const toggleFeatured = () => {
    const newParams = new URLSearchParams(searchParams);
    if (featuredParam) {
      newParams.delete('featured');
    } else {
      newParams.set('featured', 'true');
    }
    setSearchParams(newParams);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const inCategory = categoryMatches(p.category, category);
      const productTreeId = typeof p.tree === 'object' && p.tree !== null ? p.tree._id : p.tree;
      const inTree = treeParam === 'all' || String(productTreeId) === String(treeParam);
      const inFeatured = !featuredParam || p.featured === true;
      const inQuery =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.nameBn || '').toLowerCase().includes(q);
      return inCategory && inTree && inFeatured && inQuery;
    });
  }, [products, category, treeParam, featuredParam, query]);

  // Chips show the children of the active category; if it has none (leaf variety),
  // show its siblings instead.
  const chipsOwner =
    subcategoriesOf(category).length > 0 ? category : parentSlugOf(category) || category;
  const levelChips = subcategoriesOf(chipsOwner);
  const focused = levelChips.length > 0;
  const rootSlug = rootSlugOf(category);
  const rootCategoryObj = CATEGORIES.find((c) => c.slug === rootSlug) || null;
  const chipsOwnerObj = categoryBySlug(chipsOwner);
  const deepLevel = focused && Boolean(rootCategoryObj) && rootSlug !== chipsOwner;
  const rootName = rootCategoryObj ? (bn ? rootCategoryObj.bn : rootCategoryObj.en) : '';
  const chipsOwnerName = chipsOwnerObj
    ? bn
      ? chipsOwnerObj.bn || chipsOwnerObj.en
      : chipsOwnerObj.en
    : rootName;
  const allRootLabel = rootCategoryObj
    ? bn
      ? `সব ${rootCategoryObj.bn}`
      : `All ${rootCategoryObj.en}`
    : bn
    ? 'সব ধরন'
    : 'All Types';
  const allSubLabel = chipsOwnerObj
    ? bn
      ? `সব ${chipsOwnerObj.bn || chipsOwnerObj.en}`
      : `All ${chipsOwnerObj.en}`
    : allRootLabel;

  const activeTreeObj = trees.find((tr) => String(tr._id) === String(treeParam));
  const activeTreeName = activeTreeObj
    ? bn
      ? activeTreeObj.nameBn || activeTreeObj.name
      : activeTreeObj.name
    : bn
    ? 'সব গাছ'
    : 'All Trees';

  return (
    <main className={styles.page}>
      {focused ? (
        <header className={styles.header}>
          <button type="button" className={styles.backBtn} onClick={() => selectCategory('all')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {bn ? 'সব ক্যাটাগরি' : 'All categories'}
          </button>
          <h1>{deepLevel ? chipsOwnerName : rootName}</h1>
          <p>{t('pages.shop.subtitle')}</p>
        </header>
      ) : (
        <header className={styles.header}>
          <h1>{featuredParam ? t('home.featured.title') : t('pages.shop.title')}</h1>
          <p>{t('pages.shop.subtitle')}</p>
        </header>
      )}

      {/* Mobile Tree Type Sidebar Trigger */}
      {!focused && trees.length > 0 && (
        <div className={styles.mobileTreeBar}>
          <button
            type="button"
            className={styles.mobileTreeBtn}
            onClick={() => setDrawerOpen(true)}
            aria-expanded={drawerOpen}
          >
            <div className={styles.mobileTreeBtnLeft}>
              <span className={styles.mobileTreeIcon}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2C9 2 4.5 4 3 8c-1.5 4 .5 10 3 13 1.2 1.4 2.5-1 3.5-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M12 2c2.5 0 6 1.5 8 5 1.8 3.2 2 7 .5 10.5C19 20.8 16 21 13 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  <path d="M3 8c4 2.5 8.5 4.5 14 4M12 2v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </span>
              <span>{bn ? 'গাছের ধরন:' : 'Tree Type:'} <strong>{activeTreeName}</strong></span>
            </div>
            <span className={styles.mobileTreeBtnBadge}>
              {bn ? 'ফিল্টার' : 'Filter'}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        </div>
      )}

      {/* Desktop Tree Bar filter pills */}
      {!focused && trees.length > 0 && (
        <div className={styles.desktopTreeBar}>
          <span className={styles.treeLabel}>{bn ? 'গাছের ধরন:' : 'Tree Type:'}</span>
          <button
            type="button"
            className={`${styles.treeChip} ${treeParam === 'all' ? styles.activeTreeChip : ''}`}
            onClick={() => selectTree('all')}
          >
            {bn ? 'সব গাছ' : 'All Trees'}
          </button>
          {trees.map((tr) => (
            <button
              key={tr._id}
              type="button"
              className={`${styles.treeChip} ${treeParam === tr._id ? styles.activeTreeChip : ''}`}
              onClick={() => selectTree(tr._id)}
            >
              {bn ? tr.nameBn || tr.name : tr.name}
            </button>
          ))}
        </div>
      )}

      {/* Toolbar: Category Filters & Search */}
      {focused ? (
        <div className={styles.toolbar}>
          <div className={`${styles.filters} ${styles.focusedFilters}`} role="group" aria-label={chipsOwnerName}>
            {deepLevel && (
              <button
                type="button"
                className={styles.chip}
                onClick={() => selectCategory(rootSlug)}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ verticalAlign: '-2px', marginRight: 4 }}>
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {allRootLabel}
              </button>
            )}
            <button
              type="button"
              className={`${styles.chip} ${styles.largeChip} ${category === chipsOwner ? styles.active : ''}`}
              onClick={() => selectCategory(chipsOwner)}
            >
              {allSubLabel}
            </button>
            {levelChips.map((sub) => (
              <button
                key={sub.slug}
                type="button"
                className={`${styles.chip} ${styles.largeChip} ${category === sub.slug ? styles.active : ''}`}
                onClick={() => selectCategory(sub.slug)}
              >
                {sub.image ? (
                  <img
                    src={resolveMediaUrl(sub.image)}
                    alt=""
                    className={styles.chipThumb}
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
                {bn ? sub.bn : sub.en}
              </button>
            ))}
          </div>

          <input
            type="search"
            className={styles.search}
            placeholder={t('shop.searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t('shop.searchPlaceholder')}
          />
        </div>
      ) : (
        <div className={styles.toolbar}>
          <div className={styles.filterStack}>
            <div className={styles.filters} role="group" aria-label={t('shop.filterLabel')}>
              <button
                type="button"
                className={`${styles.chip} ${category === 'all' ? styles.active : ''}`}
                onClick={() => selectCategory('all')}
              >
                {t('shop.categories.all')}
              </button>
              <button
                type="button"
                className={`${styles.chip} ${featuredParam ? styles.active : ''}`}
                onClick={toggleFeatured}
              >
                {t('shop.featured')}
              </button>
              {CATEGORIES.map((c) => (
                <button
                  key={c.slug}
                  type="button"
                  className={`${styles.chip} ${category === c.slug ? styles.active : ''}`}
                  onClick={() => selectCategory(c.slug)}
                >
                  {bn ? c.bn : c.en}
                </button>
              ))}
            </div>
          </div>

          <input
            type="search"
            className={styles.search}
            placeholder={t('shop.searchPlaceholder')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t('shop.searchPlaceholder')}
          />
        </div>
      )}

      {/* Mobile Tree Sidebar Drawer */}
      {trees.length > 0 && (
        <>
          <div
            className={`${styles.backdrop} ${drawerOpen ? styles.backdropOpen : ''}`}
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
          <aside
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
              <button
                type="button"
                className={`${styles.sidebarTab} ${
                  treeParam === 'all' ? styles.sidebarTabActive : ''
                }`}
                onClick={() => selectTree('all')}
              >
                <span className={styles.sidebarTabName}>
                  <span className={styles.sidebarTabBullet} />
                  {bn ? 'সব গাছ' : 'All Trees'}
                </span>
                <span className={styles.sidebarCount}>{products.length}</span>
              </button>

              {trees.map((tree) => {
                const isSelected = String(treeParam) === String(tree._id);
                const name = bn ? tree.nameBn || tree.name : tree.name;
                return (
                  <button
                    key={tree._id}
                    type="button"
                    className={`${styles.sidebarTab} ${
                      isSelected ? styles.sidebarTabActive : ''
                    }`}
                    onClick={() => selectTree(tree._id)}
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
          </aside>
        </>
      )}

      {loading ? (
        <section className={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))}
        </section>
      ) : error ? (
        <p className={`${styles.status} ${styles.error}`}>{error}</p>
      ) : filtered.length === 0 ? (
        <p className={styles.status}>{t('shop.noResults')}</p>
      ) : (
        <section className={styles.grid}>
          {filtered.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </section>
      )}
    </main>
  );
}