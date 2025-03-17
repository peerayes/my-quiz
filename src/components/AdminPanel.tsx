"use client";

import React, { useState } from "react";
import CodeSnippet from "./CodeSnippet";

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

interface AdminPanelProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  currentProduct: Product | null;
  setCurrentProduct: React.Dispatch<React.SetStateAction<Product | null>>;
  setShowProductList: React.Dispatch<React.SetStateAction<boolean>>;
  showProductList: boolean;
  setShowAdminPanel: React.Dispatch<React.SetStateAction<boolean>>;
  resetForm: () => void;
  setBargainPrice: React.Dispatch<React.SetStateAction<string>>;
  setIsBargainAcceptable: React.Dispatch<React.SetStateAction<boolean | null>>;
}

const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  setProducts,
  currentProduct,
  setCurrentProduct,
  showProductList,
  setShowProductList,
  setBargainPrice,
  setIsBargainAcceptable,
}) => {
  const [productName, setProductName] = useState<string>("");
  const [buyingPrice, setBuyingPrice] = useState<string>("");
  const [profitMargin, setProfitMargin] = useState<string>("20");
  const [sellingPrice, setSellingPrice] = useState<string>("");
  const [encodedPrice, setEncodedPrice] = useState<string>("");
  const [bargainPrice, setBargainPriceLocal] = useState<string>("");
  const [firstEncodingChar, setFirstEncodingChar] = useState<string>("A");
  const [secondEncodingChar, setSecondEncodingChar] = useState<string>("X");
  const [codeToCheck, setCodeToCheck] = useState("");
  const [decodedPrice, setDecodedPrice] = useState("");
  const [isBargainAcceptableLocal, setIsBargainAcceptableLocal] = useState<
    boolean | null
  >(null);

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

  const calculateSellingPrice = (buying: string, profit: string): string => {
    const buyingVal = parseFloat(buying);
    const profitVal = parseFloat(profit);
    if (isNaN(buyingVal) || isNaN(profitVal)) return "";
    return (buyingVal * (1 + profitVal / 100)).toFixed(2);
  };

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
    resetFormLocal();
    setShowProductList(true);
  };

  const resetFormLocal = () => {
    setProductName("");
    setBuyingPrice("");
    setProfitMargin("20");
    setSellingPrice("");
    setEncodedPrice("");
    setFirstEncodingChar("A");
    setSecondEncodingChar("X");
    setBargainPriceLocal("");
    setIsBargainAcceptableLocal(null);
    setCodeToCheck("");
    setDecodedPrice("");
  };

  const selectProduct = (product: Product, resetBargain: boolean = true) => {
    const currentBargainPrice = bargainPrice;
    resetFormLocal();
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
      setBargainPriceLocal(currentBargainPrice);
    }
  };

  const removeProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    if (currentProduct && currentProduct.id === id) {
      resetFormLocal();
      setCurrentProduct(null);
    }
  };

  const handleDecodeCheck = () => {
    if (codeToCheck.length >= 2) {
      setDecodedPrice(decodePrice(codeToCheck));
    } else {
      setDecodedPrice("");
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
      setIsBargainAcceptableLocal(null);
      setIsBargainAcceptable(null);
      return;
    }
    const isAcceptable = bargainVal >= buyingVal;
    setIsBargainAcceptableLocal(isAcceptable);
    setIsBargainAcceptable(isAcceptable);
    setBargainPrice(bargainPrice);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4 text-black">Admin Panel</h2>

      {showProductList ? (
        <div>
          <h3 className="font-semibold mb-3 text-black">Product Inventory</h3>
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
                placeholder="เพิ่มชื่อสินค้า"
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
                placeholder="ระบุราคาต้นทุน"
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
                <span className="text-blue-600 font-mono">{encodedPrice}</span>
              </p>
              <div className="mt-4 bg-gray-100 p-4 rounded-md">
                <h4 className="font-medium mb-2">Encoding Information:</h4>
                <p className="text-sm font-mono">
                  First character ({firstEncodingChar}): Maps to digits (
                  {firstEncodingChar}=0,{" "}
                  {String.fromCharCode(firstEncodingChar.charCodeAt(0) + 1)}
                  =1, {String.fromCharCode(firstEncodingChar.charCodeAt(0) + 2)}
                  =2, ...)
                </p>
                <p className="text-sm font-mono">
                  Second character ({secondEncodingChar}): Used for consecutive
                  duplicates
                </p>
                <p className="text-sm font-mono mb-2">
                  Result: {buyingPrice} → {encodedPrice}
                </p>

                <CodeSnippet
                  firstEncodingChar={firstEncodingChar}
                  secondEncodingChar={secondEncodingChar}
                />

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
                Share the selling price with customers. Use the encoded price to
                verify bargains.
              </p>
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-semibold mb-2">Check Bargain:</h3>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={bargainPrice}
                    onChange={(e) => {
                      setBargainPriceLocal(e.target.value);
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

                {isBargainAcceptableLocal !== null && (
                  <p
                    className={`mt-2 ${
                      isBargainAcceptableLocal
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {isBargainAcceptableLocal
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
  );
};

export default AdminPanel;
