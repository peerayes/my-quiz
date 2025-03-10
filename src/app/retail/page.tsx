"use client";

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
  const [productName, setProductName] = useState<string>("");
  const [buyingPrice, setBuyingPrice] = useState<string>("");
  const [profitMargin, setProfitMargin] = useState<string>("20");
  const [sellingPrice, setSellingPrice] = useState<string>("");
  const [encodedPrice, setEncodedPrice] = useState<string>("");
  const [bargainPrice, setBargainPrice] = useState<string>("");
  const [isBargainAcceptable, setIsBargainAcceptable] = useState<
    boolean | null
  >(null);
  const [showAdminPanel, setShowAdminPanel] = useState<boolean>(true);
  const [firstEncodingChar, setFirstEncodingChar] = useState<string>("A");
  const [secondEncodingChar, setSecondEncodingChar] = useState<string>("X");
  const [codeToCheck, setCodeToCheck] = useState("");
  const [decodedPrice, setDecodedPrice] = useState("");
  const [offerProductId, setOfferProductId] = useState<string | null>(null);

  // loading localStorage
  useEffect(() => {
    const savedProducts = localStorage.getItem("retailcode-products");
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts));
    }
  }, []);

  // save to localStorage
  useEffect(() => {
    localStorage.setItem("retailcode-products", JSON.stringify(products));
  }, [products]);

  const handleDecodeCheck = () => {
    if (codeToCheck.length >= 2) {
      setDecodedPrice(decodePrice(codeToCheck));
    } else {
      setDecodedPrice("");
    }
  };

  // Function to generate random character
  const generateRandomChar = (excludeChars: string[] = []): string => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const availableChars = chars
      .split("")
      .filter((char) => !excludeChars.includes(char));
    return availableChars[Math.floor(Math.random() * availableChars.length)];
  };

  // Function to encode the buying price
  const encodePrice = (
    price: string,
    firstChar: string,
    secondChar: string
  ): string => {
    if (!price || isNaN(Number(price))) return "";
    const priceStr = price.toString();
    let encoded = firstChar + secondChar;
    // Encode each digit
    for (let i = 0; i < priceStr.length; i++) {
      const digit = parseInt(priceStr[i]);
      // Check for consecutive duplicates
      if (i > 0 && priceStr[i] === priceStr[i - 1]) {
        encoded += secondChar;
      } else {
        // Map digit to character based on firstChar
        let charCode = firstChar.charCodeAt(0) + digit;
        // Wrap around if needed (to stay within A-Z)
        if (charCode > 90) charCode = charCode - 26;
        encoded += String.fromCharCode(charCode);
      }
    }
    return encoded;
  };

  // Function to decode the encoded price
  const decodePrice = (encoded: string): string => {
    if (!encoded || encoded.length < 2) return "";
    const firstChar = encoded[0];
    const secondChar = encoded[1];
    let decoded = "";
    // Skip the first two chars and decode the rest
    for (let i = 2; i < encoded.length; i++) {
      const currentChar = encoded[i];
      if (currentChar === secondChar) {
        // If it's the second char, it represents a duplicate
        if (decoded.length > 0) {
          decoded += decoded[decoded.length - 1];
        }
      } else {
        // Otherwise, map the character back to a digit
        let digit = currentChar.charCodeAt(0) - firstChar.charCodeAt(0);
        // Handle wrap-around
        if (digit < 0) digit += 26;
        decoded += digit;
      }
    }
    return decoded;
  };

  // Calculate selling price
  const calculateSellingPrice = (buying: string, profit: string): string => {
    const buyingVal = parseFloat(buying);
    const profitVal = parseFloat(profit);
    if (isNaN(buyingVal) || isNaN(profitVal)) return "";
    return (buyingVal * (1 + profitVal / 100)).toFixed(2);
  };

  // ฟังก์ชันเพิ่มสินค้าใหม่
  const addProduct = () => {
    const isDuplicatedCode = products.some(
      (p) => p.encodedPrice === encodedPrice
    );
    if (isDuplicatedCode) {
      let isUnique = false;
      let attempts = 0;
      let newFirstChar = "";
      let newSecondChar = "";
      let newEncodedPrice = "";
      while (!isUnique && attempts < 10) {
        newFirstChar = generateRandomChar();
        newSecondChar = generateRandomChar([newFirstChar]);
        newEncodedPrice = encodePrice(buyingPrice, newFirstChar, newSecondChar);
        isUnique = !products.some((p) => p.encodedPrice === newEncodedPrice);
        attempts++;
      }

      if (isUnique) {
        setFirstEncodingChar(newFirstChar);
        setSecondEncodingChar(newSecondChar);
        setEncodedPrice(newEncodedPrice);
        alert("Product code has been regenerated to avoid duplication.");
      } else {
        alert(
          "Unable to generate a unique product code after multiple attempts. Please try again later."
        );
        return;
      }
    }

    const newProduct: Product = {
      id: Date.now().toString(),
      name: productName,
      buyingPrice,
      sellingPrice,
      encodedPrice,
      profitMargin,
      firstEncodingChar,
      secondEncodingChar,
    };

    setProducts([...products, newProduct]);
    resetForm();
    setShowProductList(true);
  };

  // ฟังก์ชันรีเซ็ตฟอร์ม
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

  // ฟังก์ชันเลือกดูสินค้า
  const selectProduct = (product: Product, resetBargain: boolean = true) => {
    const currentBargainPrice = bargainPrice;
    resetForm();
    setCurrentProduct(product);
    setProductName(product.name);
    setBuyingPrice(product.buyingPrice);
    setProfitMargin(product.profitMargin);
    setSellingPrice(product.sellingPrice);
    setEncodedPrice(product.encodedPrice);
    setFirstEncodingChar(product.firstEncodingChar);
    setSecondEncodingChar(product.secondEncodingChar);
    setShowProductList(false);
    if (!resetBargain) {
      setBargainPrice(currentBargainPrice);
    }
  };

  // ฟังก์ชันลบสินค้า
  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    if (currentProduct && currentProduct.id === id) {
      resetForm();
      setCurrentProduct(null);
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const firstChar = generateRandomChar();
    const secondChar = generateRandomChar([firstChar]);

    const encoded = encodePrice(buyingPrice, firstChar, secondChar);
    const calculatedSellingPrice = calculateSellingPrice(
      buyingPrice,
      profitMargin
    );
    if (currentProduct) {
      const isDuplicatedCode = products.some(
        (p) => p.encodedPrice === encoded && p.id !== currentProduct.id
      );
      if (isDuplicatedCode) {
        let isUnique = false;
        let attempts = 0;
        let newFirstChar = firstChar;
        let newSecondChar = secondChar;
        let newEncoded = encoded;

        while (!isUnique && attempts < 10) {
          newFirstChar = generateRandomChar();
          newSecondChar = generateRandomChar([newFirstChar]);
          newEncoded = encodePrice(buyingPrice, newFirstChar, newSecondChar);

          isUnique = !products.some(
            (p) => p.encodedPrice === newEncoded && p.id !== currentProduct.id
          );
          attempts++;
        }

        if (isUnique) {
          alert("Product code has been regenerated to avoid duplication.");

          const updatedProducts = products.map((p) =>
            p.id === currentProduct.id
              ? {
                  ...p,
                  name: productName,
                  buyingPrice,
                  sellingPrice: calculatedSellingPrice,
                  encodedPrice: newEncoded,
                  profitMargin,
                  firstEncodingChar: newFirstChar,
                  secondEncodingChar: newSecondChar,
                }
              : p
          );

          setProducts(updatedProducts);
          setCurrentProduct(null);
          setFirstEncodingChar(newFirstChar);
          setSecondEncodingChar(newSecondChar);
          setEncodedPrice(newEncoded);
          setSellingPrice(calculatedSellingPrice);
          return;
        } else {
          alert(
            "Unable to generate a unique product code after multiple attempts. Please try again later."
          );
          return;
        }
      }
      const updatedProducts = products.map((p) =>
        p.id === currentProduct.id
          ? {
              ...p,
              name: productName,
              buyingPrice,
              sellingPrice: calculatedSellingPrice,
              encodedPrice: encoded,
              profitMargin,
              firstEncodingChar: firstChar,
              secondEncodingChar: secondChar,
            }
          : p
      );

      setProducts(updatedProducts);
      setCurrentProduct(null);
    }

    setFirstEncodingChar(firstChar);
    setSecondEncodingChar(secondChar);
    setEncodedPrice(encoded);
    setSellingPrice(calculatedSellingPrice);
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
        <div>
          <h2 className="text-xl font-semibold mb-4 text-black">Admin Panel</h2>

          {showProductList ? (
            <div>
              <h3 className="font-semibold mb-3 text-black">
                Product Inventory
              </h3>
              {products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600">
                        <th className="px-4 py-2 text-left">Product</th>
                        <th className="px-4 py-2 text-right">Cost</th>
                        <th className="px-4 py-2 text-right">Price</th>
                        <th className="px-4 py-2 text-center">Code</th>
                        <th className="px-4 py-2 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((product) => (
                        <tr key={product.id} className="border-b text-gray-700">
                          <td className="px-4 py-2">{product.name}</td>
                          <td className="px-4 py-2 text-right">
                            ${product.buyingPrice}
                          </td>
                          <td className="px-4 py-2 text-right">
                            ${product.sellingPrice}
                          </td>
                          <td className="px-4 py-2 text-center font-mono">
                            {product.encodedPrice}
                          </td>
                          <td className="px-4 py-2 text-center">
                            <button
                              onClick={() => selectProduct(product)}
                              className="px-2 py-1 bg-blue-500 text-white rounded mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => removeProduct(product.id)}
                              className="px-2 py-1 bg-red-500 text-white rounded"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No products added yet.</p>
              )}
            </div>
          ) : (
            <div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-500">
                    Product Name
                  </label>
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-black"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-500">
                    Buying Price
                  </label>
                  <input
                    type="number"
                    value={buyingPrice}
                    onChange={(e) => setBuyingPrice(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-black"
                    required
                    min="0"
                    step="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-500">
                    Profit Margin (%)
                  </label>
                  <input
                    type="number"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-black"
                    required
                    min="0"
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Calculate
                  </button>
                  {encodedPrice && (
                    <button
                      type="button"
                      onClick={addProduct}
                      className="flex-1 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      {currentProduct ? "Update Product" : "Save Product"}
                    </button>
                  )}
                </div>
              </form>

              {encodedPrice && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg text-black">
                  <h3 className="font-semibold mb-2">Results:</h3>
                  <p>
                    <span className="font-medium">Product:</span> {productName}
                  </p>
                  <p>
                    <span className="font-medium">Buying Price:</span> $
                    {buyingPrice}
                  </p>
                  <p>
                    <span className="font-medium">Selling Price:</span> $
                    {sellingPrice}
                  </p>
                  <p>
                    <span className="font-medium">Encoded Price:</span>{" "}
                    <span className="text-blue-600 font-mono">
                      {encodedPrice}
                    </span>
                  </p>
                  <div className="mt-4 bg-gray-100 p-4 rounded-md">
                    <h4 className="font-medium mb-2">Encoding Information:</h4>
                    <p className="text-sm font-mono">
                      First character ({firstEncodingChar}): Maps to digits (
                      {firstEncodingChar}=0,{" "}
                      {String.fromCharCode(firstEncodingChar.charCodeAt(0) + 1)}
                      =1,{" "}
                      {String.fromCharCode(firstEncodingChar.charCodeAt(0) + 2)}
                      =2, ...)
                    </p>
                    <p className="text-sm font-mono">
                      Second character ({secondEncodingChar}): Used for
                      consecutive duplicates
                    </p>
                    <p className="text-sm font-mono mb-2">
                      Result: {buyingPrice} → {encodedPrice}
                    </p>

                    <div className="mt-4 bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
                      <div className="flex mb-2">
                        <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                        <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                      </div>

                      <pre className="font-mono text-sm">
                        <span className="text-gray-500">
                          {" // Encode function "}
                        </span>
                        <br />
                        <span className="text-pink-400">function</span>{" "}
                        <span className="text-blue-400">encode</span>(
                        <span className="text-orange-400">price</span>) {"{"}
                        <br />
                        <span className="text-pink-400">const</span> firstChar ={" "}
                        <span className="text-green-400">
                          &apos;{firstEncodingChar}&apos;
                        </span>
                        ;
                        <br />
                        <span className="text-pink-400">const</span> secondChar
                        ={" "}
                        <span className="text-green-400">
                          &apos;{secondEncodingChar}&apos;
                        </span>
                        ;
                        <br />
                        <span className="text-pink-400">let</span> result =
                        firstChar + secondChar;
                        <br />
                        <span className="text-pink-400">for</span> (
                        <span className="text-pink-400"> let</span> i = 0; i
                        &lt; price.length; i++) {"{"}
                        <br />
                        <span className="text-pink-400">if</span> (i {">"} 0 &&
                        price[i] === price[i-1]) {"{"}
                        <br />
                        result += secondChar;
                        <br />
                        {"}"} <span className="text-pink-400">else</span> {"{"}
                        <br />
                        result += String.fromCharCode(firstChar.charCodeAt(0) +{" "}
                        <span className="text-pink-400">parseInt</span>
                        (price[i]));
                        <br />
                        {"}"}
                        <br />
                        {"}"}
                        <br />
                        <span className="text-pink-400">return</span> result;
                        <br />
                        {"}"}
                        <br />
                        <br />
                        <span className="text-gray-500">
                          {" // Decode function "}
                        </span>
                        <br />
                        <span className="text-pink-400">function</span>{" "}
                        <span className="text-blue-400">decode</span>(
                        <span className="text-orange-400">encoded</span>) {"{"}
                        <br />
                        <span className="text-pink-400">const</span> firstChar =
                        encoded[0];
                        <br />
                        <span className="text-pink-400">const</span> secondChar
                        = encoded[1];
                        <br />
                        <span className="text-pink-400">let</span> result ={" "}
                        <span className="text-green-400">&quot;&quot;</span>;
                        <br />
                        <span className="text-pink-400">for</span> (
                        <span className="text-pink-400">let</span> i = 2; i &lt;
                        encoded.length; i++) {"{"}
                        <br />
                        <span className="text-pink-400">if</span> (encoded[i]
                        === secondChar) {"{"}
                        <br />
                        result += result[result.length - 1];
                        <br />
                        {"}"} <span className="text-pink-400">else</span> {"{"}
                        <br />
                        result += (encoded[i].charCodeAt(0) -
                        firstChar.charCodeAt(0));
                        <br />
                        {"}"}
                        <br />
                        {"}"}
                        <br />
                        <span className="text-pink-400">return</span> result;
                        <br />
                        {"}"}
                      </pre>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm mb-1">
                        <strong>Verification:</strong>
                      </p>
                      <p className="text-sm">
                        Decoded value:{" "}
                        <span className="font-mono">
                          {decodePrice(encodedPrice)}
                        </span>
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Share the selling price with customers. Use the encoded
                    price to verify bargains.
                  </p>
                  <div className="mt-4 pt-4 border-t">
                    <h3 className="font-semibold mb-2">Check Bargain:</h3>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={bargainPrice}
                        onChange={(e) => {
                          setBargainPrice(e.target.value);
                          if (e.target.value) {
                            const encoded = encodePrice(
                              e.target.value,
                              firstEncodingChar,
                              secondEncodingChar
                            );
                            setCodeToCheck(encoded);
                          } else {
                            setCodeToCheck("");
                          }
                        }}
                        className="flex-1 px-3 py-2 border rounded"
                        placeholder="Enter bargain price"
                        min="0"
                        step="1"
                      />
                      <button
                        onClick={checkBargain}
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                      >
                        Check
                      </button>
                    </div>

                    {bargainPrice && (
                      <div className="mt-2 font-mono">
                        Encoded:{" "}
                        <span className="font-bold">
                          {encodePrice(
                            bargainPrice,
                            firstEncodingChar,
                            secondEncodingChar
                          )}
                        </span>
                      </div>
                    )}

                    {isBargainAcceptable !== null && (
                      <p
                        className={`mt-2 ${
                          isBargainAcceptable
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {isBargainAcceptable
                          ? "✅ Bargain is acceptable - above buying price"
                          : "❌ Bargain is too low - below buying price"}
                      </p>
                    )}
                  </div>

                  <div className="mt-6 pt-4 border-t">
                    <h3 className="font-semibold mb-2">Decode Price Code:</h3>
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={codeToCheck}
                        onChange={(e) => {
                          setCodeToCheck(e.target.value);
                          if (e.target.value.length >= 2) {
                            setDecodedPrice(decodePrice(e.target.value));
                          } else {
                            setDecodedPrice("");
                          }
                        }}
                        className="flex-1 px-3 py-2 border rounded"
                        placeholder="Enter encoded price"
                      />
                      <button
                        onClick={handleDecodeCheck}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                      >
                        Decode
                      </button>
                    </div>

                    {decodedPrice && (
                      <p className="mt-2 font-mono">
                        Decoded buying price:{" "}
                        <span className="font-bold">${decodedPrice}</span>
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        // Customer View
        <div className="rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-black">
            Product Information
          </h2>

          {products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {products.map((product) => (
                <div key={product.id} className="border p-4 rounded-lg">
                  <h3 className="text-lg font-medium text-black">
                    {product.name}
                  </h3>
                  <p className="text-2xl font-bold text-blue-600 my-2">
                    ${parseInt(product.sellingPrice).toLocaleString()}
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
                    <h4 className="font-medium mb-2 text-black">
                      Make an offer:
                    </h4>
                    <div className="flex space-x-2">
                      <input
                        type="number"
                        value={
                          offerProductId === product.id ? bargainPrice : ""
                        }
                        onChange={(e) => {
                          setOfferProductId(product.id);
                          setBargainPrice(e.target.value);
                          setIsBargainAcceptable(null);
                        }}
                        className="flex-1 px-3 py-2 border rounded text-black"
                        placeholder="Your offer"
                        min="0"
                        step="1"
                      />
                      <button
                        onClick={() => {
                          setOfferProductId(product.id);
                          setCurrentProduct(product);
                          setBuyingPrice(product.buyingPrice);
                          setSellingPrice(product.sellingPrice);
                          checkBargain();
                        }}
                        className="px-4 py-2 bg-orange-500 text-white text-[14px] rounded hover:bg-orange-600"
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
      )}
    </div>
  );
};

export default PriceEncoderApp;
