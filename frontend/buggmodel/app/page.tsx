import Image from "next/image";
import ClayComponent from "./components/ClayComponent";
import LoadFile from "./components/LoadFile";
import RenderWalls from "./components/RenderWalls";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
        {/* <ClayComponent /> */}
        {/* <LoadFile /> */}
        <RenderWalls />
    </main>
  );
}
