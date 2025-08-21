import { useState } from "react";
import Scene1Promise from "./Scene1Promise";
import Scene2Box from "./Scene2Box";
import Scene3Key from "./Scene3Key";
import Scene4Prepare from "./Scene4Prepare";

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [boxItems, setBoxItems] = useState("");
  const [trustedName, setTrustedName] = useState("");

  const goBack = () => setStep((s) => Math.max(1, s - 1));
  const goNext = () => setStep((s) => Math.min(4, s + 1));

  if (step === 1) {
    return <Scene1Promise onNext={goNext} />;
  }
  if (step === 2) {
    return (
      <Scene2Box
        initialItems={boxItems}
        onBack={goBack}
        onNext={(items) => {
          setBoxItems(items);
          goNext();
        }}
      />
    );
  }
  if (step === 3) {
    return (
      <Scene3Key
        initialTrustedName={trustedName}
        onBack={goBack}
        onNext={(name) => {
          setTrustedName(name);
          goNext();
        }}
      />
    );
  }
  return <Scene4Prepare onBack={goBack} />;
}

