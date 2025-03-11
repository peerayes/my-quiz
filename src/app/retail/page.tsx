"use client";

import AdminPanel from "@/components/AdminPanel";
import CustomerView from "@/components/CustomerView";
import React, { useEffect, useState } from "react";

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

const PriceEncoderApp: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [showProductList, setShowProductList] = useState<boolean>(false);
  const [, setProductName] = useState<string>("");
  const [buyingPrice, setBuyingPrice] = useState<string>("");
  const [, setProfitMargin] = useState<string>("20");
  const [sellingPrice, setSellingPrice] = useState<string>("");
  const [, setEncodedPrice] = useState<string>("");
  const [bargainPrice, setBargainPrice] = useState<string>("");
  const [isBargainAcceptable, setIsBargainAcceptable] = useState<
    boolean | null
  >(null);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(true);
  const [, setFirstEncodingChar] = useState<string>("A");
  const [, setSecondEncodingChar] = useState<string>("X");
  const [, setCodeToCheck] = useState("");
  const [, setDecodedPrice] = useState("");
  const [, setOfferProductId] = useState<string | null>(null);

  useEffect(() => {
    const savedProducts = localStorage.getItem("retailcode-products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("retailcode-products", JSON.stringify(products));
  }, [products]);

  const resetForm = () => {
    setProductName("");
    setBuyingPrice("");
    setProfitMargin("20");
    setSellingPrice("");
    setEncodedPrice("");
    setFirstEncodingChar("A");
    setSecondEncodingChar("X");
    setBargainPrice("");
    setIsBargainAcceptable(null);
    setCodeToCheck("");
    setDecodedPrice("");
  };

  const checkBargain = (): void => {
    const buyingVal = parseFloat(buyingPrice);
    const bargainVal = parseFloat(bargainPrice);
    if (isNaN(buyingVal) || isNaN(bargainVal)) {
      setIsBargainAcceptable(null);
      return;
    }
    setIsBargainAcceptable(bargainVal >= buyingVal);
  };

  const toggleView = (): void => {
    if (!showAdminPanel) {
      setShowAdminPanel(true);
      setShowProductList(true);
      resetForm();
    } else {
      setShowAdminPanel(false);
      setBargainPrice("");
      setIsBargainAcceptable(null);
      setCurrentProduct(null);
    }
  };

  const calculateProfitPercentage = (): number => {
    const buyingVal = parseFloat(buyingPrice);
    const bargainVal = parseFloat(bargainPrice);
    const sellingVal = parseFloat(sellingPrice);
    if (isNaN(buyingVal) || isNaN(bargainVal) || isNaN(sellingVal)) {
      return 0;
    }
    if (bargainVal <= buyingVal) {
      return 0;
    }
    const maxProfit = sellingVal - buyingVal;
    const currentProfit = bargainVal - buyingVal;
    const profitPercentage = (currentProfit / maxProfit) * 100;
    return profitPercentage;
  };

  const handleOfferSubmit = (productId: string, offerPrice: string) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      setCurrentProduct(null);
      setIsBargainAcceptable(null);
      setBargainPrice("");
      setOfferProductId(productId);
      setCurrentProduct(product);
      setBuyingPrice(product.buyingPrice);
      setSellingPrice(product.sellingPrice);
      setBargainPrice(offerPrice);
      const buyingVal = parseFloat(product.buyingPrice);
      const bargainVal = parseFloat(offerPrice);
      if (isNaN(buyingVal) || isNaN(bargainVal)) {
        setIsBargainAcceptable(null);
      } else {
        setIsBargainAcceptable(bargainVal >= buyingVal);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-center text-black">
        RetailCode: Smart Price Encoder System
      </h1>

      <div className="flex justify-between mb-4">
        {showAdminPanel && (
          <button
            onClick={() => setShowProductList(!showProductList)}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            {showProductList ? "New Product" : "Products List"}
          </button>
        )}
        <button
          onClick={toggleView}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Switch to {showAdminPanel ? "Customer" : "Admin"} View
        </button>
      </div>

      {showAdminPanel ? (
        <AdminPanel
          products={products}
          setProducts={setProducts}
          currentProduct={currentProduct}
          setCurrentProduct={setCurrentProduct}
          showProductList={showProductList}
          setShowProductList={setShowProductList}
          setShowAdminPanel={setShowAdminPanel}
          resetForm={resetForm}
          setBargainPrice={setBargainPrice}
          setIsBargainAcceptable={setIsBargainAcceptable}
        />
      ) : (
        <CustomerView
          products={products}
          onOfferSubmit={handleOfferSubmit}
          currentProduct={currentProduct}
          isBargainAcceptable={isBargainAcceptable}
          bargainPrice={bargainPrice}
          calculateProfitPercentage={calculateProfitPercentage}
        />
      )}
    </div>
  );
};

export default PriceEncoderApp;
