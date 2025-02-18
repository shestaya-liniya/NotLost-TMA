import { $sendCode, $signIn } from "@/actions/telegram";
import Button from "@/ui/Button";
import Input from "@/ui/Input";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

export default function TelegramSignIn() {
  const [step, setStep] = useState(0);

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex flex-col h-full justify-center items-center">
      <div className="space-y-4 w-full max-w-64">
        <div className="font-medium text-center text-2xl text-link">
          Telegram Sync
        </div>
        <AnimatePresence></AnimatePresence>
        {step === 0 && (
          <div className="space-y-4">
            <Input
              label="123 456 789"
              value={phoneNumber}
              onInput={(value) => setPhoneNumber(value)}
              before={<div>+</div>}
            />
            <Button
              title="Send code"
              onClick={() => {
                $sendCode(phoneNumber);
              }}
            />
          </div>
        )}

        {step === 0 && (
          <Input
            label="12345"
            value={phoneCode}
            onInput={(value) => setPhoneCode(value)}
          />
        )}

        {step === 0 && (
          <div>
            <Input
              label="******"
              value={password}
              onInput={(value) => setPassword(value)}
            />
            <Button
              title="Sign in"
              onClick={() => {
                $signIn(phoneNumber, phoneCode, password);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
