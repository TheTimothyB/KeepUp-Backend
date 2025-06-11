import { useState, ChangeEvent } from 'react';
import axios from 'axios';

export default function Register() {
  const [accountName, setAccountName] = useState('');
  const [accountId, setAccountId] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const createAccount = async () => {
    const res = await axios.post<{ id: number }>('/accounts', {
      name: accountName,
    });
    setAccountId(res.data.id);
  };

  const register = async () => {
    if (accountId == null) return;
    await axios.post(`/accounts/${accountId}/users`, { email, password });
  };

  return (
    <div>
      {accountId == null ? (
        <div>
          <input
            value={accountName}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setAccountName(e.target.value)
            }
            placeholder="Account name"
          />
          <button onClick={createAccount}>Create Account</button>
        </div>
      ) : (
        <div>
          <input
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            placeholder="Email"
          />
          <input
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            placeholder="Password"
          />
          <button onClick={register}>Register</button>
        </div>
      )}
    </div>
  );
}
