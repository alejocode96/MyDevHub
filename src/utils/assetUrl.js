// src/utils/assetUrl.js
const BASE = import.meta.env.BASE_URL

export const assetUrl = (path) => `${BASE}${path.replace(/^\//, '')}`