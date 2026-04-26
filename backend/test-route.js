async function testRoute() {
  try {
    // Note: We'll fake a token depending on if it requires auth. 
    // Wait, doing an HTTP request inside the backend without a valid jwt token might fail with 401.
    // Let's first register or login to get a token.
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'david@talent.com', password: 'password123' })
    });
    
    if(!loginRes.ok) {
      console.log('Login failed:', await loginRes.text());
      return;
    }
    
    const { token } = await loginRes.json();

    console.log('Token format:', token.substring(0, 10) + '...');

    const res = await fetch('http://localhost:5000/api/ai/parse-cv', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ cvText: 'David is a React developer with 5 years experience.' })
    });

    if (res.ok) {
      console.log('Success:', await res.json());
    } else {
      console.error('Error status:', res.status);
      console.error('Error body:', await res.text());
    }
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

testRoute();
