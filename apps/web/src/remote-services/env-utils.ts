export const getIntBaseUrl = () => process.env['AZURE_AD_INT_BASE_URL'];
export const getCrmBaseUrl = () => process.env['AZURE_AD_CRM_BASE_URL'];

export const getTenantId = () => process.env.AZURE_AD_TENANT_ID;
export const getIntClientId = () => process.env['AZURE_AD_INT_CLIENT_ID'];
export const getIntClientSecret = () => process.env['AZURE_AD_INT_CLIENT_SECRET'];
export const getIntGrantType = () => process.env['AZURE_AD_INT_GRANT_TYPE'];
export const getIntScope = () => process.env['AZURE_AD_INT_SCOPE'];

export const getCrmClientId = () => process.env['AZURE_AD_CRM_CLIENT_ID'];
export const getCrmClientSecret = () => process.env['AZURE_AD_CRM_CLIENT_SECRET'];
export const getCrmGrantType = () => process.env['AZURE_AD_CRM_GRANT_TYPE'];
export const getCrmResourceUrl = () => process.env['AZURE_AD_CRM_RESOURCE_URL'];
