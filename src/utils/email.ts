/**
 * Email Notification Service for GR8QM Technovates
 */

export interface EmailReceipt {
  to: string;
  customerName: string;
  courseName: string;
  amount: number;
  reference: string;
  date: string;
  type: "course" | "service";
  itemName?: string;
}

/**
 * Send payment receipt email via Supabase Edge Function
 */
export const sendReceiptEmail = async (receipt: EmailReceipt) => {
  try {
    console.log('📧 Attempting to send receipt email...');
    console.log('Receipt data:', receipt);

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing Supabase configuration');
    }

    // Generate email template
    let emailTemplate;
    
    if (receipt.type === "course") {
      emailTemplate = emailTemplates.courseReceipt(receipt);
    } else {
      emailTemplate = emailTemplates.serviceReceipt(receipt);
    }

    const response = await fetch(
      `${supabaseUrl}/functions/v1/send-receipt-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
        },
        body: JSON.stringify({
          to: receipt.to,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
        }),
      }
    );

    console.log('📡 Response status:', response.status);
    const data = await response.json();
    console.log('📡 Response data:', data);

    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}: Failed to send email`);
    }

    console.log('✅ Email sent successfully:', data);
    return {
      success: true,
      message: 'Receipt email sent successfully'
    };
  } catch (error) {
    console.error('❌ Email sending error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Failed to send receipt email'
    };
  }
};

/**
 * Email templates for different scenarios
 */
export const emailTemplates = {
  courseReceipt: (receipt: EmailReceipt) => ({
    subject: `Payment Receipt - ${receipt.courseName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: 'Epilogue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #0098da 0%, #f58634 100%);
              padding: 40px 20px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .content {
              padding: 40px 30px;
            }
            .receipt-box {
              background: #fafafa;
              border: 2px solid #c9ebfb;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .receipt-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #e5e5e5;
            }
            .receipt-row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: 600;
              color: #05235a;
            }
            .value {
              color: #333;
            }
            .badge {
              display: inline-block;
              background: #d4edda;
              color: #155724;
              padding: 5px 12px;
              border-radius: 20px;
              font-size: 12px;
              font-weight: 600;
              margin-top: 10px;
            }
            .footer {
              background: #f8f9fa;
              padding: 30px;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
            .footer a {
              color: #0098da;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Payment Confirmed!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Thank you for your commitment, ${receipt.customerName}</p>
            </div>
            <div class="content">
              <h2 style="color: #05235a; margin-top: 0;">Payment Receipt</h2>
              <div class="receipt-box">
                <div class="receipt-row">
                  <span class="label">Course:</span>
                  <span class="value">${receipt.courseName}</span>
                </div>
                <div class="receipt-row">
                  <span class="label">Amount Paid:</span>
                  <span class="value" style="font-weight: 700; color: #0098da;">₦${receipt.amount.toLocaleString()}</span>
                </div>
                <div class="receipt-row">
                  <span class="label">Payment Reference:</span>
                  <span class="value">${receipt.reference}</span>
                </div>
                <div class="receipt-row">
                  <span class="label">Date:</span>
                  <span class="value">${receipt.date}</span>
                </div>
              </div>
              <span class="badge">100% REFUNDABLE UPON COURSE COMPLETION</span>
            </div>
            <div class="footer">
              <p style="margin: 0 0 10px 0; font-weight: 600; color: #05235a;">GR8QM Technovates</p>
              <p style="margin: 0 0 10px 0;">Faith that builds. Impact that lasts.</p>
              <p style="margin: 0;">
                Need help? Contact us at <a href="mailto:hello@gr8qm.com">hello@gr8qm.com</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  serviceReceipt: (receipt: EmailReceipt) => ({
    subject: `Payment Receipt - ${receipt.itemName || "Service Payment"}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: 'Epilogue', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              margin: 0;
              padding: 0;
              background-color: #f5f5f5;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background: white;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            }
            .header {
              background: linear-gradient(135deg, #0098da 0%, #f58634 100%);
              padding: 40px 20px;
              text-align: center;
              color: white;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 700;
            }
            .content {
              padding: 40px 30px;
            }
            .receipt-box {
              background: #fafafa;
              border: 2px solid #c9ebfb;
              border-radius: 8px;
              padding: 20px;
              margin: 20px 0;
            }
            .receipt-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              border-bottom: 1px solid #e5e5e5;
            }
            .receipt-row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: 600;
              color: #05235a;
            }
            .value {
              color: #333;
            }
            .footer {
              background: #f8f9fa;
              padding: 30px;
              text-align: center;
              color: #666;
              font-size: 14px;
            }
            .footer a {
              color: #0098da;
              text-decoration: none;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>✓ Payment Confirmed!</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px;">Verified Payment for ${receipt.customerName}</p>
            </div>
            <div class="content">
              <h2 style="color: #05235a; margin-top: 0;">Payment Receipt</h2>
              <div class="receipt-box">
                <div class="receipt-row">
                  <span class="label">Item:</span>
                  <span class="value">${receipt.courseName}</span>
                </div>
                <div class="receipt-row">
                  <span class="label">Amount Paid:</span>
                  <span class="value" style="font-weight: 700; color: #0098da;">₦${receipt.amount.toLocaleString()}</span>
                </div>
                <div class="receipt-row">
                  <span class="label">Payment Reference:</span>
                  <span class="value">${receipt.reference}</span>
                </div>
                <div class="receipt-row">
                  <span class="label">Date:</span>
                  <span class="value">${receipt.date}</span>
                </div>
              </div>
              <p>We have successfully received your payment for the above invoice/service.</p>
            </div>
            <div class="footer">
              <p style="margin: 0 0 10px 0; font-weight: 600; color: #05235a;">GR8QM Technovates</p>
              <p style="margin: 0 0 10px 0;">Faith that builds. Impact that lasts.</p>
              <p style="margin: 0;">
                Need help? Contact us at <a href="mailto:hello@gr8qm.com">hello@gr8qm.com</a>
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  invoice: (invoice: any) => ({
    subject: `Invoice ${invoice.invoice_number} from GR8QM Technovates`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Epilogue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0098da, #f58634); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: white; padding: 30px; border: 1px solid #e5e5e5; }
            .invoice-details { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .amount { font-size: 28px; font-weight: bold; color: #0098da; margin: 20px 0; }
            .pay-button { display: inline-block; background: linear-gradient(135deg, #0098da, #0077b5); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Invoice</h1>
              <p>${invoice.invoice_number}</p>
            </div>
            <div class="content">
              <h2>Dear ${invoice.client_name},</h2>
              <p>Thank you for choosing GR8QM Technovates. Please find your invoice details below:</p>
              
              <div class="invoice-details">
                <p><strong>Service:</strong> ${invoice.service_description}</p>
                <p><strong>Due Date:</strong> ${new Date(invoice.due_date).toLocaleDateString()}</p>
                ${invoice.notes ? `<p><strong>Notes:</strong> ${invoice.notes}</p>` : ''}
              </div>
              
              <div class="amount">
                <p>Amount Due: ₦${invoice.amount.toLocaleString()}</p>
              </div>

              <div style="text-align: center; margin: 30px 0;">
                <a href="https://www.gr8qm.com/pay-invoice/${invoice.invoice_number}" class="pay-button">
                  💳 Pay Now
                </a>
              </div>
              
              <p style="font-size: 14px; color: #666; text-align: center;">Or visit: https://www.gr8qm.com/pay-invoice/${invoice.invoice_number}</p>
              
              <p>If you have any questions, feel free to contact us.</p>
            </div>
            <div class="footer">
              <p><strong>GR8QM Technovates</strong></p>
              <p>Faith that builds. Impact that lasts.</p>
              <p>hello@gr8qm.com</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  serviceRequestNotification: (request: any) => ({
    subject: `New Service Request: ${request.service_type}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Epilogue', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: white; }
            .header { background: #0098da; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; border: 1px solid #e5e5e5; border-top: none; }
            .details { background: #f8f9fa; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .label { font-weight: 600; color: #05235a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2>🔔 New Service Request</h2>
            </div>
            <div class="content">
              <p>A new service request has been submitted:</p>
              
              <div class="details">
                <p><span class="label">Service Type:</span> ${request.service_type}</p>
                <p><span class="label">Name:</span> ${request.name}</p>
                <p><span class="label">Email:</span> ${request.email}</p>
                <p><span class="label">Phone:</span> ${request.phone}</p>
                <p><span class="label">Budget Range:</span> ${request.budget_range || 'Not specified'}</p>
                <p><span class="label">Timeline:</span> ${request.timeline || 'Not specified'}</p>
                <p><span class="label">Description:</span><br>${request.project_description}</p>
              </div>
              
              <p>Log in to the admin panel to respond to this request.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),

  contactMessage: (data: { name: string; email: string; message: string }) => ({
    subject: `New Contact Message from ${data.name}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: 'Epilogue', Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; background: white; }
            .header { background: #0098da; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { padding: 30px; border: 1px solid #e5e5e5; border-top: none; }
            .info-box { background: #f8f9fa; border-left: 4px solid #0098da; padding: 15px; margin: 20px 0; }
            .label { font-weight: 600; color: #05235a; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0;">📬 New Contact Message</h1>
            </div>
            <div class="content">
              <p style="font-size: 16px; color: #666;">You have received a new message from your website's contact form.</p>
              
              <div class="info-box">
                <p><span class="label">Name:</span> ${data.name}</p>
                <p><span class="label">Email:</span> <a href="mailto:${data.email}">${data.email}</a></p>
                <p><span class="label">Message:</span><br>${data.message || 'No message provided'}</p>
              </div>
              
              <p>You can reply directly to <a href="mailto:${data.email}">${data.email}</a> or view all messages in the admin panel.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  }),
};
