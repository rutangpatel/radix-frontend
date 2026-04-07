import { fetchWithAuth } from './config';

// --- A. Authentication ---
export const authService = {
  login: async (username: string, password: string) => {
    const params = new URLSearchParams();
    params.append('username', username);
    params.append('password', password);

    return fetchWithAuth('/v1/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });
  },
};

// --- B. Users ---
export const userService = {
  signup: async (data: { name: string; mob_no: string; password: string; pin: string; useNameForRadixId?: boolean }) => {
    return fetchWithAuth(`/v1/users/signup?name_in_id=${data.useNameForRadixId ? 'true' : 'false'}`, {
      method: 'POST',
      body: JSON.stringify({
        name: data.name,
        mob_no: data.mob_no,
        password: data.password,
        pin: data.pin,
      }),
    });
  },

  getBalance: async () => {
    return fetchWithAuth('/v1/users/balance', {
      method: 'GET',
    });
  },

  forgotPassword: async (data: { user_id: string; mob_no: string; new_password: string }) => {
    return fetchWithAuth('/v1/users/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// --- C. Transactions ---
export const transactionService = {
  getHistory: async () => {
    return fetchWithAuth('/v2/transaction/history', {
      method: 'GET',
    });
  },

  getRecentActivity: async () => {
    return fetchWithAuth('/v2/transaction/check_activity', {
      method: 'GET',
    });
  },

  payViaRadixId: async (data: { to_id: string; amount: number; pin: string; remark: string }) => {
    return fetchWithAuth('/v2/transaction/payment', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  payViaMobileNo: async (data: { mob_no: string; amount: number; pin: string; remark: string }) => {
    return fetchWithAuth('/v2/transaction/payment_using_mob_no', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// --- D. Face Identity ---
export const faceService = {
  checkFaceStatus: async () => {
    return fetchWithAuth('/v1/face/status', {
      method: 'GET',
    });
  },

  facePayment: async (imageFile: File, amount: number, remark: string) => {
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('amount', amount.toString());
    formData.append('remark', remark);

    return fetchWithAuth('/v1/face/pay', {
      method: 'POST',
      body: formData,
    });
  },
};
