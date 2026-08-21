import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiDelete, apiGet, apiPost, apiPut, getAdminToken, resolveMediaUrl } from '../../api/client.js';
import ImageField from '../../components/admin/ImageField.jsx';
import {
  CATEGORIES,
  categoryChain,
  categoryName,
} from '../../constants/categories.js';
import { useSubcategories } from '../../context/SubcategoriesContext.jsx';
import styles from './admin.module.css';

const EMPTY_FORM = {
  name: '',
  nameBn: '',
  category: CATEGORIES[0].slug,
  tree: '',
  price: '',
  oldPrice: '',
  stock: 0,
  description: '',
  descriptionBn: '',
  images: ['', '', ''],
  featured: false,
  care: { light: '', water: '', soil: '' },
};

function formatBDT(n) {
  return `৳${Number(n || 0).toLocaleString('en-IN')}`;
}

function EditIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 20h4L18.5 9.5a2.1 2.1 0 0 0-3-3L5 17v3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16M9 6V4h6v2m3 0-1 14H7L6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ProductFormModal({ initial, trees, categoryOptions, saving, onSave, onClose }) {
  const { t, i18n } = useTranslation();
  const bn = i18n.resolvedLanguage === 'bn';
  const [form, setForm] = useState(() => {
    if (!initial) return EMPTY_FORM;
    const src = initial.images?.length
      ? initial.images
      : initial.image
        ? [initial.image]
        : [];
    const images = [0, 1, 2].map((i) => src[i] || '');
    return {
      ...EMPTY_FORM,
      ...initial,
      tree: initial.tree?._id || initial.tree || '',
      images,
      care: { ...EMPTY_FORM.care, ...(initial.care || {}) },
    };
  });

  const set = (path, value) => {
    setForm((prev) => {
      if (path.startsWith('care.')) {
        return { ...prev, care: { ...prev.care, [path.split('.')[1]]: value } };
      }
      if (path.startsWith('images.')) {
        const idx = Number(path.split('.')[1]);
        const images = [...prev.images];
        images[idx] = value;
        return { ...prev, images };
      }
      return { ...prev, [path]: value };
    });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...form,
      images: form.images.map((s) => (s || '').trim()).filter(Boolean),
      price: Number(form.price) || 0,
      oldPrice: form.oldPrice === '' ? null : Number(form.oldPrice) || null,
      stock: Number(form.stock) || 0,
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{initial ? t('admin.products.editTitle') : t('admin.products.addTitle')}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={t('admin.customers.close')}>
            ×
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>{t('admin.products.nameEn')}</span>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </label>
            <label className={styles.field}>
              <span>{t('admin.products.nameBn')}</span>
              <input value={form.nameBn} onChange={(e) => set('nameBn', e.target.value)} />
            </label>

            <label className={styles.field}>
              <span>{t('admin.products.category')}</span>
              <select value={form.category} onChange={(e) => set('category', e.target.value)}>
                {categoryOptions.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.depth > 0 ? `${'— '.repeat(c.depth)}${bn ? c.bn : c.en}` : bn ? c.bn : c.en}
                  </option>
                ))}
                {!categoryOptions.some((c) => c.slug === form.category) && form.category && (
                  <option value={form.category}>{t('admin.products.legacy', { slug: form.category })}</option>
                )}
              </select>
            </label>
            <label className={styles.field}>
              <span>{t('admin.table.stock')}</span>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={(e) => set('stock', e.target.value)}
              />
            </label>

            <label className={styles.field}>
              <span>{t('admin.products.tree')}</span>
              <select value={form.tree || ''} onChange={(e) => set('tree', e.target.value)}>
                <option value="">{t('admin.products.treeNone')}</option>
                {trees.map((tree) => (
                  <option key={tree._id} value={tree._id}>
                    {bn ? tree.nameBn || tree.name : tree.name}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>{t('admin.products.priceLabel')}</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => set('price', e.target.value)}
                required
              />
            </label>
            <label className={styles.field}>
              <span>{t('admin.products.oldPrice')}</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.oldPrice}
                onChange={(e) => set('oldPrice', e.target.value)}
              />
            </label>

            <ImageField
              label={t('admin.products.image1')}
              value={form.images[0] || ''}
              onChange={(v) => set('images.0', v)}
              span
            />
            <ImageField
              label={t('admin.products.image2')}
              value={form.images[1] || ''}
              onChange={(v) => set('images.1', v)}
              span
            />
            <ImageField
              label={t('admin.products.image3')}
              value={form.images[2] || ''}
              onChange={(v) => set('images.2', v)}
              span
            />

            <label className={`${styles.field} ${styles.span2}`}>
              <span>{t('admin.products.description')}</span>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} />
            </label>
            <label className={`${styles.field} ${styles.span2}`}>
              <span>{t('admin.products.descriptionBn')}</span>
              <textarea value={form.descriptionBn} onChange={(e) => set('descriptionBn', e.target.value)} />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldHint}>{t('admin.products.light')}</span>
              <input value={form.care.light} onChange={(e) => set('care.light', e.target.value)} />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldHint}>{t('admin.products.water')}</span>
              <input value={form.care.water} onChange={(e) => set('care.water', e.target.value)} />
            </label>
            <label className={styles.field}>
              <span className={styles.fieldHint}>{t('admin.products.soil')}</span>
              <input value={form.care.soil} onChange={(e) => set('care.soil', e.target.value)} />
            </label>

            <label className={`${styles.field} ${styles.checkField}`}>
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set('featured', e.target.checked)}
              />
              <span>{t('admin.products.featuredLabel')}</span>
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.ghostBtn} onClick={onClose}>
              {t('admin.products.cancel')}
            </button>
            <button type="submit" className={styles.primaryBtn} disabled={saving}>
              {saving ? t('admin.products.saving') : initial ? t('admin.products.save') : t('admin.products.addSave')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function stockBadge(stock) {
  if (stock <= 0) return `${styles.badge} ${styles.stockOut}`;
  if (stock <= 5) return `${styles.badge} ${styles.stockLow}`;
  return `${styles.badge} ${styles.stockOk}`;
}

const stockLabel = (t, stock) =>
  stock <= 0
    ? t('admin.products.stockOut')
    : stock <= 5
    ? t('admin.products.stockLow', { count: stock })
    : t('admin.products.stockIn', { count: stock });

export default function Products() {
  const { t, i18n } = useTranslation();
  const bn = i18n.resolvedLanguage === 'bn';
  const { subcategories } = useSubcategories();
  const buildCategoryOptions = (cats, depth = 0) =>
    depth > 2
      ? []
      : cats.flatMap((c) => {
          const children = subcategories
            .filter((s) => s.parent === c.slug)
            .map((s) => ({ slug: s.slug, en: s.en, bn: s.bn }));
          return [
            { slug: c.slug, en: c.en, bn: c.bn, depth },
            ...buildCategoryOptions(children, depth + 1),
          ];
        });
  const categoryOptions = buildCategoryOptions(CATEGORIES);
  const [products, setProducts] = useState([]);
  const [trees, setTrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getAdminToken();
      const [productsData, treesData] = await Promise.all([
        apiGet(token, '/admin/products'),
        apiGet(token, '/admin/trees'),
      ]);
      setProducts(productsData);
      setTrees(treesData);
    } catch (err) {
      showToast(err.message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditing(product);
    setModalOpen(true);
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      const token = await getAdminToken();
      if (editing) {
        await apiPut(token, `/admin/products/${editing._id}`, data);
        showToast(t('admin.products.updated'));
      } else {
        await apiPost(token, '/admin/products', data);
        showToast(t('admin.products.added'));
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    if (!window.confirm(t('admin.products.deleteConfirm', { name: product.name }))) return;
    try {
      const token = await getAdminToken();
      await apiDelete(token, `/admin/products/${product._id}`);
      showToast(t('admin.products.deleted'));
      load();
    } catch (err) {
      showToast(err.message);
    }
  };

  const filtered = products.filter((p) => {
    const q = query.trim().toLowerCase();
    const inQuery =
      !q ||
      p.name.toLowerCase().includes(q) ||
      (p.nameBn || '').toLowerCase().includes(q);
    const inCategory =
      categoryFilter === 'all' || categoryChain(p.category).includes(categoryFilter);
    return inQuery && inCategory;
  });

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>{t('admin.nav.products')}</h1>
          <p className={styles.sub}>{t('admin.products.count', { count: products.length })}</p>
        </div>
        <button type="button" className={styles.primaryBtn} onClick={openAdd}>
          {t('admin.products.add')}
        </button>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.toolbar}>
        <input
          type="search"
          className={styles.toolbarSearch}
          placeholder={t('admin.products.searchPlaceholder')}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label={t('admin.products.searchPlaceholder')}
        />
        <select
          className={styles.toolbarSelect}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          aria-label={t('admin.products.filterCategory')}
        >
          <option value="all">{t('admin.products.allCategories')}</option>
          {categoryOptions.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.depth > 0 ? `${'— '.repeat(c.depth)}${bn ? c.bn : c.en}` : bn ? c.bn : c.en}
            </option>
          ))}
        </select>
        <span className={styles.toolbarCount}>
          {t('admin.products.filteredCount', {
            shown: filtered.length,
            total: products.length,
          })}
        </span>
      </div>

      <div className={styles.panel}>
        {loading ? (
          <div className={styles.empty}>{t('admin.products.loading')}</div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>{t('admin.products.noMatches')}</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('admin.products.productCol')}</th>
                <th>{t('admin.nav.trees')}</th>
                <th>{t('admin.products.category')}</th>
                <th>{t('admin.table.price')}</th>
                <th>{t('admin.table.stock')}</th>
                <th>{t('admin.table.featured')}</th>
                <th>{t('admin.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {p.image ? (
                        <img className={styles.thumb} src={resolveMediaUrl(p.image)} alt={p.name} />
                      ) : (
                        <span className={styles.placeholderImg}>{(p.name || 'P').charAt(0)}</span>
                      )}
                      <div>
                        <strong>{p.name}</strong>
                        {p.nameBn && (
                          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{p.nameBn}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{(bn ? p.tree?.nameBn || p.tree?.name : p.tree?.name) || '—'}</td>
                  <td>{categoryName(p.category, bn) || '—'}</td>
                  <td className={styles.price}>{formatBDT(p.price)}</td>
                  <td>
                    <span className={stockBadge(p.stock)}>{stockLabel(t, p.stock)}</span>
                  </td>
                  <td>{p.featured ? '★' : '—'}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => openEdit(p)}
                        aria-label={t('admin.table.edit')}
                      >
                        <EditIcon />
                      </button>
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                        onClick={() => handleDelete(p)}
                        aria-label={t('admin.table.delete')}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <ProductFormModal
          initial={editing}
          trees={trees}
          categoryOptions={categoryOptions}
          saving={saving}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}