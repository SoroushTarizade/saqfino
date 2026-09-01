import Header from "@/components/header/Header";
import Help from "@/components/help/Help";
import Hero from "@/components/hero/Hero";
import Look from "@/components/look/Look";
import Moshavere from "@/components/moshavere/Moshavere";
import New from "@/components/new/New";

export default function Home() {
  return (
    <>
      {/* <Header /> */}
      <Hero></Hero>
      <Help></Help>
      <Look></Look>
      <Moshavere></Moshavere>
      <New></New>
      <main>
        {/* Homepage content */}
      </main>
    </>
  );
}