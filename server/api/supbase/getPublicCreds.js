export default defineEventHandler(async (event) => ({ supabaseUrl: useRuntimeConfig().supabaseUrl, supabaseKey: useRuntimeConfig().supabaseKey }));