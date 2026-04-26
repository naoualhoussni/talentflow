async function debug() {
  const loginRes = await fetch('http://localhost:5000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@talentflow.com', password: 'admin' }) // super admin
  });

  let token = '';
  if(!loginRes.ok) {
     // try the candidate
     const loginRes2 = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'david@talent.com', password: 'david' }) 
     });
     if(!loginRes2.ok) {
        console.log('Login failed for both:', await loginRes2.text());
        return;
     }
     token = (await loginRes2.json()).token;
  } else {
     token = (await loginRes.json()).token;
  }

  const res = await fetch('http://localhost:5000/api/ai/parse-cv', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ cvText: 'David is a React developer' })
  });

  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Body:', text);
}

debug();
