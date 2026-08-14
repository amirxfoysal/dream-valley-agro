const isProd = process.env.NODE_ENV === 'production';

// Internal error messages are only exposed outside production to aid debugging.
export const errDetail = (err) => (isProd ? undefined : err?.message);
