import { useState } from "react";

export function AdminHome() {
  const [inputPassword, setInputPassword] = useState("");

  const handleLogin = () => {
    localStorage.setItem("dmoiadminPassword", inputPassword);
  };

  return (
    <div>
      <input
        type="password"
        value={inputPassword}
        onChange={(event) => setInputPassword(event.target.value)}
        placeholder="Mot de passe admin"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}
