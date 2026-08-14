const STEADFAST_BASE_URL = 'https://portal.packzy.com/api/v1';

const API_KEY = process.env.STEADFAST_API_KEY || '';
const SECRET_KEY = process.env.STEADFAST_SECRET_KEY || '';

const TIMEOUT_MS = 15000;

export const steadfastConfigured = () => Boolean(API_KEY && SECRET_KEY);

const STATUS_ALIASES = {
  0: 'pending',
  1: 'in_review',
  2: 'in_progress',
  3: 'shipped',
  4: 'delivered',
  5: 'partial',
  6: 'returned',
  7: 'cancelled',
  8: 'unknown',
  pending: 'pending',
  in_review: 'in_review',
  review: 'in_review',
  approved: 'in_review',
  in_progress: 'in_progress',
  processing: 'in_progress',
  packed: 'in_progress',
  shipped: 'shipped',
  in_delivery: 'shipped',
  on_delivery: 'shipped',
  delivered: 'delivered',
  partial: 'partial',
  returned: 'returned',
  return: 'returned',
  cancelled: 'cancelled',
  cancel: 'cancelled',
  unknown: 'unknown',
  on_hold: 'unknown',
  hold: 'unknown',
};

export const normalizeStatus = (raw) => {
  if (raw === null || raw === undefined || raw === '') return 'unknown';
  const key = typeof raw === 'number' ? raw : String(raw).trim().toLowerCase();
  return STATUS_ALIASES[key] || 'unknown';
};

export const steadfastToOrderStatus = (steadfastStatus) =>
  ({
    shipped: 'shipped',
    delivered: 'delivered',
    partial: 'delivered',
    returned: 'cancelled',
  })[steadfastStatus] || null;

export const fetchBalance = async () => {
  const body = await request('/current_balance');
  const amount = Number(body?.current_balance ?? body?.balance);
  return Number.isFinite(amount) ? amount : null;
};

const request = async (path, options = {}) => {
  if (!steadfastConfigured()) {
    const err = new Error('SteadFast credentials are not configured');
    err.statusCode = 503;
    throw err;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(`${STEADFAST_BASE_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        'Api-Key': API_KEY,
        'Secret-Key': SECRET_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(options.headers || {}),
      },
    });

    const body = await res.json().catch(() => null);

    if (!res.ok) {
      const err = new Error(
        body?.message || body?.error || `SteadFast request failed (${res.status})`
      );
      err.statusCode = res.status === 401 || res.status === 403 ? 502 : res.status;
      err.body = body;
      throw err;
    }

    if (body && typeof body === 'object' && (body.errors || Number(body.status) >= 400)) {
      const firstError = body.errors
        ? Object.values(body.errors).flat().join(' ') || 'Invalid request'
        : body.message || 'Invalid request';
      const err = new Error(`SteadFast: ${firstError}`);
      err.statusCode = 400;
      err.body = body;
      throw err;
    }

    return body;
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutErr = new Error('SteadFast request timed out');
      timeoutErr.statusCode = 504;
      throw timeoutErr;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
};

const normalizeConsignment = (raw) => {
  if (!raw || typeof raw !== 'object') return null;

  const statusRaw = raw.delivery_status ?? raw.status ?? raw.consignment_status;
  const statusCode = Number(statusRaw);
  const normalizedStatus = normalizeStatus(
    Number.isFinite(statusCode) && String(statusRaw).trim() !== '' ? statusCode : statusRaw
  );

  return {
    consignmentId: String(raw.consignment_id ?? raw.consignmentId ?? raw.tracking_code ?? ''),
    invoiceId: String(raw.invoice_id ?? raw.invoiceId ?? ''),
    status: normalizedStatus,
    codAmount: Number(raw.cod_amount ?? raw.cod ?? 0) || 0,
    receivedAmount: Number(raw.recieved_amount ?? raw.received_amount ?? 0) || 0,
  };
};

export const trackByConsignmentId = async (consignmentId) => {
  const body = await request(`/status_by_cid/${encodeURIComponent(consignmentId)}`);
  return normalizeConsignment({
    ...body?.consignment,
    consignment_id: body?.consignment?.consignment_id ?? body?.consignment_id ?? consignmentId,
    delivery_status: body?.consignment?.delivery_status ?? body?.delivery_status,
  });
};

export const trackByInvoice = async (invoiceId) => {
  const body = await request(`/status_by_invoice/${encodeURIComponent(invoiceId)}`);
  return normalizeConsignment({
    ...body?.consignment,
    consignment_id: body?.consignment?.consignment_id ?? body?.consignment_id ?? '',
    invoice_id: body?.consignment?.invoice_id ?? body?.invoice_id ?? invoiceId,
    delivery_status: body?.consignment?.delivery_status ?? body?.delivery_status,
  });
};

export const createConsignment = async (order) => {
  const c = order.customer || {};
  const addressParts = [c.address, c.city, c.postalCode].filter(Boolean);

  const payload = {
    invoice: order.orderNumber,
    recipient_name: c.name,
    recipient_phone: c.phone || '',
    recipient_address: addressParts.join(', '),
    cod_amount: order.payment?.method === 'cod' ? order.total : 0,
  };

  if (order.notes) payload.note = String(order.notes).slice(0, 250);

  const body = await request('/create_order', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

  const consignment = body?.consignment || body;
  const consignmentId = consignment?.consignment_id;

  if (!consignmentId) {
    const err = new Error(body?.message || 'SteadFast did not return a consignment ID');
    err.statusCode = 502;
    err.body = body;
    throw err;
  }

  return String(consignmentId);
};
