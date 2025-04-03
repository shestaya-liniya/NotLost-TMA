import {
  telegramActionSendCode,
  telegramActionSignIn,
  telegramActionSignInWithPassword,
} from "@/lib/telegram/api/telegram-actions";
import Input from "@/ui/Input";
import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import Lottie from "lottie-react";
import utyaSendCode from "@/assets/lottie/utya-send-code.json";
import utyaSuccess from "@/assets/lottie/utya-success.json";

import countryCodes from "@/assets/country-codes.json";
import ChevronRight from "@/assets/icons/chevron-right.svg?react";
import Tappable from "@/ui/Tappable";
import Pencil from "@/assets/icons/pencil-icon.svg?react";
import { AlertModal } from "@/ui/modals/Modal";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { useJazzProfileContext } from "@/lib/jazz/jazz-provider";
import { useModalStore } from "@/lib/store/modal-store";
import { getTelegramDialogsAndSetToStore } from "@/App";
import { useTelegramSession } from "@/helpers/telegram/telegram-session";

export default function TelegramSignIn() {
  const { jazzProfile } = useJazzProfileContext();
  const { setTelegramSignInModalOpen } = useModalStore();
  const { setSession } = useTelegramSession();

  const saveTelegramSession = useCallback((session: string) => {
    setSession(session);
  }, []);

  const [step, setStep] = useState<"phone" | "code" | "password" | "success">(
    "phone"
  );

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneCode, setPhoneCode] = useState("");
  const [password, setPassword] = useState("");

  const alertModal = AlertModal.getInstance();

  useEffect(() => {
    if (step === "success") {
      setTimeout(() => {
        setTelegramSignInModalOpen(false);
        getTelegramDialogsAndSetToStore();
      }, 2500);
    }
  }, [step]);

  const handleSignIn = () => {
    telegramActionSignIn(
      phoneNumber.replace("+", ""),
      phoneCode,
      password,
      saveTelegramSession
    ).then((res) => {
      if (res instanceof Error) {
        if (res.message.includes("Password is empty")) {
          setStep("password");
        } else {
          alertModal.show("<div>Invalid code</div>");
        }
      } else {
        setStep("success");
        jazzProfile.telegramSync = true;
      }
    });
  };

  const handleSignInWithPassword = () => {
    telegramActionSignInWithPassword(password, saveTelegramSession).then(
      (res) => {
        if (res instanceof Error) {
          alertModal.show("<div>Invalid password</div>");
        } else {
          setStep("success");
          jazzProfile.telegramSync = true;
        }
      }
    );
  };

  return (
    <div className="flex flex-col h-full items-center">
      <div className="space-y-4 w-full max-w-64 flex flex-col items-center pt-32">
        <div className="h-[160px] w-[160px]">
          <Lottie animationData={utyaSendCode} loop={true} />
        </div>
        <div className="text-hint text-center pb-8">
          Telegram offers a secure way to sync your chats with NotLost using
          phone number authentication
        </div>
        <AnimatePresence></AnimatePresence>
        {step === "phone" && (
          <div className="space-y-4">
            <div className="relative">
              <select
                className="w-full bg-primary rounded-xl p-2 pr-4 appearance-none"
                onChange={(event) => setPhoneNumber("+" + event.target.value)}
              >
                {countryCodes.map((item) => (
                  <option key={item.name} value={item.code}>
                    {item.flag} {item.name}
                  </option>
                ))}
              </select>
              <ChevronRight className="h-4 w-4 absolute right-2 top-[12px] text-link pointer-events-none" />
            </div>
            <PhoneInput
              placeholder="Phone number"
              value={phoneNumber}
              onChange={(val) => setPhoneNumber(val as string)}
              className="bg-primary p-2 pl-4 rounded-xl outline-none"
            />
            <Tappable
              className="bg-button text-center py-2 text-white rounded-xl w-full font-semibold"
              onClick={() => {
                telegramActionSendCode(phoneNumber).then((res) => {
                  if (res) {
                    setStep("code");
                  } else {
                    alertModal.show("<div>Invalid phone number</div>");
                  }
                });
              }}
            >
              Send code
            </Tappable>
          </div>
        )}

        {step === "code" && (
          <div className="flex flex-col items-center">
            <div className="flex text-xl items-center gap-2 text-hint pb-2">
              <PhoneInput
                placeholder="Phone number"
                value={phoneNumber}
                onChange={(val) => setPhoneNumber(val as string)}
                readOnly
              />
              <Pencil
                className="h-5 w-5 text-link"
                onClick={() => setStep("phone")}
              />
            </div>
            <Input
              label="12345"
              value={phoneCode}
              onInput={(value) => setPhoneCode(value)}
            />
            <Tappable
              className="bg-button text-center py-2 text-white rounded-xl w-full font-semibold mt-4"
              onClick={handleSignIn}
            >
              Enter
            </Tappable>
          </div>
        )}

        {step === "password" && (
          <div>
            <Input
              label="2FA password"
              value={password}
              onInput={(value) => setPassword(value)}
              type="password"
            />
            <Tappable
              className="bg-button text-center py-2 text-white rounded-xl w-full font-semibold mt-4"
              onClick={handleSignInWithPassword}
            >
              Enter
            </Tappable>
          </div>
        )}

        {step === "success" && (
          <div>
            <div className="h-[160px] w-[160px]">
              <Lottie animationData={utyaSuccess} loop={true} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
