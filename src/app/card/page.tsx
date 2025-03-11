"use client";
import { useEffect, useRef, useState } from "react";

interface CardProps {
  value: number;
  index: number;
  isRevealed?: boolean;
}

const Card = ({ value, index, isRevealed = false }: CardProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const getCardSuit = () => {
    const suits = ["♠", "♥", "♦", "♣"];
    return suits[value % 4];
  };
  const getSuitColor = (suit: string) => {
    return suit === "♥" || suit === "♦" ? "text-red-500" : "text-black";
  };
  const suit = getCardSuit();
  const suitColor = getSuitColor(suit);
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, index * 50);
    return () => clearTimeout(timer);
  }, [index]);

  return (
    <div
      className={`aspect-[3/4] rounded-lg flex items-center justify-center relative
        ${isRevealed ? "bg-blue-100" : "bg-gray-300"}
        transition-all duration-300 ease-out
        ${
          isVisible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-5 scale-90"
        }`}
    >
      {isRevealed && (
        <>
          <span
            className={`absolute top-2 left-2 text-[32px] font-bold ${suitColor}`}
          >
            {suit}
          </span>
          <span
            className={`absolute bottom-2 right-2 text-[32px] font-bold ${suitColor} transform rotate-180`}
          >
            {suit}
          </span>
        </>
      )}
      <span
        className={`text-xl font-bold ${
          isRevealed ? suitColor : "text-blue-500"
        }`}
      >
        {value}
      </span>
    </div>
  );
};

export default function CardPage() {
  const [input, setInput] = useState<string>("");
  const [deck, setDeck] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showStep2, setShowStep2] = useState<boolean>(false);
  const [shuffledDeck, setShuffledDeck] = useState<number[]>([]);
  const [revealedCards, setRevealedCards] = useState<number[]>([]);
  const [remainingDeck, setRemainingDeck] = useState<number[]>([]);
  const [isShuffling, setIsShuffling] = useState<boolean>(false);
  const [isShufflingStep, setIsShufflingStep] = useState<number>(0);
  const [movingCard, setMovingCard] = useState<number | null>(null);
  const [movingCardPosition, setMovingCardPosition] = useState({
    top: 0,
    left: 0,
    opacity: 1,
  });
  const step2Ref = useRef<HTMLDivElement>(null);
  const [isNextClicked, setIsNextClicked] = useState<boolean>(false);
  const [isShufflingAnimation, setIsShufflingAnimation] = useState(false);

  const handleInput = () => {
    setError(null);
    const inputParts = input
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item !== "");
    const hasNonNumeric = inputParts.some((item) => !/^\d+$/.test(item));
    if (hasNonNumeric) {
      setError("กรุณากรอกเฉพาะตัวเลขเท่านั้น");
      return;
    }
    const numbers = inputParts.map((item) => parseInt(item, 10));
    if (numbers.length < 1) {
      setError("กรุณากรอกตัวเลขอย่างน้อย 1 ตัว");
      return;
    }
    if (numbers.length > 1000) {
      setError("จำนวนตัวเลขต้องไม่เกิน 1000 ตัว");
      return;
    }
    const uniqueNumbers = new Set(numbers);
    if (uniqueNumbers.size !== numbers.length) {
      setError("ตัวเลขต้องไม่ซ้ำกัน");
      return;
    }

    const validRange = numbers.every((num) => num >= 1 && num <= 1000000);
    if (!validRange) {
      setError("ตัวเลขแต่ละค่าต้องอยู่ระหว่าง 1 ถึง 1,000,000");
      return;
    }

    setDeck(numbers);
    setShowStep2(false);
    setShuffledDeck([]);
    setRevealedCards([]);
    setRemainingDeck([]);
    setIsNextClicked(false);
  };

    const startSimulation = () => {
    setShowStep2(true);
    setIsNextClicked(true);
    setIsShufflingAnimation(true);
    setRevealedCards([]);

    const shuffled = [...deck].sort((a, b) => a - b);
    setShuffledDeck(shuffled);
    setRemainingDeck([...shuffled]);

    setTimeout(() => {
      if (step2Ref.current) {
        step2Ref.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
    setTimeout(() => {
      setIsShufflingAnimation(false);
    }, 2800);
  };

    const simulateReveal = () => {
    if (isShuffling) return;
    if (revealedCards.length >= shuffledDeck.length) {
      return;
    }
    setIsShuffling(true);
    const newRemaining = [...remainingDeck];
    const cardToReveal = newRemaining.shift();
    if (cardToReveal !== undefined) {
      setMovingCard(cardToReveal);
      setMovingCardPosition({ top: 0, left: 0, opacity: 1 });
      setTimeout(() => {
        setMovingCardPosition({ top: 150, left: 0, opacity: 0.7 });
        setTimeout(() => {
          setMovingCardPosition({ top: 250, left: 0, opacity: 0 });
          setTimeout(() => {
            setRevealedCards((prev) => [...prev, cardToReveal]);
            setMovingCard(null);
            setTimeout(() => {
              setIsShufflingStep(1);
              setTimeout(() => {
                setIsShufflingStep(2);
                setTimeout(() => {
                  setRemainingDeck(newRemaining);
                  setTimeout(() => {
                    setIsShufflingStep(0);
                    setIsShuffling(false);
                  }, 300);
                }, 500);
              }, 500);
            }, 600);
          }, 100);
        }, 300);
      }, 200);
    }
  };

  return (
    <div className="container mx-auto pt-16 p-4 max-w-4xl">
      <h1 className="text-4xl md:text-6xl font-bold mb-8">
        เรียงลำดับไพ่จากน้อยไปหามาก
      </h1>
      <div className="mb-12">
        <h2 className="text-2xl font-bold ">กรอกตัวเลขเพื่อเลือกไพ่</h2>
        <p className="text-sm my-2 mb-8">
          ตัวอย่างการกรอกตัวเลขในช่อง Input Deck: 4,5,6,1,2,3,7,8,9
        </p>
        <div className="flex gap-4 mb-8">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="1, 2, 3, .... < 1000"
            className="flex-grow p-4 border border-gray-300 rounded-lg text-lg"
          />
          <button
            onClick={handleInput}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg text-xl"
          >
            Input Deck
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* {deck.length > 0 && (
          <div className="mb-8 text-2xl">{deck.join(", ")}</div>
        )} */}

        {deck.length > 0 && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 mb-8">
              {deck.map((card, index) => (
                <Card
                  key={index}
                  value={card}
                  index={index}
                  isRevealed={true}
                />
              ))}
            </div>

            <div className="flex justify-center">
              <button
  onClick={startSimulation}
  disabled={isNextClicked || error !== null}
  className={`px-12 py-4 rounded-lg text-2xl ${
    isNextClicked || error !== null
      ? "bg-gray-400 cursor-not-allowed text-gray-200"
      : "bg-blue-500 hover:bg-blue-600 text-white"
  }`}
>
  สับไพ่
</button>
            </div>
          </div>
        )}
      </div>

      {showStep2 && <div className="border-t-2 border-gray-300 my-8"></div>}
      {showStep2 && (
        <div className="mt-8 mb-12 min-h-[680px]" ref={step2Ref}>
          <h2 className="text-2xl font-bold mb-12">
            แสดงการเปิดไพ่แบบเรียงลำดับจาก
            <strong className="text-blue-500">น้อยไปหามาก</strong>
          </h2>

          {/* <div className="text-center mb-8 text-xl">
            ({shuffledDeck.join(", ")})
          </div> */}

          <div className="flex justify-center mb-12 relative">
            <div className="flex items-center gap-8 relative">
              {isShufflingAnimation && (
                <div className="relative w-28 h-40">
                  <div
                    className="absolute rounded-lg w-28 h-40 shadow-md animate-pulse"
                    style={{
                      background:
                        "repeating-linear-gradient(45deg, #606dbc, #606dbc 10px, #465298 10px, #465298 20px)",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  ></div>
                  <div
                    className="absolute rounded-lg w-28 h-40 shadow-md animate-bounce"
                    style={{
                      animationDelay: "0.1s",
                      top: "5px",
                      left: "5px",
                      background:
                        "repeating-linear-gradient(45deg, #465298, #465298 10px, #606dbc 10px, #606dbc 20px)",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  ></div>
                  <div
                    className="absolute rounded-lg w-28 h-40 shadow-md animate-pulse"
                    style={{
                      animationDelay: "0.2s",
                      top: "10px",
                      left: "10px",
                      background:
                        "linear-gradient(135deg, #606dbc 25%, #465298 25%, #465298 50%, #606dbc 50%, #606dbc 75%, #465298 75%, #465298 100%)",
                      backgroundSize: "20px 20px",
                      borderRadius: "0.5rem",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  ></div>
                </div>
              )}
              {!isShufflingAnimation && (
                <div className="relative w-28 h-40">
                  {[...Array(Math.min(3, remainingDeck.length))].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-lg w-28 h-40 shadow-md transition-all duration-300"
                      style={{
                        top: `${i * 3}px`,
                        left: `${i * 3}px`,
                        zIndex: 10 - i,
                        transform:
                          i === 0
                            ? isShufflingStep === 0
                              ? "translateY(0)"
                              : isShufflingStep === 1
                              ? "translateY(-20px)"
                              : "translateX(80px)"
                            : "translateY(0)",
                        opacity: i === 0 && isShufflingStep === 2 ? "0.5" : "1",
                        backgroundColor: "#1e40af",
                        backgroundImage: `linear-gradient(135deg, #606dbc 25%, #465298 25%, #465298 50%, #606dbc 50%, #606dbc 75%, #465298 75%, #465298 100%)`,
                        backgroundSize: "20px 20px",
                        borderRadius: "0.5rem",
                        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                      }}
                    ></div>
                  ))}
                </div>
              )}

              {movingCard !== null && (
                <div
                  className="absolute bg-blue-100 rounded-lg w-28 h-40 shadow-md transition-all duration-500 ease-in-out flex items-center justify-center"
                  style={{
                    top: `${movingCardPosition.top}px`,
                    left: "0",
                    opacity: movingCardPosition.opacity,
                    zIndex: 20,
                    transform: "scale(1)",
                  }}
                >
                  {(() => {
                    const suits = ["♠", "♥", "♦", "♣"];
                    const suit = suits[movingCard % 4];
                    const suitColor =
                      suit === "♥" || suit === "♦"
                        ? "text-red-500"
                        : "text-black";
                    return (
                      <>
                        <span
                          className={`absolute top-2 left-2 text-sm font-bold ${suitColor}`}
                        >
                          {suit}
                        </span>
                        <span
                          className={`absolute bottom-2 right-2 text-sm font-bold ${suitColor} transform rotate-180`}
                        >
                          {suit}
                        </span>
                        <span className={`text-xl font-bold ${suitColor}`}>
                          {movingCard}
                        </span>
                      </>
                    );
                  })()}
                </div>
              )}

              <button
                onClick={simulateReveal}
                disabled={
                  isShuffling || revealedCards.length >= shuffledDeck.length
                }
                className={`
                  px-8 py-4 rounded-lg text-xl 
                  ${
                    isShuffling || revealedCards.length >= shuffledDeck.length
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-blue-500 hover:bg-blue-600 text-white"
                  }
                `}
              >
                {revealedCards.length >= shuffledDeck.length &&
                shuffledDeck.length > 0
                  ? "เปิดไพ่ครบแล้ว"
                  : "เปิดไพ่"}
              </button>
            </div>
          </div>
          {revealedCards.length > 0 && (
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">
                ไพ่ที่เปิดแล้ว (เรียงจากน้อยไปมาก):
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {revealedCards.map((card, index) => (
                  <Card
                    key={index}
                    value={card}
                    index={index}
                    isRevealed={true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
