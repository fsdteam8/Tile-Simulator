import { Button } from "../ui/button";

interface Props {
  groutThickness: string;
  setGroutThickness: (groutThickness: string) => void;
  setGroutColor: (groutColor: string) => void;
  groutColor: string;
}

function GroutThicknessColor({
  groutThickness,
  setGroutThickness,
  setGroutColor,
  groutColor,
}: Props) {

  const colorBorderMap: Record<string, string> = {
    orange: "border-orange-300",
    green: "border-green-500",
    turquoise: "border-turquoise-500",
    blue: "border-blue-500",
  };
  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between gap-2">
        <div className="space-y-2">
          <h3 className="text-base leading-[120%] text-black font-medium">Grout Thickness:</h3>
          <div className="flex gap-2">
            {["none", "thin", "thick"].map((thickness) => (
              <Button
                className={`py-[10px] px-10 text-sm font-medium leading-[120%] ${groutThickness === thickness ? " text-white bg-[#CE3837]" : "text-[#CE3837] hover:text-[#CE3837] border border-[#CE3837]"} `}
                key={thickness}
                variant={groutThickness === thickness ? "default" : "outline"}
                onClick={() =>
                  setGroutThickness(thickness as "none" | "thin" | "thick")
                }
              >
                {thickness.charAt(0).toUpperCase() + thickness.slice(1)}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-base leading-[120%] text-black font-medium">Grout Color:</h3>
          <div className="flex items-center gap-2">
            {["orange", "green", "turquoise", "blue"].map((color) => (
              <div
                key={color}
                className={`border-2 p-[2px] rounded flex items-center justify-center ${
                  groutColor === color
                    ? colorBorderMap[color]
                    : "border-transparent"
                }`}
              >
                <button
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: color }}
                  onClick={() =>
                    setGroutColor(color as "orange" | "green" | "turquoise" | "blue")
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroutThicknessColor;
