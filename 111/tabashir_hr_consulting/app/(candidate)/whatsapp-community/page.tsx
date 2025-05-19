import Link from "next/link";
import { UserProfileHeader } from "../dashboard/_components/user-profile-header";

export default function WhatsappCommunityPage() {
  // You can replace this with your actual WhatsApp group link
  const whatsappGroupLink = "https://chat.whatsapp.com/your-group-link";

  return (
    <div className=" min-h-[calc(100vh-140px)]">
      <div className="w-full flex justify-end">
        <UserProfileHeader />
      </div>
      <div className="flex border items-center justify-center min-h-[calc(100vh-100px)] w-full">
        <div className="bg-white rounded-lg shadow-sm p-8 max-w-md w-full">
          <div className="text-center space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              To Get the latest update from Tabashir
            </h1>

            <p className="text-lg text-gray-700">
              Join this Whatsapp Community
            </p>

            <div className="pt-4">
              <Link
                href={whatsappGroupLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block w-full bg-green-700 hover:bg-green-800 text-white font-medium py-3 px-4 rounded-md transition-colors"
              >
                Let me Join Community
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
