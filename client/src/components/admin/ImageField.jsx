import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { apiUpload, getAdminToken, resolveMediaUrl } from '../../api/client.js';
import styles from '../../pages/admin/admin.module.css';

export default function ImageField({ label, value, onChange, span }) {
  const { t } = useTranslation();
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError(t('admin.fruittrees.uploadTooLarge'));
      return;
    }
    setUploading(true);
    setUploadError('');
    try {
      const token = await getAdminToken();
      const { url } = await apiUpload(token, '/admin/uploads', file);
      onChange(url);
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <label className={`${styles.field} ${span ? styles.span2 : ''}`}>
      <span>{label}</span>
      <div className={styles.imageFieldRow}>
        {value ? (
          <img
            src={resolveMediaUrl(value)}
            alt=""
            className={styles.fruitThumb}
            onError={(e) => {
              e.currentTarget.style.visibility = 'hidden';
            }}
          />
        ) : (
          <span className={styles.placeholderImg}>🖼</span>
        )}
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://…" />
        <button
          type="button"
          className={styles.ghostBtn}
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? t('admin.fruittrees.uploading') : t('admin.fruittrees.uploadBtn')}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          style={{ display: 'none' }}
        />
      </div>
      {uploadError && <span className={styles.fieldError}>{uploadError}</span>}
    </label>
  );
}
