// The middleware hides /admin/login unless the gate secret is supplied in the URL.
// Use this single constant for every in-app link/redirect so the gate always opens.
export const ADMIN_GATE_SECRET = 'post-n0-bill'
export const ADMIN_LOGIN_URL = `/admin/login?access=${ADMIN_GATE_SECRET}`
