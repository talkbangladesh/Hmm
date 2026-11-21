export interface Web3FormsPayload {
  subject: string;
  fromName: string;
  replyTo?: string;
  fields: Record<string, string | number | boolean | undefined | null>;
}

export interface Web3FormsResult {
  configured: boolean;
  sent: boolean;
  error?: string;
}

export function isWeb3FormsConfigured(): boolean {
  return Boolean((process.env.WEB3FORMS_ACCESS_KEY || '').trim());
}

export async function sendWeb3FormsNotification(
  payload: Web3FormsPayload
): Promise<Web3FormsResult> {
  const accessKey = (process.env.WEB3FORMS_ACCESS_KEY || '').trim();
  if (!accessKey) {
    return { configured: false, sent: false };
  }

  try {
    const cleanFields: Record<string, string> = {};
    for (const [k, v] of Object.entries(payload.fields)) {
      if (v !== undefined && v !== null && String(v).trim() !== '') {
        cleanFields[k] = String(v);
      }
    }

    const body = {
      access_key: accessKey,
      subject: payload.subject,
      from_name: payload.fromName,
      replyto: payload.replyTo || process.env.WEB3FORMS_RECIPIENT_EMAIL || 'educationatlas@gmail.com',
      ...cleanFields,
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    const json = (await response.json()) as { success?: boolean; message?: string };
    if (!response.ok || !json.success) {
      return {
        configured: true,
        sent: false,
        error: json.message || `Web3Forms error (${response.status})`,
      };
    }

    return { configured: true, sent: true };
  } catch (err) {
    return {
      configured: true,
      sent: false,
      error: err instanceof Error ? err.message : 'Failed to deliver Web3Forms notification',
    };
  }
}
