import TileSimulatorHeader from "./_components/tile-simulator-header";

interface TileSimulatorProps {
  onCategoryChange: (categoryId: string) => void;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  searchQuery: string;
  onAddBorder?: () => void;
}

const TileSimulator = ({
  onCategoryChange,
  onSearchChange,
  selectedCategory,
  searchQuery,
  onAddBorder,
}: TileSimulatorProps) => {
  return (
    <div className="container pb-3 md:pb-4 lg:pb-5 xl:pb-6 2xl:pb-10">
      <h1 className="text-sm md:text-base lg:text-xl xl:text-[22px] 2xl:text-[32px] py-4 font-semibold text-[#5B5B5B] leading-[120%] 2xl:leading-tight text-center md:py-4 xl:py-5 2xl:py-10">
        Select a collection, Select a pattern, Edit your color, <br /> and see
        the look in the preview section.
      </h1>
      <div>
        <TileSimulatorHeader
          onCategoryChange={onCategoryChange}
          onSearchChange={onSearchChange}
          selectedCategory={selectedCategory}
          searchQuery={searchQuery}
          onAddBorder={onAddBorder}
        />
      </div>
    </div>
  );
};

export default TileSimulator;