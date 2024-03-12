'use client'
import Test from "./components/Test";
import ClayComponent from "./components/ClayComponent";
import LoadFile from "./components/LoadFile";
import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha"
import { checkCaptcha } from "./utils/checkCaptcha";


export default function Home() {

  const [isChecked, setIsChecked] = useState(false);

  async function handleCaptcha(token: string | null) {
    await checkCaptcha(token).then(() => {
      setIsChecked(true);
    });
  }

  return (
    <>
      {!isChecked ?
        <div className="w-screen h-screen flex justify-center items-center">
          <ReCAPTCHA
            sitekey={`6LeWVn0nAAAAADhPOJ8eaf9f5yGaLc2Y80bPVC3M`}
            onChange={handleCaptcha}
            className=""
          />
        </div>
        :
        <main className="flex min-h-screen flex-col">
          <ClayComponent />
        </main>
      }
    </>
  );
}
