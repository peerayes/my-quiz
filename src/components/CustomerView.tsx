"use client";

import type React from "react";
import { useState } from "react";

interface Product {
  id: string;
  name: string;
  buyingPrice: string;
  sellingPrice: string;
  encodedPrice: string;
  profitMargin: string;
  firstEncodingChar: string;
  secondEncodingChar: string;
}

interface CustomerViewProps {
  products: Product[];
  onOfferSubmit: (productId: string, offerPrice: string) => void;
  currentProduct: Product | null;
  isBargainAcceptable: boolean | null;
  bargainPrice: string;
  calculateProfitPercentage: () => number;
}

const CustomerView: React.FC<CustomerViewProps> = ({
  products,
  onOfferSubmit,
  currentProduct,
  isBargainAcceptable,
  bargainPrice,
  calculateProfitPercentage,
}) => {
  const [productOffers, setProductOffers] = useState<{ [key: string]: string }>(
    {}
  );

  return (
    <div className="rounded-lg">
      <h2 className="text-xl font-semibold mb-4 text-black">
        Product Information
      </h2>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="border p-4 rounded-lg">
              <h3 className="text-lg font-medium text-black">{product.name}</h3>
              <p className="text-2xl font-bold text-blue-600 my-2">
                ${Number.parseInt(product.sellingPrice).toLocaleString()}
              </p>
              <div className="bg-gray-100 p-3 rounded-md mb-3">
                <p className="text-sm text-gray-500">Product Code</p>
                <p className="font-mono text-gray-700">
                  {product.encodedPrice}
                </p>
              </div>

              <p className="text-sm text-gray-500 mb-3">
                This is our best price for today!
              </p>
              <div className="mt-4">
                <h4 className="font-medium mb-2 text-black">Make an offer:</h4>

                <div className="relative">
                  <input
                    type="text"
                    data-product-id={product.id}
                    value={productOffers[product.id] || ""}
                    onChange={(e) => {
                      const numericValue = e.target.value.replace(
                        /[^0-9]/g,
                        ""
                      );
                      setProductOffers((prev) => ({
                        ...prev,
                        [product.id]: numericValue,
                      }));
                    }}
                    className="w-full px-3 py-2 pr-16 border rounded text-black"
                    placeholder="Your offer"
                    min="0"
                    step="1"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const offerPrice = productOffers[product.id] || "";
                      if (offerPrice) {
                        onOfferSubmit(product.id, offerPrice);
                        const updatedOffers = { [product.id]: offerPrice };
                        setProductOffers(updatedOffers);
                      }
                    }}
                    className="absolute right-0 top-0 bottom-0 px-4 bg-orange-500 text-white text-sm font-medium rounded-r hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 z-10"
                  >
                    Offer
                  </button>
                </div>

                {currentProduct?.id === product.id &&
                  isBargainAcceptable !== null && (
                    <>
                      <div className="mt-3 p-3 bg-gray-200 rounded">
                        <p
                          className={
                            isBargainAcceptable
                              ? "text-green-600"
                              : "text-orange-600"
                          }
                        >
                          {isBargainAcceptable
                            ? "Your offer has been accepted!"
                            : "We cannot accept this offer. Please consider a different price."}
                        </p>
                      </div>

                      {/* Progress Bar for Profit */}
                      {bargainPrice && (
                        <div className="mt-4">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm font-medium text-gray-700">
                              Profit Margin
                            </span>
                            {calculateProfitPercentage() > 0 ? (
                              <span className="text-sm font-medium text-green-600">
                                {calculateProfitPercentage().toFixed(1)}%
                              </span>
                            ) : (
                              <span className="text-sm font-medium text-red-600">
                                0% (At Cost)
                              </span>
                            )}
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                              className={`h-2.5 rounded-full ${
                                calculateProfitPercentage() > 0
                                  ? "bg-green-600"
                                  : "bg-red-600"
                              }`}
                              style={{
                                width: `${Math.max(
                                  0,
                                  Math.min(100, calculateProfitPercentage())
                                )}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </>
                  )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">
          No product selected. Please ask a staff member for assistance.
        </p>
      )}
    </div>
  );
};

export default CustomerView;
