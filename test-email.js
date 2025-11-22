// Test Edge Function
// Open browser console and paste this to test the email function

const testEmail = async () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  console.log('🔍 Testing email function...');
  console.log('Supabase URL:', supabaseUrl);
  console.log('Has Anon Key:', !!supabaseAnonKey);
  
  try {
    const response = await fetch(`${supabaseUrl}/functions/v1/send-receipt-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        to: 'test@example.com',
        customerName: 'Test User',
        courseName: 'Test Course',
        amount: 5000,
        reference: 'TEST-123',
        date: new Date().toLocaleDateString(),
        type: 'course'
      }),
    });
    
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (response.ok) {
      console.log('✅ Email function works!');
    } else {
      console.error('❌ Email function failed:', data);
    }
  } catch (error) {
    console.error('❌ Error calling function:', error);
  }
};

testEmail();
