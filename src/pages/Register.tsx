import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const [accountName, setAccountName] = useState('');
  const [accountId, setAccountId] = useState<number | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const createAccount = async () => {
    const res = await axios.post('/accounts', { name: accountName });
    setAccountId(res.data.id);
  };

  const register = async () => {
    if (accountId == null) return;
    await axios.post(`/accounts/${accountId}/users`, { username, password });
  };

  return (
    <div>
      {accountId == null ? (
        <div>
          <input
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
            placeholder="Account name"
          />
          <button onClick={createAccount}>Create Account</button>
        </div>
      ) : (
        <div>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
          <button onClick={register}>Register</button>
        </div>
      )}
    </div>
  );
}
