import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/admin/")({
  component: RouteComponent,
});

function RouteComponent() {
  const [inputPassword, setInputPassword] = useState("");

  const handleLogin = () => {
    const encrypted = btoa(inputPassword);
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
