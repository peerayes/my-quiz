"use client";

import Image from "next/image";

interface LoginPageProps {
  data: typeof import("@/constant/loginData").loginPageData;
}

export default function LoginPage({ data }: LoginPageProps) {
  return (
    <div className="container md:max-w-[390px] mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-300">
        <button
          aria-label={data.header.backButtonAriaLabel}
          className="text-gray-500 flex items-center justify-center w-[32px] h-[32px] cursor-pointer"
        >
          <Image src="/ic-back.svg" alt="Back" width={12} height={12} />
        </button>
        <h1 className="text-lg font-medium text-center flex-1 text-black">
          {data.header.title}
        </h1>
        <button
          aria-label={data.header.closeButtonAriaLabel}
          className="text-gray-500 flex items-center justify-center w-[32px] h-[32px] cursor-pointer"
        >
          <Image src="/ic-close.svg" alt="Back" width={16} height={16} />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Illustration */}
        <div className="flex justify-center my-6">
          <div className="relative">
            <Image
              src={data.images.successIllustration || "/placeholder.svg"}
              alt="Success illustration"
              width={200}
              height={200}
              className="mx-auto"
            />
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {data.successMessage.title}
          </h2>
          <p className="text-gray-500">{data.successMessage.subtitle}</p>
          <p className="text-gray-500">{data.successMessage.approvalText}</p>
        </div>

        {/* Amount Section */}
        <div className="border-t border-b py-4 mb-4 border-gray-300">
          <div className="flex justify-between items-center">
            <span className="text-gray-500">{data.amountSection.label}</span>
            <span className="text-xl font-bold text-black">
              {data.amountSection.amount}
            </span>
          </div>
        </div>

        {/* Legal Text */}
        <div className="text-xs text-gray-400 text-center my-8">
          {data.legalText}
        </div>

        {/* Button */}
        <button className="w-full bg-[#f7813e] hover:bg-[#e67535] text-white font-medium py-3 px-4 rounded-full transition duration-200">
          {data.buttonText}
        </button>
      </div>
    </div>
  );
}
