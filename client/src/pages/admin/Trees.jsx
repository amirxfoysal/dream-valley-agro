import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiDelete, apiGet, apiPost, apiPut, getAdminToken, resolveMediaUrl } from '../../api/client.js';
import ImageField from '../../components/admin/ImageField.jsx';
import styles from './admin.module.css';

const EMPTY_FORM = {
  name: '',
  nameBn: '',
  image: '',
  description: '',
  descriptionBn: '',
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
      <path d="M4 6h16M9 6V4h6v2m3 0-1 14H7L6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TreeFormModal({ initial, saving, onSave, onClose }) {
  const { t } = useTranslation();
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
          <h2>{initial ? t('admin.trees.editTitle') : t('admin.trees.addTitle')}</h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label={t('admin.customers.close')}>
            ×
          </button>
        </div>

        <form onSubmit={onSubmit}>
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>{t('admin.trees.nameEn')}</span>
              <input value={form.name} onChange={(e) => set('name', e.target.value)} required />
            </label>
            <label className={styles.field}>
              <span>{t('admin.trees.nameBn')}</span>
              <input value={form.nameBn} onChange={(e) => set('nameBn', e.target.value)} />
            </label>
            <label className={styles.field}>
              <span>{t('admin.trees.sortOrder')}</span>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => set('sortOrder', e.target.value)}
              />
            </label>

            <ImageField
              label={t('admin.trees.image')}
              value={form.image}
              onChange={(v) => set('image', v)}
              span
            />
            <label className={`${styles.field} ${styles.span2}`}>
              <span>{t('admin.trees.description')}</span>
              <textarea value={form.description} onChange={(e) => set('description', e.target.value)} />
            </label>
            <label className={`${styles.field} ${styles.span2}`}>
              <span>{t('admin.trees.descriptionBn')}</span>
              <textarea value={form.descriptionBn} onChange={(e) => set('descriptionBn', e.target.value)} />
            </label>
          </div>

          <div className={styles.formActions}>
            <button type="button" className={styles.ghostBtn} onClick={onClose}>
              {t('admin.trees.cancel')}
            </button>
            <button type="submit" className={styles.primaryBtn} disabled={saving}>
              {saving ? t('admin.trees.saving') : initial ? t('admin.trees.save') : t('admin.trees.addSave')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Trees() {
  const { t } = useTranslation();
  const [trees, setTrees] = useState([]);
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
      const data = await apiGet(token, '/admin/trees');
      setTrees(data);
    } catch (err) {
      showToast(err.message);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (data) => {
    setSaving(true);
    try {
      const token = await getAdminToken();
      if (editing) {
        await apiPut(token, `/admin/trees/${editing._id}`, data);
        showToast(t('admin.trees.updated'));
      } else {
        await apiPost(token, '/admin/trees', data);
        showToast(t('admin.trees.added'));
      }
      setModalOpen(false);
      load();
    } catch (err) {
      showToast(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (tree) => {
    if (!window.confirm(t('admin.trees.deleteConfirm', { name: tree.name }))) return;
    try {
      const token = await getAdminToken();
      await apiDelete(token, `/admin/trees/${tree._id}`);
      showToast(t('admin.trees.deleted'));
      load();
    } catch (err) {
      showToast(err.message);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.pageHeader}>
        <div>
          <h1>{t('admin.trees.title')}</h1>
          <p className={styles.sub}>{t('admin.trees.subtitle')}</p>
        </div>
        <button type="button" className={styles.primaryBtn} onClick={() => { setEditing(null); setModalOpen(true); }}>
          {t('admin.trees.add')}
        </button>
      </div>

      {toast && <div className={styles.toast}>{toast}</div>}

      <div className={styles.panel}>
        {loading ? (
          <div className={styles.empty}>{t('admin.trees.loading')}</div>
        ) : trees.length === 0 ? (
          <div className={styles.empty}>{t('admin.trees.empty')}</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>{t('admin.trees.tree')}</th>
                <th>{t('admin.trees.sort')}</th>
                <th>{t('admin.trees.varieties')}</th>
                <th>{t('admin.table.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {trees.map((tree) => (
                <tr key={tree._id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {tree.image ? (
                        <img
                          className={styles.thumb}
                          src={resolveMediaUrl(tree.image)}
                          alt={tree.name}
                        />
                      ) : (
                        <span className={styles.placeholderImg}>{(tree.name || 'T').charAt(0)}</span>
                      )}
                      <div>
                        <strong>{tree.name}</strong>
                        {tree.nameBn && (
                          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{tree.nameBn}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>{tree.sortOrder}</td>
                  <td>
                    <span className={styles.badge} style={{ background: 'rgba(63,168,77,0.16)', color: '#2d8a3e' }}>
                      {t('admin.trees.varietyCount', { count: tree.varietyCount })}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.actionBtn}
                        onClick={() => { setEditing(tree); setModalOpen(true); }}
                        aria-label={t('admin.table.edit')}
                      >
                        <EditIcon />
                      </button>
                      <button
                        type="button"
                        className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                        onClick={() => handleDelete(tree)}
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
        <TreeFormModal
          initial={editing}
          saving={saving}
          onSave={handleSave}
          onClose={() => setModalOpen(false)}
        />
      )}
    </div>
  );
}