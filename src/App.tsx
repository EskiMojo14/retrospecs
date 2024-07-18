import { Breadcrumb, Breadcrumbs } from "@/components/breadcrumbs";
import { Link } from "@/components/link";
import { Categories } from "@/features/feedback/category";
import { Logo } from "@/features/logo";

function App() {
  return (
    <>
      <div className="header">
        <Breadcrumbs style={{ "--text-color-rgb": "var(--off-white-rgb)" }}>
          <Breadcrumb>
            <Logo as={Link} href="/" />
          </Breadcrumb>
          <Breadcrumb>
            <Link href="/orgs/1">Market Dojo</Link>
          </Breadcrumb>
          <Breadcrumb>
            <Link href="/orgs/1/teams/1">Blue</Link>
          </Breadcrumb>
        </Breadcrumbs>
      </div>
      <Categories />
    </>
  );
}

export default App;
