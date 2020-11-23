import { useEffect } from "react";
import Link from "next/link";

export default () => {
  useEffect(() => {
    fetch("/_/api/expectations").then(async (res) => {
      const exps = await res.json();
      console.info("EXPECTATIONS ", exps);
    });
  });
  return (
    <div>
      <header>
        <Link href="expectations/add">
          <button>Add Expectation</button>
        </Link>
        <nav>
          <ul>
            <li>
              <Link href="/expectations">Expectations</Link>
            </li>
            <li>
              <Link href="/">Records</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};
