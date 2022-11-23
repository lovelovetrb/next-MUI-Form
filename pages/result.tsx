import { useRouter } from "next/router";
import React from "react";

const result = () => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const router = useRouter();
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>Result</h1>
      <div style={{ marginLeft: "2rem" }}>
        <p>email：{router.query.email}</p>
        <p>HashedPassword：{router.query.password}</p>
      </div>
    </div>
  );
};

export default result;
