import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import WelcomeScreen from './screens/WelcomeScreen';
import WishScreen from './screens/WishScreen';
import GameIntroScreen from './screens/GameIntroScreen';
import PlatformerGame from './screens/PlatformerGame';
import GiftSelection from './screens/GiftSelection';
import FinalWish from './screens/FinalWish';

function App() {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [selectedGift, setSelectedGift] = useState<string | null>(null);

  useEffect(() => {
    const fetchGift = async () => {
      const docRef = doc(db, 'gifts', 'selectedGift');
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setSelectedGift(docSnap.data().gift);
      }
    };
    fetchGift();
  }, []);

  const handleGiftSelection = async (gift: string) => {
    setSelectedGift(gift);
    await setDoc(doc(db, 'gifts', 'selectedGift'), { gift });
    console.log("Selected gift is ", gift);
    setCurrentScreen(5);
  };

  const screens = [
    <WelcomeScreen onNext={() => setCurrentScreen(1)} />,
    <WishScreen onNext={() => setCurrentScreen(2)} />,
    <GameIntroScreen onNext={() => setCurrentScreen(3)} />,
    <PlatformerGame onComplete={() => setCurrentScreen(4)} />,
    <GiftSelection onSelect={handleGiftSelection} />,
    <FinalWish selectedGift={selectedGift} />
  ];

  return (
    <div className="w-screen h-screen overflow-hidden">
      {screens[currentScreen]}
    </div>
  );
}

export default App;