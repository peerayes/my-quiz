import LoginPage from "@/components/LoginPage";
import { loginPageData } from "@/constant/loginData";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 w-full">
      <LoginPage data={loginPageData} />
      <div className="py-12 md:max-w-[640px] container mx-auto flex flex-col gap-4">
        <h1 className="font-bold text-black text-4xl">
          Quiz{" "}
          <span className="text-sm text-gray-400">
            Test javascript and logic
          </span>
        </h1>
        <div className="mt-4 bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
          <div className="flex mb-2">
            <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>

          <pre className="font-mono text-sm">
            <Link
              href="/card"
              className="text-white text-2xl pt-4 flex items-center"
              target="_blank"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              1. Deck of Cards
            </Link>
            <br />
            <span className="text-pink-400">เรียงลำดับไพ่</span>{" "}
            <span className="text-blue-400">จาก</span>(
            <span className="text-orange-400">น้อยไปหามาก</span>) {"{"}
            <br />
            <span className="text-gray-400">
              {" // เรียงลำดับไพ่ในสำรับโดยใช้เทคนิคย้อนกลับจากผลลัพธ์ "}
            </span>
            <br />
            <span className="text-green-300">const</span>{" "}
            <span className="text-blue-300">sortedDeck</span> = [...deck].
            <span className="text-yellow-300">sort</span>((a, b) ={">"} a - b);{" "}
            <br />
            <span className="text-green-300">const</span>{" "}
            <span className="text-blue-300">positions</span> = [];{" "}
            <span className="text-gray-400">{" // เก็บลำดับตำแหน่ง "}</span>
            <br />
            <span className="text-green-300">for</span> (
            <span className="text-blue-300">let</span> i = 0; i &lt; n; i++)
            positions.push(i);
            <br />
            <br />
            <span className="text-green-300">for</span> (
            <span className="text-blue-300">let</span> i = 0; i &lt; n; i++){" "}
            {"{"}
            <br />
            <span className="pl-4 text-blue-300">
              const pos = positions.shift();
            </span>{" "}
            <br />
            <span className="text-gray-400">{" // ตำแหน่งปัจจุบัน "}</span>
            <br />
            <span className="pl-4 text-blue-300">
              result[pos] = sortedDeck[i];
            </span>{" "}
            <br />
            <span className="text-gray-400">{" // วางไพ่ลงตำแหน่ง "}</span>
            <br />
            <span className="pl-4 text-blue-300">
              if (positions.length {">"} 0) {"{"}{" "}
            </span>
            <br />
            <span className="pl-8 text-blue-300">
              positions.push(positions[0]);
            </span>{" "}
            <br />
            <span className="text-gray-400">{"// ย้ายตัวถัดไปไปท้ายคิว"}</span>
            <br />
            <span className="pl-8 text-blue-300">positions.shift();</span>
            <br />
            <span className="pl-4 text-blue-300">{"}"}</span>
            <br />
            <span className="text-blue-300">{"}"}</span>
            <br />
            <span className="text-pink-400">return</span> result;
            <br />
            {"}"}
            <br />
            <br />
          </pre>
        </div>

        <div className="mt-4 bg-gray-800 text-white p-4 rounded-lg overflow-x-auto">
          <div className="flex mb-2">
            <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
            <div className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
          </div>

          <pre className="font-mono text-sm">
            <Link
              href="/retail"
              className="text-white text-2xl pt-4 flex items-center"
              target="_blank"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
              2. Retail Business
            </Link>
            <br />
            <span className="text-pink-400">หลักการทำงาน</span>{" "}
            <span className="text-blue-400">ของระบบ</span>(
            <span className="text-orange-400">เข้ารหัส</span>) {"{"}
            <br />
            <span className="text-gray-500">{"// มุมมองแอดมิน"}</span>
            <br />
            <span className="pl-4">
              • เพิ่มสินค้าใหม่พร้อมชื่อ, ราคาต้นทุน, และมาร์จิ้น
            </span>
            <br />
            <span className="pl-4">• ระบบคำนวณราคาขายและสร้างรหัสเฉพาะ</span>
            <br />
            <span className="pl-4">
              • ตรวจสอบการต่อรองราคาว่าอยู่เหนือราคาต้นทุนหรือไม่
            </span>
            <br />
            <span className="pl-4">• จัดการรายการสินค้าทั้งหมดในระบบ</span>
            <br />
            <br />
            <span className="text-gray-500">{"// มุมมองลูกค้า"}</span>
            <br />
            <span className="pl-4">
              • แสดงรายการสินค้าพร้อมราคาขายและรหัสสินค้า
            </span>
            <br />
            <span className="pl-4">• ลูกค้าสามารถเสนอราคาต่อรอง</span>
            <br />
            <span className="pl-4">
              • แสดงผลทันทีว่าราคาที่เสนอได้รับการยอมรับหรือไม่
            </span>
            <br />
            <br />
            <span className="text-gray-500">
              {"// หลักการเข้ารหัส (Encode)"}
            </span>
            <br />
            <span className="pl-4">
              1. เริ่มต้นด้วยอักษรรหัส 2 ตัว (เช่น AX)
            </span>
            <br />
            <span className="pl-4">
              2. แปลงตัวเลขเป็นตัวอักษร (A=0, B=1, ...)
            </span>
            <br />
            <span className="pl-4">
              3. หากพบตัวเลขซ้ำติดกัน ใช้ตัวอักษรที่ 2 แทน
            </span>
            <br />
            <span className="pl-4 text-green-400">ตัวอย่าง: 1234 → ABCDE</span>
            <br />
            <br />
            <span className="text-gray-500">{"// การถอดรหัส (Decode)"}</span>
            <br />
            <span className="pl-4">1. อ่านอักษร 2 ตัวแรกเป็นรหัสนำ</span>
            <br />
            <span className="pl-4">
              2. แปลงตัวอักษรกลับเป็นตัวเลขโดย อักษร-A
            </span>
            <br />
            <span className="pl-4">
              3. หากพบอักษรตัวที่ 2 ให้ใช้ตัวเลขล่าสุดซ้ำ
            </span>
            <br />
            <span className="pl-4 text-yellow-400">ตัวอย่าง: ABCDE → 1234</span>
            <br />
            <span className="text-pink-400">return</span> result;
            <br />
            {"}"}
            <br />
            <br />
          </pre>
        </div>
      </div>
    </div>
  );
}
