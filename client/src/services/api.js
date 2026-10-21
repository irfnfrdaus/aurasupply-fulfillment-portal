const BASE_URL = '/api';

export const fetchOrders = async () => {
  const res = await fetch(`${BASE_URL}/orders`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch orders');
  return data.data;
};

export const updateOrderStatus = async (id, status) => {
  const res = await fetch(`${BASE_URL}/orders/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to update order status');
  return data.data;
};

export const createOrder = async (orderData) => {
  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderData)
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to create order');
  return data.data;
};

export const fetchInventory = async () => {
  const res = await fetch(`${BASE_URL}/inventory`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch inventory');
  return data.data;
};

export const restockInventory = async (sku, quantity = 50) => {
  const res = await fetch(`${BASE_URL}/inventory/restock`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sku, quantity })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to restock inventory');
  return data.data;
};

export const fetchQaRuns = async () => {
  const res = await fetch(`${BASE_URL}/qa/runs`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch QA runs');
  return data.data;
};

export const executeQaSuite = async (tenantId, testSuite) => {
  const res = await fetch(`${BASE_URL}/qa/execute`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tenant_id: tenantId, test_suite: testSuite })
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to execute QA suite');
  return data.data;
};

export const fetchAnalytics = async () => {
  const res = await fetch(`${BASE_URL}/analytics/dashboard`);
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Failed to fetch analytics');
  return data.data;
};
