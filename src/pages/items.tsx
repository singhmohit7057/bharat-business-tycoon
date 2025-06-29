import Link from 'next/link';
import { useGameStore } from '@/store/useGameStore';

export default function ItemsPage() {
  const {
    garageItems = [],
    ownedCars = [],
    hangerItems = [],
    ownedPlanes = [],
    harborItems = [],
    ownedShips = [],

    islandItems = [],
    ownedIslands = [],
    coinsItems = [],
    ownedCoins = [],
    paintingsItems = [],
    ownedPaintings = [],
    uniqueItems = [],
    ownedUnique = [],
    retroCarsItems = [],
    ownedRetroCars = [],
    jewelsItems = [],
    ownedJewels = [],
    stampsItems = [],
    ownedStamps = [],
    nftItems = [],
    ownedNfts = [],
    residenceItems = [],
    ownedResidences = [],
  } = useGameStore((state) => state);

  const itemCategories = [
    {
      name: 'Garage',
      image: '/items/garage.jpg',
      count: `${ownedCars.length} of ${garageItems.length}`,
      path: '/items/garage',
    },
    {
      name: 'Hanger',
      image: '/items/hanger.jpg',
      count: `${ownedPlanes.length} of ${hangerItems.length}`,
      path: '/items/hanger',
    },
    {
      name: 'Harbor',
      image: '/items/harbor.jpg',
      count: `${ownedShips.length} of ${harborItems.length}`,
      path: '/items/harbor',
    },
  ];

  const residenceCategories = [
    { name: 'Residence', image: '/items/residence.jpg', count: '0 of 20', path: '/items/residence' }, // Placeholder
  ];

  const islandsCategories = [
    {
      name: 'Islands',
      image: '/items/islands.jpg',
      count: `${ownedIslands.length} of ${islandItems.length}`,
      path: '/items/islands',
    },
  ];

  const collectionCategories = [
    {
      name: 'Coins',
      image: '/items/coins.jpg',
      count: `${ownedCoins.length} of ${coinsItems.length}`,
      path: '/items/coins',
    },
    {
      name: 'Paintings',
      image: '/items/paintings.jpg',
      count: `${ownedPaintings.length} of ${paintingsItems.length}`,
      path: '/items/paintings',
    },
    {
      name: 'Unique Items',
      image: '/items/uniqueitems.jpg',
      count: `${ownedUnique.length} of ${uniqueItems.length}`,
      path: '/items/unique',
    },
    {
      name: 'Retro Cars',
      image: '/items/retrocars.jpg',
      count: `${ownedRetroCars.length} of ${retroCarsItems.length}`,
      path: '/items/retrocars',
    },
    {
      name: 'Jewels',
      image: '/items/jewels.jpg',
      count: `${ownedJewels.length} of ${jewelsItems.length}`,
      path: '/items/jewels',
    },
    {
      name: 'Stamps',
      image: '/items/stamps.jpg',
      count: `${ownedStamps.length} of ${stampsItems.length}`,
      path: '/items/stamps',
    },
  ];

  const nftCategories = [
    {
      name: 'NFT',
      image: '/items/nft.jpg',
      count: `${ownedNfts.length} of ${nftItems.length}`,
      path: '/items/nft',
    },
  ];

  const renderCategorySection = (title: string, categories: typeof itemCategories) => (
    <>
      <h1 className="text-2xl font-bold text-gray-800 mb-5">{title}</h1>
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 mb-8">
        {categories.map((cat) => (
          <Link
            key={cat.name}
            href={cat.path}
            className="block rounded-2xl bg-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-4 flex flex-col items-center justify-center">
              <img src={cat.image} alt={cat.name} className="w-16 h-16 object-contain mb-2" />
              <p className="text-lg font-semibold text-gray-800 text-center">{cat.name}</p>
              <p className="text-sm text-gray-500 text-center">{cat.count}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );

  return (
    <div className="bg-white py-6 px-4 sm:px-6 lg:px-8 min-h-screen">
      {renderCategorySection('Items', itemCategories)}
      {renderCategorySection('Residence', residenceCategories)}
      {renderCategorySection('Island', islandsCategories)}
      {renderCategorySection('Collections', collectionCategories)}
      {renderCategorySection('NFT', nftCategories)}
    </div>
  );
}
