// Test the edge function directly
// Replace YOUR_ANON_KEY with your actual Supabase anon key from .env

const testEmail = async () => {
  const supabaseUrl = "https://kvvzzwypcdorrzvdslfl.supabase.co";
  const supabaseKey = "YOUR_ANON_KEY"; // Get from .env file
  
  const response = await fetch(`${supabaseUrl}/functions/v1/send-receipt-email`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${supabaseKey}`,
    },
    body: JSON.stringify({
      to: "your-email@example.com", // Replace with your email
      subject: "Test Email from Edge Function",
      html: "<h1>Test</h1><p>If you receive this, the edge function works!</p>"
    })
  });
  
  const data = await response.json();
  console.log('Response:', data);
};

testEmail();
