"use client"

import Link from "next/link";
import { useTranslation } from "@/lib/use-translation";

export default function WhatsappCommunityPage() {
  const { t, isRTL } = useTranslation();
  // You can replace this with your actual WhatsApp group link
  const whatsappGroupLink = "https://whatsapp.com/channel/0029VbAat9u9sBI5JEzjmr01";

  return (
    <div className={`flex items-center justify-center py-8 sm:py-20 lg:py-40 w-full px-4 ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="bg-white rounded-lg p-6 sm:p-8 max-w-xl w-full pt-8 sm:pt-[60px] shadow-lg">
        <div className="text-center space-y-4 sm:space-y-6">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 leading-normal">
            {t("latestUpdateFrom")}
          </h1>

          <p className="text-base sm:text-lg text-gray-700 mb-6 sm:mb-12">
            {t("joinWhatsappCommunity")}
          </p>

          <div className="pt-2 sm:pt-4 mb-8 sm:mb-20">
            <Link
              href={whatsappGroupLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block w-full max-w-sm mx-auto bg-gradient-to-r from-green-700 to-green-800 hover:from-green-800 hover:to-green-900 text-white font-medium py-3 px-4 rounded-md transition-colors text-center"
            >
              {t("letMeJoinCommunity")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
