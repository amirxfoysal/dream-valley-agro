import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiDelete, apiGet, apiPost, apiPut, getAdminToken, resolveMediaUrl } from '../../api/client.js';
import ImageField from '../../components/admin/ImageField.jsx';
import { useSubcategories } from '../../context/SubcategoriesContext.jsx';
import styles from './admin.module.css';

const FRUIT_TREES_SLUG = 'fruit-trees';
const EMPTY_FORM = { name: '', nameBn: '', parent: FRUIT_TREES_SLUG, image: '', sortOrder: 0 };

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
      <path d="M4 6h16M9 6V4h6v2m3 0-1 14H7L6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function VariantFormModal({ initial, initialParent, parentOptions, saving, onSave, onClose }) {
  const { t } = useTranslation();
  const [form, setForm] = useState(
    initial ? { ...EMPTY_FORM, ...initial } : { ...EMPTY_FORM, parent: initialParent || FRUIT_TREES_SLUG }
  );

  const set = (path, value) => setForm((prev) => ({ ...prev, [path]: value }));

  const onSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, sortOrder: Number(form.sortOrder) || 0 });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{initial ? t('admin.fruittrees.editTitle') : t('admin.fruittrees.addTitle')}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="close">
            ×
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>{t('admin.fruittrees.nameEn')}</span>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </label>
            <label className={styles.field}>
              <span>{t('admin.fruittrees.nameBn')}</span>
              <input value={form.nameBn} onChange={(e) => set('nameBn', e.target.value)} />
            </label>

            <label className={styles.field}>
              <span>{t('admin.fruittrees.parentLabel')}</span>
              <select value={form.parent} onChange={(e) => set('parent', e.target.value)}>
                {parentOptions.map((o) => (
                  <option key={o.slug} value={o.slug}>
                    {o.depth > 0 ? `${'— '.repeat(o.depth)}${o.label}` : o.label}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>{t('admin.fruittrees.sortOrder')}</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => set('sortOrder', e.target.value)}
              />
            </label>

            <ImageField
              label={t('admin.fruittrees.image')}
              value={form.image}
              onChange={(v) => set('image', v)}
              span
            />
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.ghostBtn} onClick={onClose}>
              {t('admin.fruittrees.cancel')}
            </button>
            <button type="submit" className={styles.primaryBtn} disabled={saving}>
              {saving
                ? t('admin.fruittrees.saving')
                : initial
                ? t('admin.fruittrees.save')
                : t('admin.fruittrees.addSave')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function FruitTrees() {
  const { t, i18n } = useTranslation();
  const bn = i18n.resolvedLanguage === 'bn';
  const { reload: reloadPublic } = useSubcategories();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const token = await getAdminToken();
      const data = await apiGet(token, '/admin/subcategories');
      setSubs(Array.isArray(data) ? data : []);
    } catch (err) {
      showToast(err.message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  // Build the fruit-trees subtree: variants (depth 1) and their nested varieties.
  const nameOf = useCallback((s) => (bn ? s.nameBn || s.name : s.name), [bn]);
  const childrenOf = useCallback(
    (parentSlug) =>
      subs
        .filter((s) => s.parent === parentSlug)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0) || a.name.localeCompare(b.name)),
    [subs]
  );
  const variants = useMemo(() => childrenOf(FRUIT_TREES_SLUG), [childrenOf]);

  // Parent options for the form: Fruit Trees itself + everything inside it,
  // excluding the edited item and its descendants (no cycles).
  const parentOptions = useMemo(() => {
    const options = [{ slug: FRUIT_TREES_SLUG, label: t('admin.fruittrees.rootParent'), depth: 0 }];
    const excluded = new Set();
    if (editing) {
      const collect = (slug) => {
        excluded.add(slug);
        subs.filter((s) => s.parent === slug).forEach((c) => collect(c.slug));
      };
      collect(editing.slug);
    }
    const walk = (parentSlug, depth) => {
      if (depth > 3) return;
      childrenOf(parentSlug).forEach((c) => {
        if (excluded.has(c.slug)) return;
        options.push({ slug: c.slug, label: nameOf(c), depth });
        walk(c.slug, depth + 1);
      });
    };
    walk(FRUIT_TREES_SLUG, 1);
    return options;
  }, [subs, editing, childrenOf, nameOf, t]);

  // Keep initial parent when opening "Add variety" from a section.
  const [formParent, setFormParent] = useState(FRUIT_TREES_SLUG);
  const openAddWithParent = (parent) => {
    setFormParent(parent);
    setEditing(null);
    setModalOpen(true);
  };

  const openEdit = (sub) => {
    setEditing(sub);
    setModalOpen(true);
  };

  const handleSave = async (data) => {
    setSaving(true);
    try {
      const token = await getAdminToken();
      if (editing) {
        await apiPut(token, `/admin/subcategories/${editing._id}`, data);
        showToast(t('admin.fruittrees.updated'));
      } else {
        await apiPost(token, '/admin/subcategories', data);
        showToast(t('admin.fruittrees.added'));
      }
      setModalOpen(false);
      load();
      reloadPublic();
    } catch (err) {
      showToast(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (sub) => {
    const parentLabel =
      sub.parent === FRUIT_TREES_SLUG
        ? t('admin.fruittrees.rootParent')
        : nameOf(subs.find((s) => s.slug === sub.parent) || {});
    if (
      !window.confirm(
        t('admin.fruittrees.deleteConfirm', { name: sub.name, parent: parentLabel })
      )
    )
      return;
    try {
      const token = await getAdminToken();
      await apiDelete(token, `/admin/subcategories/${sub._id}`);
      showToast(t('admin.fruittrees.deleted'));
      load();
      reloadPublic();
    } catch (err) {
      showToast(err.message);
    }
  };

  const renderRow = (sub, depth) => (
    <tr key={sub._id} className={depth > 0 ? styles.childRow : styles.variantRow}>
      <td>
        <div className={styles.fruitNameCell} style={{ paddingLeft: depth * 28 }}>
          {sub.image ? (
            <img
              src={resolveMediaUrl(sub.image)}
              alt=""
              className={styles.fruitThumb}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.visibility = 'hidden';
              }}
            />
          ) : (
            <span className={styles.placeholderImg}>{(sub.name || 'F').charAt(0)}</span>
          )}
          <div>
            <strong>{sub.name}</strong>
            {sub.nameBn && (
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{sub.nameBn}</div>
            )}
          </div>
        </div>
      </td>
      <td>
        <span
          className={styles.badge}
          style={{ background: 'rgba(63,168,77,0.16)', color: '#2d8a3e' }}
        >
          {t('admin.fruittrees.productCount', { count: sub.productCount })}
        </span>
      </td>
      <td>{sub.sortOrder}</td>
      <td>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.addChildBtn}
            onClick={() => openAddWithParent(sub.slug)}
          >
            <PlusIcon />
            {t('admin.fruittrees.addVariety')}
          </button>
          <button
            type="button"
            className={styles.actionBtn}
            onClick={() => openEdit(sub)}
            aria-label={t('admin.table.edit')}
          >
            <EditIcon />
          </button>
          <button
            type="button"
            className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
            onClick={() => handleDelete(sub)}
            aria-label={t('admin.table.delete')}
          >
            <TrashIcon />
          </button>
        </div>
      </td>
    </tr>
  );

  const renderTree = (parentSlug, depth) =>
    childrenOf(parentSlug).flatMap((sub) => [renderRow(sub, depth), ...renderTree(sub.slug, depth + 1)]);

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>{t('admin.fruittrees.title')}</h1>
          <p className={styles.sub}>{t('admin.fruittrees.subtitle')}</p>
        </div>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => openAddWithParent(FRUIT_TREES_SLUG)}
        >
          {t('admin.fruittrees.add')}
        </button>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.panel}>
        {loading ? (
          <div className={styles.empty}>{t('admin.fruittrees.loading')}</div>
        ) : variants.length === 0 ? (
          <div className={styles.empty}>{t('admin.fruittrees.empty')}</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('admin.fruittrees.variantCol')}</th>
                <th>{t('admin.fruittrees.products')}</th>
                <th>{t('admin.fruittrees.sort')}</th>
                <th>{t('admin.table.actions')}</th>
              </tr>
            </thead>
            <tbody>{renderTree(FRUIT_TREES_SLUG, 0)}</tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <VariantFormModal
          key={editing ? editing._id : `new-${formParent}`}
          initial={editing}
          initialParent={formParent}
          parentOptions={parentOptions}
          saving={saving}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
