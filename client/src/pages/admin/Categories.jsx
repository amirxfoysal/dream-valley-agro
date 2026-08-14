import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiDelete, apiGet, apiPost, apiPut } from '../../api/client.js';
import { CATEGORIES } from '../../constants/categories.js';
import { useSubcategories } from '../../context/SubcategoriesContext.jsx';
import styles from './admin.module.css';

const EMPTY_FORM = {
  name: '',
  nameBn: '',
  parent: CATEGORIES[0].slug,
  sortOrder: 0,
};

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

function SubcategoryFormModal({ initial, saving, onSave, onClose }) {
  const { t, i18n } = useTranslation();
  const bn = i18n.resolvedLanguage === 'bn';
  const [form, setForm] = useState(initial ? { ...EMPTY_FORM, ...initial } : EMPTY_FORM);

  const set = (path, value) => setForm((prev) => ({ ...prev, [path]: value }));

  const onSubmit = (e) => {
    e.preventDefault();
    onSave({ ...form, sortOrder: Number(form.sortOrder) || 0 });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>{initial ? t('admin.categories.editTitle') : t('admin.categories.addTitle')}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={t('admin.customers.close')}>
            ×
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>{t('admin.categories.nameEn')}</span>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </label>
            <label className={styles.field}>
              <span>{t('admin.categories.nameBn')}</span>
              <input value={form.nameBn} onChange={(e) => set('nameBn', e.target.value)} />
            </label>

            <label className={styles.field}>
              <span>{t('admin.categories.parentLabel')}</span>
              <select value={form.parent} onChange={(e) => set('parent', e.target.value)}>
                {CATEGORIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {bn ? c.bn : c.en}
                  </option>
                ))}
              </select>
            </label>
            <label className={styles.field}>
              <span>{t('admin.categories.sortOrder')}</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => set('sortOrder', e.target.value)}
              />
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.ghostBtn} onClick={onClose}>
              {t('admin.categories.cancel')}
            </button>
            <button type="submit" className={styles.primaryBtn} disabled={saving}>
              {saving ? t('admin.categories.saving') : initial ? t('admin.categories.save') : t('admin.categories.addSave')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const parentName = (slug) => CATEGORIES.find((c) => c.slug === slug)?.en || slug;

export default function Categories() {
  const { t } = useTranslation();
  const { reload: reloadPublic } = useSubcategories();
  const [subs, setSubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');

  const token = localStorage.getItem('dva-admin-token');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2600);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiGet(token, '/admin/subcategories');
      setSubs(data);
    } catch (err) {
      showToast(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editing) {
        await apiPut(token, `/admin/subcategories/${editing._id}`, data);
        showToast(t('admin.categories.updated'));
      } else {
        await apiPost(token, '/admin/subcategories', data);
        showToast(t('admin.categories.added'));
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
    if (
      !window.confirm(
        t('admin.categories.deleteConfirm', { name: sub.name, parent: parentName(sub.parent) })
      )
    )
      return;
    try {
      await apiDelete(token, `/admin/subcategories/${sub._id}`);
      showToast(t('admin.categories.deleted'));
      load();
      reloadPublic();
    } catch (err) {
      showToast(err.message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>{t('admin.categories.title')}</h1>
          <p className={styles.sub}>{t('admin.categories.subtitle')}</p>
        </div>
        <button
          type="button"
          className={styles.primaryBtn}
          onClick={() => {
            setEditing(null);
            setModalOpen(true);
          }}
        >
          {t('admin.categories.add')}
        </button>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.panel}>
        {loading ? (
          <div className={styles.empty}>{t('admin.categories.loading')}</div>
        ) : subs.length === 0 ? (
          <div className={styles.empty}>{t('admin.categories.empty')}</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('admin.categories.subcategory')}</th>
                <th>{t('admin.categories.parent')}</th>
                <th>{t('admin.categories.sort')}</th>
                <th>{t('admin.categories.products')}</th>
                <th>{t('admin.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {subs.map((sub) => (
                <tr key={sub._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span className={styles.placeholderImg}>{(sub.name || 'S').charAt(0)}</span>
                      <div>
                        <strong>{sub.name}</strong>
                        {sub.nameBn && (
                          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{sub.nameBn}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{parentName(sub.parent)}</td>
                  <td>{sub.sortOrder}</td>
                  <td>
                    <span
                      className={styles.badge}
                      style={{ background: 'rgba(63,168,77,0.16)', color: '#2d8a3e' }}
                    >
                      {t('admin.categories.productCount', { count: sub.productCount })}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => {
                          setEditing(sub);
                          setModalOpen(true);
                        }}
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
              ))}
            </tbody>
          </table>
        )}
      </div>

      {modalOpen && (
        <SubcategoryFormModal
          initial={editing}
          saving={saving}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}
