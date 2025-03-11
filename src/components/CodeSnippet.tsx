"use client";

import React from "react";

interface CodeSnippetProps {
  firstEncodingChar: string;
  secondEncodingChar: string;
}

const CodeSnippet: React.FC<CodeSnippetProps> = ({
  firstEncodingChar,
  secondEncodingChar,
}) => {
  return (
    <div className="mt-4 bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
      <div className="flex mb-2">
        <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
        <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
        <div className="h-3 w-3 rounded-full bg-green-500"></div>
      </div>

      <pre className="font-mono text-sm">
        <span className="text-gray-500">{" // Encode function "}</span>
        <br />
        <span className="text-pink-400">function</span>{" "}
        <span className="text-blue-400">encode</span>(
        <span className="text-orange-400">price</span>) {"{"}
        <br />
        <span className="text-pink-400">const</span> firstChar ={" "}
        <span className="text-green-400">&apos;{firstEncodingChar}&apos;</span>
        ;
        <br />
        <span className="text-pink-400">const</span> secondChar ={" "}
        <span className="text-green-400">&apos;{secondEncodingChar}&apos;</span>
        ;
        <br />
        <span className="text-pink-400">let</span> result = firstChar +
        secondChar;
        <br />
        <span className="text-pink-400">for</span> (
        <span className="text-pink-400"> let</span> i = 0; i &lt; price.length;
        i++) {"{"}
        <br />
        <span className="text-pink-400">if</span> (i {">"} 0 && price[i] ===
        price[i-1]) {"{"}
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
        <span className="text-gray-500">{" // Decode function "}</span>
        <br />
        <span className="text-pink-400">function</span>{" "}
        <span className="text-blue-400">decode</span>(
        <span className="text-orange-400">encoded</span>) {"{"}
        <br />
        <span className="text-pink-400">const</span> firstChar = encoded[0];
        <br />
        <span className="text-pink-400">const</span> secondChar = encoded[1];
        <br />
        <span className="text-pink-400">let</span> result ={" "}
        <span className="text-green-400">&quot;&quot;</span>;
        <br />
        <span className="text-pink-400">for</span> (
        <span className="text-pink-400">let</span> i = 2; i &lt; encoded.length;
        i++) {"{"}
        <br />
        <span className="text-pink-400">if</span> (encoded[i] === secondChar){" "}
        {"{"}
        <br />
        result += result[result.length - 1];
        <br />
        {"}"} <span className="text-pink-400">else</span> {"{"}
        <br />
        result += (encoded[i].charCodeAt(0) - firstChar.charCodeAt(0));
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
  );
};

export default CodeSnippet;
